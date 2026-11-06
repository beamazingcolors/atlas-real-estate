import { z } from "zod";
import { ConservationState, PropertyType } from "@prisma/client";

export const SubjectPropertySchema = z.object({
  userId: z.string().uuid("Identificador de analista inválido"),
  submarketZoneId: z.string().uuid("Identificador de submercado inválido"),
  propertyType: z.nativeEnum(PropertyType),
  totalAreaM2: z.number().positive("El área total debe ser mayor a 0 m²"),
  interiorAreaM2: z.number().positive("El área interior debe ser mayor a 0 m²"),
  ageYears: z.number().int().min(0).max(100),
  conservationState: z.nativeEnum(ConservationState),
  parkingSpots: z.number().int().min(0).max(20),
  amenitiesCount: z.number().int().min(0).max(50),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type SubjectPropertyInput = z.infer<typeof SubjectPropertySchema>;

export const ComparableWitnessSchema = z.object({
  sourceName: z.string().trim().min(2, "Fuente requerida").max(120),
  sourceUrl: z.string().url("URL de testigo inválida").optional(),
  listingPrice: z.number().positive("El precio de lista debe ser mayor a 0"),
  totalAreaM2: z.number().positive("La superficie del testigo debe ser mayor a 0 m²"),
  distanceMeters: z.number().int().min(10).max(25000),
  conservationState: z.nativeEnum(ConservationState),
});

export type ComparableWitnessInput = z.infer<typeof ComparableWitnessSchema>;

export const ExecuteValuationStudySchema = z.object({
  subject: SubjectPropertySchema,
  witnesses: z
    .array(ComparableWitnessSchema)
    .min(3, "Se requieren al menos 3 testigos de mercado para un estudio confiable."),
});

export type ExecuteValuationStudyInput = z.infer<typeof ExecuteValuationStudySchema>;
