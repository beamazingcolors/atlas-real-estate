import { prisma } from "@/core/db/prisma";
import { CreateQuotationInput } from "@/modules/inventory/validations/sales.schema";
import { ActivityType, Currency, DealStage, UnitStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface FinancialBreakdown {
  listPrice: number;
  discountPct: number;
  discountAmount: number;
  finalPrice: number;
  downPaymentPct: number;
  downPaymentAmount: number;
  deferredInstallmentsPct: number;
  deferredTotalAmount: number;
  numberOfInstallments: number;
  monthlyInstallment: number;
  finalBalancePct: number;
  deliveryBalance: number;
  currency: Currency;
}

export class QuotationService {
  /**
   * Cálculo financiero puro para esquemas de pago inmobiliarios en México
   * (Enganche + Mensualidades durante preventa/obra + Liquidación contra escrituración).
   */
  public static simulateBreakdown(params: {
    listPrice: number;
    downPaymentPct: number;
    deferredInstallmentsPct: number;
    monthsToDeliver: number;
    finalBalancePct: number;
    discountPct: number;
    currency?: Currency;
  }): FinancialBreakdown {
    const totalPct =
      params.downPaymentPct + params.deferredInstallmentsPct + params.finalBalancePct;

    if (Math.abs(totalPct - 100) > 0.01) {
      throw new Error(
        `El esquema financiero es inconsistente: la suma porcentual (${totalPct.toFixed(2)}%) debe ser exactamente 100%.`
      );
    }

    const discountAmount = Number(((params.listPrice * params.discountPct) / 100).toFixed(2));
    const finalPrice = Number((params.listPrice - discountAmount).toFixed(2));

    const downPaymentAmount = Number(
      ((finalPrice * params.downPaymentPct) / 100).toFixed(2)
    );
    const deferredTotalAmount = Number(
      ((finalPrice * params.deferredInstallmentsPct) / 100).toFixed(2)
    );

    const numberOfInstallments = Math.max(1, params.monthsToDeliver);
    const monthlyInstallment =
      params.deferredInstallmentsPct > 0
        ? Number((deferredTotalAmount / numberOfInstallments).toFixed(2))
        : 0;

    // Ajuste por centavos en el saldo contra entrega para garantizar cuadre contable exacto
    const deliveryBalance = Number(
      (finalPrice - downPaymentAmount - deferredTotalAmount).toFixed(2)
    );

    return {
      listPrice: params.listPrice,
      discountPct: params.discountPct,
      discountAmount,
      finalPrice,
      downPaymentPct: params.downPaymentPct,
      downPaymentAmount,
      deferredInstallmentsPct: params.deferredInstallmentsPct,
      deferredTotalAmount,
      numberOfInstallments: params.deferredInstallmentsPct > 0 ? numberOfInstallments : 0,
      monthlyInstallment,
      finalBalancePct: params.finalBalancePct,
      deliveryBalance,
      currency: params.currency ?? Currency.MXN,
    };
  }

  /**
   * Genera y persiste una cotización formal vinculada al Deal en el CRM.
   */
  public static async calculateAndCreate(input: CreateQuotationInput, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const [unit, paymentPlan, deal] = await Promise.all([
        tx.unit.findUnique({
          where: { id: input.unitId },
          include: { typology: true, phase: true },
        }),
        tx.paymentPlan.findUnique({
          where: { id: input.paymentPlanId },
        }),
        tx.deal.findUnique({
          where: { id: input.dealId },
        }),
      ]);

      if (!unit) {
        throw new Error("La unidad seleccionada no existe en el inventario maestro.");
      }

      if (unit.status === UnitStatus.SOLD || unit.status === UnitStatus.BLOCKED) {
        throw new Error(
          `No es posible cotizar la unidad ${unit.unitNumber} porque su estatus actual es ${unit.status}.`
        );
      }

      if (!paymentPlan || !paymentPlan.isActive) {
        throw new Error("El esquema de financiamiento seleccionado no está activo.");
      }

      if (!deal) {
        throw new Error("La oportunidad comercial (Deal) especificada no existe.");
      }

      const appliedDiscountPct =
        input.overrideDiscountPct !== undefined
          ? input.overrideDiscountPct
          : Number(paymentPlan.discountPct);

      const breakdown = QuotationService.simulateBreakdown({
        listPrice: Number(unit.currentPrice),
        downPaymentPct: Number(paymentPlan.downPaymentPct),
        deferredInstallmentsPct: Number(paymentPlan.deferredInstallmentsPct),
        monthsToDeliver: paymentPlan.monthsToDeliver,
        finalBalancePct: Number(paymentPlan.finalBalancePct),
        discountPct: appliedDiscountPct,
        currency: unit.currency,
      });

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + input.validityDays);

      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const quoteNumber = `Q-${year}-${randomSuffix}`;

      const quotation = await tx.quotation.create({
        data: {
          dealId: input.dealId,
          unitId: input.unitId,
          paymentPlanId: input.paymentPlanId,
          quoteNumber,
          finalPrice: new Decimal(breakdown.finalPrice),
          currency: breakdown.currency,
          downPaymentAmount: new Decimal(breakdown.downPaymentAmount),
          monthlyInstallment: new Decimal(breakdown.monthlyInstallment),
          numberOfInstallments: breakdown.numberOfInstallments,
          deliveryBalance: new Decimal(breakdown.deliveryBalance),
          validUntil,
        },
      });

      // Vincula la unidad al Deal y avanza a etapa de Negociación si estaba en etapa inicial
      await tx.deal.update({
        where: { id: deal.id },
        data: {
          unitId: unit.id,
          dealValue: new Decimal(breakdown.finalPrice),
          stage:
            deal.stage === DealStage.PROSPECT ||
            deal.stage === DealStage.DISCOVERY_CALL ||
            deal.stage === DealStage.SHOWING_SCHEDULED
              ? DealStage.NEGOTIATION
              : deal.stage,
          probability: Math.max(deal.probability, 45),
        },
      });

      await tx.activity.create({
        data: {
          dealId: deal.id,
          leadId: deal.leadId,
          userId,
          type: ActivityType.NOTE,
          subject: `Cotización emitida ${quoteNumber} — Unidad ${unit.unitNumber}`,
          body: `Esquema: ${paymentPlan.name}. Precio neto: $${breakdown.finalPrice.toLocaleString("es-MX")} ${breakdown.currency}. Enganche: $${breakdown.downPaymentAmount.toLocaleString("es-MX")}. ${breakdown.numberOfInstallments} mensualidades de $${breakdown.monthlyInstallment.toLocaleString("es-MX")}. Liquidación: $${breakdown.deliveryBalance.toLocaleString("es-MX")}.`,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      return quotation;
    });
  }
}
