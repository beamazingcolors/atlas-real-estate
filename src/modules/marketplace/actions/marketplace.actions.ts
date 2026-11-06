"use server";

import { revalidatePath } from "next/cache";
import { CaptureMarketplaceLeadSchema } from "@/modules/marketplace/validations/marketplace.schema";
import { MarketplaceService } from "@/modules/marketplace/services/marketplace.service";
import { ActionResponse } from "@/modules/inventory/actions/sales.actions";

function resolveErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallbackMessage;
}

export async function captureMarketplaceLeadAction(
  rawData: unknown
): Promise<
  ActionResponse<{ leadId: string; dealId: string; referenceFolio: string }>
> {
  try {
    const validationResult = CaptureMarketplaceLeadSchema.safeParse(rawData);

    if (!validationResult.success) {
      const firstIssue =
        validationResult.error.issues[0]?.message ??
        "Verifique los datos ingresados en la solicitud comercial.";
      return {
        success: false,
        error: firstIssue,
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const defaultAgentId = "a2d1f930-5847-4e08-8e68-0fc29b719488";
    const result = await MarketplaceService.captureLeadFromSheet(
      validationResult.data,
      defaultAgentId
    );

    revalidatePath("/crm");
    revalidatePath("/marketplace");

    return {
      success: true,
      data: {
        leadId: result.leadId,
        dealId: result.dealId,
        referenceFolio: `MKT-${result.dealId.slice(0, 8).toUpperCase()}`,
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: resolveErrorMessage(
        error,
        "No fue posible procesar la solicitud en el pipeline comercial."
      ),
    };
  }
}
