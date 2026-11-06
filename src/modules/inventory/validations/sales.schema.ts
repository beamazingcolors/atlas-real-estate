import { z } from "zod";
import { Currency, UnitStatus, DealStage } from "@prisma/client";

export const InventoryFilterSchema = z.object({
  developmentId: z.string().uuid("Identificador de desarrollo inválido"),
  phaseId: z.string().uuid().optional(),
  status: z.nativeEnum(UnitStatus).optional(),
  bedrooms: z.number().int().min(1).max(10).optional(),
  floorLevel: z.number().int().min(0).max(100).optional(),
  minPricePerM2: z.number().nonnegative().optional(),
  maxPricePerM2: z.number().positive().optional(),
});

export type InventoryFilterInput = z.infer<typeof InventoryFilterSchema>;

export const CreateQuotationSchema = z.object({
  dealId: z.string().uuid("Identificador de deal inválido"),
  unitId: z.string().uuid("Identificador de unidad inválido"),
  paymentPlanId: z.string().uuid("Identificador de plan de pago inválido"),
  validityDays: z.number().int().min(1).max(30).default(15),
  overrideDiscountPct: z.number().min(0).max(25).optional(),
});

export type CreateQuotationInput = z.infer<typeof CreateQuotationSchema>;

export const CreateReservationSchema = z.object({
  dealId: z.string().uuid("Identificador de deal inválido"),
  unitId: z.string().uuid("Identificador de unidad inválido"),
  amount: z.number().positive("El monto de apartado debe ser mayor a 0"),
  currency: z.nativeEnum(Currency).default(Currency.MXN),
  expirationHours: z.number().int().min(12).max(120).default(48),
  notes: z.string().max(500).optional(),
});

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;

export const RegisterPurchaseIntentSchema = z.object({
  unitId: z.string().uuid("Identificador de unidad inválido"),
  leadId: z.string().uuid("Identificador de lead inválido"),
  paymentPlanId: z.string().uuid("Identificador de esquema de pago inválido").optional(),
  initialStage: z
    .enum([DealStage.PROSPECT, DealStage.SHOWING_SCHEDULED, DealStage.NEGOTIATION])
    .default(DealStage.NEGOTIATION),
  notes: z.string().max(1000).optional(),
});

export type RegisterPurchaseIntentInput = z.infer<typeof RegisterPurchaseIntentSchema>;
