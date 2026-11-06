import { prisma } from "@/core/db/prisma";
import {
  InventoryFilterInput,
  RegisterPurchaseIntentInput,
} from "@/modules/inventory/validations/sales.schema";
import { ActivityType, DealStage, LeadStatus, Prisma, UnitStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface OccupancyAnalytics {
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  blockedUnits: number;
  occupancyPct: number;
  availablePct: number;
  reservedPct: number;
  soldPct: number;
  blockedPct: number;
  totalInventoryValueMxn: number;
  absorbedInventoryValueMxn: number;
  avgPricePerM2Mxn: number;
}

export class InventoryCrmService {
  /**
   * Obtiene la matriz de unidades filtrada junto con el bloque analítico de ocupación
   * y absorción comercial en tiempo real.
   */
  public static async getDevelopmentInventoryMatrix(filter: InventoryFilterInput) {
    const whereClause: Prisma.UnitWhereInput = {
      developmentId: filter.developmentId,
      ...(filter.phaseId ? { phaseId: filter.phaseId } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.floorLevel !== undefined ? { floorLevel: filter.floorLevel } : {}),
      ...(filter.bedrooms !== undefined
        ? {
            typology: {
              bedrooms: filter.bedrooms >= 3 ? { gte: 3 } : filter.bedrooms,
            },
          }
        : {}),
      ...(filter.minPricePerM2 !== undefined || filter.maxPricePerM2 !== undefined
        ? {
            pricePerM2: {
              ...(filter.minPricePerM2 !== undefined ? { gte: filter.minPricePerM2 } : {}),
              ...(filter.maxPricePerM2 !== undefined ? { lte: filter.maxPricePerM2 } : {}),
            },
          }
        : {}),
    };

    const [allDevelopmentUnits, filteredUnits, paymentPlans] = await Promise.all([
      prisma.unit.findMany({
        where: { developmentId: filter.developmentId },
        select: {
          id: true,
          status: true,
          currentPrice: true,
          pricePerM2: true,
        },
      }),
      prisma.unit.findMany({
        where: whereClause,
        include: {
          phase: true,
          typology: true,
          deals: {
            where: {
              stage: {
                notIn: [DealStage.CLOSED_LOST],
              },
            },
            include: {
              lead: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: [{ floorLevel: "asc" }, { unitNumber: "asc" }],
      }),
      prisma.paymentPlan.findMany({
        where: {
          developmentId: filter.developmentId,
          isActive: true,
        },
        orderBy: { downPaymentPct: "asc" },
      }),
    ]);

    const analytics = InventoryCrmService.computeOccupancyAnalytics(allDevelopmentUnits);

    return {
      analytics,
      units: filteredUnits,
      paymentPlans,
    };
  }

  /**
   * Calcula las métricas agregadas de ocupación porcentual y absorción financiera.
   */
  public static computeOccupancyAnalytics(
    units: Array<{
      status: UnitStatus;
      currentPrice: Decimal | number;
      pricePerM2: Decimal | number;
    }>
  ): OccupancyAnalytics {
    const totalUnits = units.length;
    if (totalUnits === 0) {
      return {
        totalUnits: 0,
        availableUnits: 0,
        reservedUnits: 0,
        soldUnits: 0,
        blockedUnits: 0,
        occupancyPct: 0,
        availablePct: 0,
        reservedPct: 0,
        soldPct: 0,
        blockedPct: 0,
        totalInventoryValueMxn: 0,
        absorbedInventoryValueMxn: 0,
        avgPricePerM2Mxn: 0,
      };
    }

    let availableUnits = 0;
    let reservedUnits = 0;
    let soldUnits = 0;
    let blockedUnits = 0;
    let totalInventoryValueMxn = 0;
    let absorbedInventoryValueMxn = 0;
    let sumPricePerM2 = 0;

    for (const unit of units) {
      const price = Number(unit.currentPrice);
      const ppm2 = Number(unit.pricePerM2);
      totalInventoryValueMxn += price;
      sumPricePerM2 += ppm2;

      switch (unit.status) {
        case UnitStatus.AVAILABLE:
          availableUnits += 1;
          break;
        case UnitStatus.RESERVED:
          reservedUnits += 1;
          absorbedInventoryValueMxn += price;
          break;
        case UnitStatus.SOLD:
        case UnitStatus.UNDER_CONTRACT:
          soldUnits += 1;
          absorbedInventoryValueMxn += price;
          break;
        case UnitStatus.BLOCKED:
          blockedUnits += 1;
          break;
      }
    }

    const comercialAbsorbedCount = soldUnits + reservedUnits;
    const occupancyPct = Number(((comercialAbsorbedCount / totalUnits) * 100).toFixed(1));
    const availablePct = Number(((availableUnits / totalUnits) * 100).toFixed(1));
    const reservedPct = Number(((reservedUnits / totalUnits) * 100).toFixed(1));
    const soldPct = Number(((soldUnits / totalUnits) * 100).toFixed(1));
    const blockedPct = Number(((blockedUnits / totalUnits) * 100).toFixed(1));

    return {
      totalUnits,
      availableUnits,
      reservedUnits,
      soldUnits,
      blockedUnits,
      occupancyPct,
      availablePct,
      reservedPct,
      soldPct,
      blockedPct,
      totalInventoryValueMxn: Number(totalInventoryValueMxn.toFixed(2)),
      absorbedInventoryValueMxn: Number(absorbedInventoryValueMxn.toFixed(2)),
      avgPricePerM2Mxn: Number((sumPricePerM2 / totalUnits).toFixed(2)),
    };
  }

  /**
   * Conecta directamente una unidad del inventario maestro con un Lead en el pipeline del CRM
   * para registrar intención formal de compra.
   */
  public static async registerPurchaseIntent(
    input: RegisterPurchaseIntentInput,
    agentId: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const [unit, lead] = await Promise.all([
        tx.unit.findUnique({
          where: { id: input.unitId },
          include: { typology: true, phase: true },
        }),
        tx.lead.findUnique({
          where: { id: input.leadId },
        }),
      ]);

      if (!unit) {
        throw new Error("La unidad seleccionada no existe.");
      }

      if (unit.status === UnitStatus.SOLD || unit.status === UnitStatus.BLOCKED) {
        throw new Error(
          `La unidad ${unit.unitNumber} no admite registro de intención de compra en estatus ${unit.status}.`
        );
      }

      if (!lead) {
        throw new Error("El Lead seleccionado no existe en el padrón comercial.");
      }

      // Buscar si el Lead ya cuenta con un Deal abierto para esta unidad
      const existingDeal = await tx.deal.findFirst({
        where: {
          leadId: lead.id,
          unitId: unit.id,
          stage: {
            notIn: [DealStage.CLOSED_WON, DealStage.CLOSED_LOST],
          },
        },
      });

      const stageProbabilityMap: Record<DealStage, number> = {
        [DealStage.PROSPECT]: 15,
        [DealStage.DISCOVERY_CALL]: 25,
        [DealStage.SHOWING_SCHEDULED]: 35,
        [DealStage.VISIT_COMPLETED]: 40,
        [DealStage.NEGOTIATION]: 55,
        [DealStage.RESERVED]: 75,
        [DealStage.CONTRACT_IN_REVIEW]: 85,
        [DealStage.CLOSED_WON]: 100,
        [DealStage.CLOSED_LOST]: 0,
      };

      const deal = existingDeal
        ? await tx.deal.update({
            where: { id: existingDeal.id },
            data: {
              stage: input.initialStage,
              dealValue: unit.currentPrice,
              probability: stageProbabilityMap[input.initialStage],
            },
          })
        : await tx.deal.create({
            data: {
              leadId: lead.id,
              agentId,
              unitId: unit.id,
              stage: input.initialStage,
              dealValue: unit.currentPrice,
              currency: unit.currency,
              probability: stageProbabilityMap[input.initialStage],
            },
          });

      // Calificar el Lead automáticamente al vincularse a una unidad específica
      if (lead.status === LeadStatus.NEW || lead.status === LeadStatus.CONTACTED) {
        await tx.lead.update({
          where: { id: lead.id },
          data: { status: LeadStatus.QUALIFIED },
        });
      }

      await tx.activity.create({
        data: {
          dealId: deal.id,
          leadId: lead.id,
          userId: agentId,
          type: ActivityType.NOTE,
          subject: `Intención de compra vinculada — Unidad ${unit.unitNumber} (${unit.typology.code})`,
          body: `Lead ${lead.firstName} ${lead.lastName} vinculado a la unidad ${unit.unitNumber} en ${unit.phase.name} con valor de lista de $${Number(unit.currentPrice).toLocaleString("es-MX")} ${unit.currency}. ${input.notes ?? ""}`,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      return deal;
    });
  }
}
