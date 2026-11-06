import { prisma } from "@/core/db/prisma";
import { CreateReservationInput } from "@/modules/inventory/validations/sales.schema";
import { ActivityType, DealStage, ReservationStatus, UnitStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class ReservationService {
  /**
   * Bloquea atómicamente una unidad disponible, genera el registro de apartado
   * y actualiza la oportunidad comercial en el pipeline del CRM.
   */
  public static async reserveUnit(input: CreateReservationInput, userId: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + input.expirationHours);

    return await prisma.$transaction(async (tx) => {
      // 1. Bloqueo atómico: sólo se actualiza si el estatus actual es estrictamente AVAILABLE
      const updateResult = await tx.unit.updateMany({
        where: {
          id: input.unitId,
          status: UnitStatus.AVAILABLE,
        },
        data: {
          status: UnitStatus.RESERVED,
        },
      });

      if (updateResult.count === 0) {
        throw new Error(
          "Colisión de inventario: la unidad ya fue reservada o no se encuentra disponible."
        );
      }

      // 2. Creación de la reserva
      const reservation = await tx.reservation.create({
        data: {
          dealId: input.dealId,
          unitId: input.unitId,
          amount: new Decimal(input.amount),
          currency: input.currency,
          status: ReservationStatus.PENDING_PAYMENT,
          expiresAt,
        },
      });

      // 3. Sincronización del Pipeline comercial
      const deal = await tx.deal.update({
        where: { id: input.dealId },
        data: {
          unitId: input.unitId,
          stage: DealStage.RESERVED,
          probability: 75,
        },
      });

      // 4. Registro de auditoría en bitácora de actividades
      await tx.activity.create({
        data: {
          dealId: input.dealId,
          leadId: deal.leadId,
          userId,
          type: ActivityType.TASK_FOLLOW_UP,
          subject: `Unidad apartada temporalmente - Folio Reserva: ${reservation.id.slice(0, 8).toUpperCase()}`,
          body: `Monto comprometido: $${input.amount.toLocaleString("es-MX")} ${input.currency}. Vencimiento para comprobante SPEI: ${expiresAt.toISOString()}. ${input.notes ?? ""}`,
          scheduledAt: expiresAt,
          isCompleted: false,
        },
      });

      return reservation;
    });
  }

  /**
   * Audita y libera unidades cuyos apartados excedieron el tiempo límite sin validación de pago.
   */
  public static async cancelExpiredReservations(): Promise<number> {
    const now = new Date();

    const expiredReservations = await prisma.reservation.findMany({
      where: {
        status: ReservationStatus.PENDING_PAYMENT,
        expiresAt: { lt: now },
      },
    });

    for (const res of expiredReservations) {
      await prisma.$transaction(async (tx) => {
        await tx.reservation.update({
          where: { id: res.id },
          data: { status: ReservationStatus.EXPIRED },
        });

        await tx.unit.update({
          where: { id: res.unitId },
          data: { status: UnitStatus.AVAILABLE },
        });

        await tx.deal.update({
          where: { id: res.dealId },
          data: {
            stage: DealStage.NEGOTIATION,
            probability: 40,
          },
        });
      });
    }

    return expiredReservations.length;
  }
}
