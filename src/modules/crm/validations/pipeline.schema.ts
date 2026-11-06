import { z } from "zod";
import { ActivityType, DealStage } from "@prisma/client";

export const STAGE_PROBABILITIES: Record<DealStage, number> = {
  PROSPECT: 10,
  DISCOVERY_CALL: 20,
  SHOWING_SCHEDULED: 35,
  VISIT_COMPLETED: 50,
  NEGOTIATION: 65,
  RESERVED: 80,
  CONTRACT_IN_REVIEW: 90,
  CLOSED_WON: 100,
  CLOSED_LOST: 0,
};

export const UpdateDealStageSchema = z
  .object({
    dealId: z.string().uuid("Identificador de Deal inválido"),
    newStage: z.nativeEnum(DealStage),
    lostReason: z.string().trim().max(500).optional(),
  })
  .refine(
    (data) =>
      data.newStage !== DealStage.CLOSED_LOST ||
      (typeof data.lostReason === "string" && data.lostReason.length >= 5),
    {
      message:
        "Es obligatorio especificar el motivo de descarte (mínimo 5 caracteres) al marcar una negociación como CLOSED_LOST.",
      path: ["lostReason"],
    }
  );

export type UpdateDealStageInput = z.infer<typeof UpdateDealStageSchema>;

export const LogDealActivitySchema = z.object({
  dealId: z.string().uuid("Identificador de Deal inválido"),
  type: z.nativeEnum(ActivityType),
  subject: z
    .string()
    .trim()
    .min(3, "El asunto debe contener al menos 3 caracteres")
    .max(160),
  body: z.string().trim().max(1000).optional(),
});

export type LogDealActivityInput = z.infer<typeof LogDealActivitySchema>;
