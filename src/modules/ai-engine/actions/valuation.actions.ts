"use server";

import { revalidatePath } from "next/cache";
import {
  ComparableWitnessInput,
  ExecuteValuationStudySchema,
  SubjectPropertyInput,
} from "@/modules/ai-engine/validations/valuation.schema";
import { ValuationEngineService } from "@/modules/ai-engine/services/valuation.service";
import { ActionResponse } from "@/modules/inventory/actions/sales.actions";

export interface GeneratedValuationDTO {
  folio: string;
  estimatedValue: string;
  priceM2: string;
  rangeMin: string;
  rangeMax: string;
  confidenceScore: string;
  projectedCapRate: string;
  projectedRoi5Y: string;
  appreciation3Y: string;
  appreciation5Y: string;
}

function resolveErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallbackMessage;
}

export async function generateValuationAction(
  subject: SubjectPropertyInput,
  witnesses: ComparableWitnessInput[]
): Promise<ActionResponse<GeneratedValuationDTO>> {
  try {
    const validationResult = ExecuteValuationStudySchema.safeParse({
      subject,
      witnesses,
    });

    if (!validationResult.success) {
      const firstIssue =
        validationResult.error.issues[0]?.message ??
        "Parámetros de entrada inválidos para el estudio de valuación.";
      return {
        success: false,
        error: firstIssue,
        fieldErrors: validationResult.error.flatten().fieldErrors,
      };
    }

    const study = await ValuationEngineService.executeStudy(
      validationResult.data.subject,
      validationResult.data.witnesses
    );

    revalidatePath("/valuations");

    return {
      success: true,
      data: {
        folio: study.folioNumber,
        estimatedValue: study.estimatedValue.toString(),
        priceM2: study.estimatedPriceM2.toString(),
        rangeMin: study.valueRangeMin.toString(),
        rangeMax: study.valueRangeMax.toString(),
        confidenceScore: study.confidenceScore.toString(),
        projectedCapRate: (study.projectedCapRate ?? "0").toString(),
        projectedRoi5Y: (study.projectedRoi ?? "0").toString(),
        appreciation3Y: (study.appreciation3Y ?? "0").toString(),
        appreciation5Y: (study.appreciation5Y ?? "0").toString(),
      },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: resolveErrorMessage(
        error,
        "Error al procesar el algoritmo de valuación inmobiliaria."
      ),
    };
  }
}
