import { prisma } from "@/core/db/prisma";
import {
  ComparableWitnessInput,
  SubjectPropertyInput,
} from "@/modules/ai-engine/validations/valuation.schema";
import {
  ConservationState,
  Prisma,
  ValuationMethod,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface HomologatedWitnessBreakdown {
  sourceName: string;
  sourceUrl?: string;
  listingPrice: number;
  totalAreaM2: number;
  rawPricePerM2: number;
  distanceMeters: number;
  conservationState: ConservationState;
  areaFactor: number;
  conservationFactor: number;
  proximityWeight: number;
  adjustedPriceM2: number;
  similarityFactor: number;
  isOutlier: boolean;
}

export interface ValuationSimulationResult {
  estimatedValueMxn: number;
  estimatedPriceM2Mxn: number;
  valueRangeMinMxn: number;
  valueRangeMaxMxn: number;
  confidenceScorePct: number;
  projectedCapRatePct: number;
  projectedRoi5YPct: number;
  appreciation3YPct: number;
  appreciation5YPct: number;
  projectedValue3YMxn: number;
  projectedValue5YMxn: number;
  homologatedWitnesses: HomologatedWitnessBreakdown[];
}

export class ValuationEngineService {
  private static readonly CONSERVATION_WEIGHTS: Record<ConservationState, number> = {
    LUXURY_REMODELED: 1.15,
    EXCELLENT: 1.05,
    GOOD: 1.0,
    REGULAR: 0.88,
    REQUIRES_REPAIR: 0.72,
  };

  /**
   * Homologa el valor por m² de un testigo frente al inmueble sujeto.
   * Aplica factor de escala por superficie: (Area_sujeto / Area_testigo)^-0.12,
   * factor de conservación y decaimiento exponencial por distancia geodésica.
   */
  public static calculateHomologatedPriceM2(
    subject: SubjectPropertyInput,
    witness: ComparableWitnessInput
  ): {
    rawPricePerM2: number;
    areaFactor: number;
    conservationFactor: number;
    proximityWeight: number;
    adjustedPriceM2: number;
    similarityFactor: number;
  } {
    const rawPricePerM2 = witness.listingPrice / witness.totalAreaM2;

    // 1. Factor de Superficie (elasticidad de escala inmobiliaria)
    const areaFactor = Math.pow(subject.totalAreaM2 / witness.totalAreaM2, -0.12);

    // 2. Factor de Estado de Conservación
    const subjectConsWeight =
      ValuationEngineService.CONSERVATION_WEIGHTS[subject.conservationState];
    const witnessConsWeight =
      ValuationEngineService.CONSERVATION_WEIGHTS[witness.conservationState];
    const conservationFactor = subjectConsWeight / witnessConsWeight;

    // 3. Factor de Proximidad Geodésica (decaimiento exponencial)
    const distanceKm = Math.max(witness.distanceMeters / 1000, 0.05);
    const proximityWeight = Math.exp(-0.5 * distanceKm);

    // 4. Ajuste por depreciación de edad (0.35% anual hasta 20% máx)
    const agePenalty = Math.max(0.8, 1 - subject.ageYears * 0.0035);

    const adjustedPriceM2 = rawPricePerM2 * areaFactor * conservationFactor * agePenalty;
    const similarityFactor = Math.min(
      Math.max(proximityWeight * (1 / (1 + Math.abs(1 - areaFactor))), 0.1),
      0.99
    );

    return {
      rawPricePerM2: Number(rawPricePerM2.toFixed(2)),
      areaFactor: Number(areaFactor.toFixed(4)),
      conservationFactor: Number(conservationFactor.toFixed(4)),
      proximityWeight: Number(proximityWeight.toFixed(4)),
      adjustedPriceM2: Number(adjustedPriceM2.toFixed(2)),
      similarityFactor: Number(similarityFactor.toFixed(2)),
    };
  }

  /**
   * Simulación determinista pura del algoritmo híbrido de valuación hedónica + mercado.
   */
  public static simulateValuation(
    subject: SubjectPropertyInput,
    witnesses: ComparableWitnessInput[],
    zoneMetrics: {
      historicalCapRatePct: number;
      annualAppreciationPct: number;
    }
  ): ValuationSimulationResult {
    if (witnesses.length < 3) {
      throw new Error(
        "Se requieren al menos 3 testigos de mercado para un estudio confiable."
      );
    }

    const preliminary = witnesses.map((witness) => {
      const calc = ValuationEngineService.calculateHomologatedPriceM2(subject, witness);
      return {
        witness,
        ...calc,
      };
    });

    // Cálculo de media preliminar para detección de outliers (> 28% de desviación)
    const meanAdjustedPriceM2 =
      preliminary.reduce((acc, item) => acc + item.adjustedPriceM2, 0) /
      preliminary.length;

    let weightedSumPriceM2 = 0;
    let totalWeight = 0;

    const homologatedWitnesses: HomologatedWitnessBreakdown[] = preliminary.map(
      (item) => {
        const deviationRatio =
          Math.abs(item.adjustedPriceM2 - meanAdjustedPriceM2) / meanAdjustedPriceM2;
        const isOutlier = deviationRatio > 0.28;
        const effectiveWeight = isOutlier
          ? Number((item.similarityFactor * 0.25).toFixed(2))
          : item.similarityFactor;

        weightedSumPriceM2 += item.adjustedPriceM2 * effectiveWeight;
        totalWeight += effectiveWeight;

        return {
          sourceName: item.witness.sourceName,
          sourceUrl: item.witness.sourceUrl,
          listingPrice: item.witness.listingPrice,
          totalAreaM2: item.witness.totalAreaM2,
          rawPricePerM2: item.rawPricePerM2,
          distanceMeters: item.witness.distanceMeters,
          conservationState: item.witness.conservationState,
          areaFactor: item.areaFactor,
          conservationFactor: item.conservationFactor,
          proximityWeight: item.proximityWeight,
          adjustedPriceM2: item.adjustedPriceM2,
          similarityFactor: item.similarityFactor,
          isOutlier,
        };
      }
    );

    const estimatedPriceM2Mxn = Number((weightedSumPriceM2 / totalWeight).toFixed(2));
    const estimatedValueMxn = Number(
      (estimatedPriceM2Mxn * subject.totalAreaM2).toFixed(2)
    );

    // Banda de confianza (+- 6.5%)
    const margin = 0.065;
    const valueRangeMinMxn = Number((estimatedValueMxn * (1 - margin)).toFixed(2));
    const valueRangeMaxMxn = Number((estimatedValueMxn * (1 + margin)).toFixed(2));

    const confidenceScorePct = Math.min(
      Math.round((totalWeight / witnesses.length) * 100),
      96
    );

    // Proyecciones de plusvalía compuesta a 3 y 5 años y Cap Rate ajustado por amenidades
    const annualRate = zoneMetrics.annualAppreciationPct / 100;
    const appreciation3YPct = Number(
      ((Math.pow(1 + annualRate, 3) - 1) * 100).toFixed(2)
    );
    const appreciation5YPct = Number(
      ((Math.pow(1 + annualRate, 5) - 1) * 100).toFixed(2)
    );

    const projectedValue3YMxn = Number(
      (estimatedValueMxn * (1 + appreciation3YPct / 100)).toFixed(2)
    );
    const projectedValue5YMxn = Number(
      (estimatedValueMxn * (1 + appreciation5YPct / 100)).toFixed(2)
    );

    const amenityCapBonus = Math.min(subject.amenitiesCount * 0.08, 0.65);
    const projectedCapRatePct = Number(
      (zoneMetrics.historicalCapRatePct + amenityCapBonus).toFixed(2)
    );
    const projectedRoi5YPct = Number(
      (appreciation5YPct + projectedCapRatePct * 5).toFixed(2)
    );

    return {
      estimatedValueMxn,
      estimatedPriceM2Mxn,
      valueRangeMinMxn,
      valueRangeMaxMxn,
      confidenceScorePct,
      projectedCapRatePct,
      projectedRoi5YPct,
      appreciation3YPct,
      appreciation5YPct,
      projectedValue3YMxn,
      projectedValue5YMxn,
      homologatedWitnesses,
    };
  }

  /**
   * Ejecuta y persiste en PostgreSQL el estudio de valuación completo junto con sus testigos.
   */
  public static async executeStudy(
    subject: SubjectPropertyInput,
    witnesses: ComparableWitnessInput[]
  ) {
    const zone = await prisma.submarketZone.findUnique({
      where: { id: subject.submarketZoneId },
    });

    if (!zone) {
      throw new Error("Zona de submercado no registrada.");
    }

    const simulation = ValuationEngineService.simulateValuation(subject, witnesses, {
      historicalCapRatePct: Number(zone.historicalCapRate),
      annualAppreciationPct: Number(zone.annualAppreciation),
    });

    const processedComparables: Prisma.ValuationComparableCreateWithoutValuationStudyInput[] =
      simulation.homologatedWitnesses.map((hw) => ({
        sourceName: hw.sourceName,
        sourceUrl: hw.sourceUrl,
        listingPrice: new Decimal(hw.listingPrice),
        totalAreaM2: new Decimal(hw.totalAreaM2),
        pricePerM2: new Decimal(hw.rawPricePerM2),
        distanceMeters: hw.distanceMeters,
        similarityFactor: new Decimal(hw.similarityFactor),
        isOutlier: hw.isOutlier,
      }));

    const year = new Date().getFullYear();
    const count = await prisma.valuationStudy.count();
    const folioNumber = `VAL-${year}-${String(count + 1).padStart(4, "0")}`;

    return await prisma.valuationStudy.create({
      data: {
        folioNumber,
        userId: subject.userId,
        submarketZoneId: subject.submarketZoneId,
        propertyType: subject.propertyType,
        totalAreaM2: new Decimal(subject.totalAreaM2),
        interiorAreaM2: new Decimal(subject.interiorAreaM2),
        ageYears: subject.ageYears,
        conservationState: subject.conservationState,
        parkingSpots: subject.parkingSpots,
        amenitiesCount: subject.amenitiesCount,
        latitude: new Decimal(subject.latitude),
        longitude: new Decimal(subject.longitude),
        methodUsed: ValuationMethod.HYBRID_WEIGHTED,
        estimatedValue: new Decimal(simulation.estimatedValueMxn),
        estimatedPriceM2: new Decimal(simulation.estimatedPriceM2Mxn),
        valueRangeMin: new Decimal(simulation.valueRangeMinMxn),
        valueRangeMax: new Decimal(simulation.valueRangeMaxMxn),
        confidenceScore: new Decimal(simulation.confidenceScorePct),
        projectedCapRate: new Decimal(simulation.projectedCapRatePct),
        projectedRoi: new Decimal(simulation.projectedRoi5YPct),
        appreciation3Y: new Decimal(simulation.appreciation3YPct),
        appreciation5Y: new Decimal(simulation.appreciation5YPct),
        comparables: {
          create: processedComparables,
        },
      },
      include: {
        comparables: true,
        submarketZone: true,
      },
    });
  }
}
