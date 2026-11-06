"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  LogDealActivitySchema,
  UpdateDealStageSchema,
} from "@/modules/crm/validations/pipeline.schema";
import {
  CrmPipelineService,
  DealStageMutationResult,
} from "@/modules/crm/services/pipeline.service";
import { ActionResponse } from "@/modules/inventory/actions/sales.actions";

function resolveErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallbackMessage;
}

export async function updateDealStageAction(
  rawData: unknown
): Promise<ActionResponse<DealStageMutationResult>> {
  try {
    const validationResult = UpdateDealStageSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstIssue =
        validationResult.error.issues[0]?.message ??
        "Parámetros de transición de etapa inválidos.";
      return {
        success: false,
        error: firstIssue,
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const mutationResult = await CrmPipelineService.updateDealStage(
      validationResult.data
    );

    revalidateTag("inventory-matrix");
    revalidatePath("/crm");
    revalidatePath("/inventory");

    return {
      success: true,
      data: mutationResult,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: resolveErrorMessage(error, "Fallo en la mutación de etapa del Deal."),
    };
  }
}

export async function logDealActivityAction(
  rawData: unknown
): Promise<ActionResponse<{ activityId: string; completedAt: string }>> {
  try {
    const validationResult = LogDealActivitySchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        error: "Datos de actividad comercial inválidos.",
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const actorUserId = "a2d1f930-5847-4e08-8e68-0fc29b719488";
    const activity = await CrmPipelineService.logDealActivity(
      validationResult.data,
      actorUserId
    );

    revalidatePath("/crm");

    return {
      success: true,
      data: {
        activityId: activity.id,
        completedAt: (activity.completedAt ?? new Date()).toISOString(),
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: resolveErrorMessage(
        error,
        "No fue posible registrar la actividad en la bitácora del Deal."
      ),
    };
  }
}
