import { z } from "zod";
import { DevelopmentStatus } from "@prisma/client";

export const ParametricCatalogFilterSchema = z.object({
  city: z.string().trim().optional(),
  status: z.nativeEnum(DevelopmentStatus).optional(),
  maxBudgetMxn: z.number().positive().optional(),
  minCapRatePct: z.number().min(0).max(30).optional(),
  minBedrooms: z.number().int().min(1).max(10).optional(),
  sortBy: z
    .enum(["PRICE_ASC", "PRICE_M2_ASC", "CAP_RATE_DESC", "APPRECIATION_DESC"])
    .default("CAP_RATE_DESC"),
});

export type ParametricCatalogFilterInput = z.infer<
  typeof ParametricCatalogFilterSchema
>;

export const CaptureMarketplaceLeadSchema = z.object({
  organizationId: z.string().uuid("Identificador de organización inválido"),
  developmentId: z.string().uuid("Identificador de desarrollo inválido"),
  unitId: z.string().uuid("Identificador de unidad inválido").optional(),
  firstName: z.string().trim().min(2, "Nombre requerido").max(80),
  lastName: z.string().trim().min(2, "Apellido requerido").max(80),
  email: z.string().trim().email("Correo electrónico inválido"),
  phone: z
    .string()
    .trim()
    .min(10, "Teléfono a 10 dígitos requerido")
    .max(20),
  investmentGoal: z.enum([
    "PATRIMONIAL_PROPIO",
    "RENTAS_CORTAS_YIELD",
    "PLUSVALIA_PREVENTA",
    "PORTAFOLIO_B2B",
  ]),
  estimatedBudgetMxn: z.number().positive("Presupuesto inválido"),
  notes: z.string().trim().max(500).optional(),
});

export type CaptureMarketplaceLeadInput = z.infer<
  typeof CaptureMarketplaceLeadSchema
>;
