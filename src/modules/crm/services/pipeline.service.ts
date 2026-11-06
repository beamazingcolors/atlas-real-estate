import { prisma } from "@/core/db/prisma";
import {
  LogDealActivityInput,
  STAGE_PROBABILITIES,
  UpdateDealStageInput,
} from "@/modules/crm/validations/pipeline.schema";
import {
  ActivityType,
  DealStage,
  ReservationStatus,
  UnitStatus,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface DealStageMutationResult {
  dealId: string;
  previousStage: DealStage;
  newStage: DealStage;
  probability: number;
  dealValueMxn: number;
  weightedValueMxn: number;
  syncedUnitStatus: UnitStatus | null;
}

export interface PipelineForecastMetrics {
  totalActiveDeals: number;
  grossPipelineValueMxn: number;
  weightedForecastValueMxn: number;
  closedWonValueMxn: number;
  averageProbabilityPct: number;
  stageBreakdown: Array<{
    stage: DealStage;
    count: number;
    grossValueMxn: number;
    weightedValueMxn: number;
  }>;
}

export class CrmPipelineService {
  /**
   * Ejecuta la transición atómica de etapa de un Deal en el pipeline,
   * sincroniza el estatus de la unidad vinculada en el Inventario Maestro
   * y registra la auditoría en la bitácora comercial.
   */
  public static async updateDealStage(
    input: UpdateDealStageInput
  ): Promise<DealStageMutationResult> {
    const newProbability = STAGE_PROBABILITIES[input.newStage];

    return await prisma.$transaction(async (tx) => {
      const currentDeal = await tx.deal.findUnique({
        where: { id: input.dealId },
        select: {
          id: true,
          leadId: true,
          stage: true,
          agentId: true,
          unitId: true,
          dealValue: true,
          currency: true,
        },
      });

      if (!currentDeal) {
        throw new Error("Deal no localizado en base de datos.");
      }

      const dealValueNumeric = Number(currentDeal.dealValue);

      if (currentDeal.stage === input.newStage) {
        return {
          dealId: currentDeal.id,
          previousStage: currentDeal.stage,
          newStage: currentDeal.stage,
          probability: newProbability,
          dealValueMxn: dealValueNumeric,
          weightedValueMxn: Number(((dealValueNumeric * newProbability) / 100).toFixed(2)),
          syncedUnitStatus: null,
        };
      }

      const updatedDeal = await tx.deal.update({
        where: { id: input.dealId },
        data: {
          stage: input.newStage,
          probability: newProbability,
          lostReason:
            input.newStage === DealStage.CLOSED_LOST ? (input.lostReason ?? null) : null,
        },
      });

      // Sincronización bidireccional con el Inventario Maestro si el Deal tiene unidad asignada
      let syncedUnitStatus: UnitStatus | null = null;

      if (currentDeal.unitId) {
        if (input.newStage === DealStage.CONTRACT_IN_REVIEW) {
          await tx.unit.update({
            where: { id: currentDeal.unitId },
            data: { status: UnitStatus.UNDER_CONTRACT },
          });
          syncedUnitStatus = UnitStatus.UNDER_CONTRACT;
        } else if (input.newStage === DealStage.CLOSED_WON) {
          await tx.unit.update({
            where: { id: currentDeal.unitId },
            data: { status: UnitStatus.SOLD },
          });
          await tx.reservation.updateMany({
            where: {
              dealId: currentDeal.id,
              unitId: currentDeal.unitId,
              status: {
                in: [ReservationStatus.PENDING_PAYMENT, ReservationStatus.VALIDATED],
              },
            },
            data: { status: ReservationStatus.APPLIED_TO_CONTRACT },
          });
          syncedUnitStatus = UnitStatus.SOLD;
        } else if (input.newStage === DealStage.CLOSED_LOST) {
          // Si la unidad estaba apartada o en revisión de contrato para este Deal, se libera a AVAILABLE
          await tx.unit.updateMany({
            where: {
              id: currentDeal.unitId,
              status: { in: [UnitStatus.RESERVED, UnitStatus.UNDER_CONTRACT] },
            },
            data: { status: UnitStatus.AVAILABLE },
          });
          await tx.reservation.updateMany({
            where: {
              dealId: currentDeal.id,
              unitId: currentDeal.unitId,
              status: ReservationStatus.PENDING_PAYMENT,
            },
            data: { status: ReservationStatus.CANCELLED },
          });
          syncedUnitStatus = UnitStatus.AVAILABLE;
        }
      }

      const weightedValueMxn = Number(
        ((dealValueNumeric * newProbability) / 100).toFixed(2)
      );

      await tx.activity.create({
        data: {
          dealId: currentDeal.id,
          leadId: currentDeal.leadId,
          userId: currentDeal.agentId,
          type: ActivityType.TASK_FOLLOW_UP,
          subject: `Transición de etapa: ${currentDeal.stage} -> ${input.newStage}`,
          body: `Probabilidad ajustada a ${newProbability}%. Valor ponderado: $${weightedValueMxn.toLocaleString("es-MX")} ${currentDeal.currency}.${
            input.newStage === DealStage.CLOSED_LOST && input.lostReason
              ? ` Motivo de pérdida: ${input.lostReason}`
              : ""
          }`,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      return {
        dealId: updatedDeal.id,
        previousStage: currentDeal.stage,
        newStage: updatedDeal.stage,
        probability: updatedDeal.probability,
        dealValueMxn: dealValueNumeric,
        weightedValueMxn,
        syncedUnitStatus,
      };
    });
  }

  /**
   * Registra una interacción multicanal (WhatsApp, Llamada, Visita a Showroom)
   * dentro de la bitácora del Deal.
   */
  public static async logDealActivity(input: LogDealActivityInput, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const deal = await tx.deal.findUnique({
        where: { id: input.dealId },
        select: { id: true, leadId: true },
      });

      if (!deal) {
        throw new Error("El Deal especificado no existe.");
      }

      return await tx.activity.create({
        data: {
          dealId: deal.id,
          leadId: deal.leadId,
          userId,
          type: input.type,
          subject: input.subject,
          body: input.body ?? null,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    });
  }

  /**
   * Calcula el Forecast Ponderado y métricas agregadas del embudo comercial.
   */
  public static computePipelineMetrics(
    deals: Array<{
      stage: DealStage;
      dealValue: Decimal | number;
      probability: number;
    }>
  ): PipelineForecastMetrics {
    const orderedStages: DealStage[] = [
      DealStage.PROSPECT,
      DealStage.DISCOVERY_CALL,
      DealStage.SHOWING_SCHEDULED,
      DealStage.VISIT_COMPLETED,
      DealStage.NEGOTIATION,
      DealStage.RESERVED,
      DealStage.CONTRACT_IN_REVIEW,
      DealStage.CLOSED_WON,
      DealStage.CLOSED_LOST,
    ];

    const stageMap = new Map<
      DealStage,
      { count: number; grossValueMxn: number; weightedValueMxn: number }
    >();

    for (const st of orderedStages) {
      stageMap.set(st, { count: 0, grossValueMxn: 0, weightedValueMxn: 0 });
    }

    let totalActiveDeals = 0;
    let grossPipelineValueMxn = 0;
    let weightedForecastValueMxn = 0;
    let closedWonValueMxn = 0;
    let sumProbabilities = 0;

    for (const deal of deals) {
      const val = Number(deal.dealValue);
      const weighted = Number(((val * deal.probability) / 100).toFixed(2));
      const bucket = stageMap.get(deal.stage);

      if (bucket) {
        bucket.count += 1;
        bucket.grossValueMxn = Number((bucket.grossValueMxn + val).toFixed(2));
        bucket.weightedValueMxn = Number((bucket.weightedValueMxn + weighted).toFixed(2));
      }

      if (deal.stage === DealStage.CLOSED_WON) {
        closedWonValueMxn = Number((closedWonValueMxn + val).toFixed(2));
      } else if (deal.stage !== DealStage.CLOSED_LOST) {
        totalActiveDeals += 1;
        grossPipelineValueMxn = Number((grossPipelineValueMxn + val).toFixed(2));
        weightedForecastValueMxn = Number((weightedForecastValueMxn + weighted).toFixed(2));
        sumProbabilities += deal.probability;
      }
    }

    const averageProbabilityPct =
      totalActiveDeals > 0 ? Number((sumProbabilities / totalActiveDeals).toFixed(1)) : 0;

    return {
      totalActiveDeals,
      grossPipelineValueMxn,
      weightedForecastValueMxn,
      closedWonValueMxn,
      averageProbabilityPct,
      stageBreakdown: orderedStages.map((stage) => {
        const item = stageMap.get(stage)!;
        return {
          stage,
          count: item.count,
          grossValueMxn: item.grossValueMxn,
          weightedValueMxn: item.weightedValueMxn,
        };
      }),
    };
  }
}
