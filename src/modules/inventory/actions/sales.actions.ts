"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  CreateQuotationSchema,
  CreateReservationSchema,
  RegisterPurchaseIntentSchema,
} from "@/modules/inventory/validations/sales.schema";
import { QuotationService } from "@/modules/inventory/services/quotation.service";
import { ReservationService } from "@/modules/inventory/services/reservation.service";
import { InventoryCrmService } from "@/modules/crm/services/inventory-crm.service";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

interface AuthenticatedSessionUser {
  id: string;
  organizationId: string;
}

async function getAuthenticatedUser(): Promise<AuthenticatedSessionUser> {
  return {
    id: "a2d1f930-5847-4e08-8e68-0fc29b719488",
    organizationId: "org-atlas-001",
  };
}

function resolveErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallbackMessage;
}

export async function createQuotationAction(
  rawData: unknown
): Promise<ActionResponse<{ quotationId: string; folio: string; finalPrice: string }>> {
  const validationResult = CreateQuotationSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Los datos de cotización no cumplen con las validaciones de negocio.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await getAuthenticatedUser();
    const quotation = await QuotationService.calculateAndCreate(
      validationResult.data,
      user.id
    );

    revalidatePath(`/dashboard/deals/${validationResult.data.dealId}`);
    revalidatePath(`/dashboard/inventory`);

    return {
      success: true,
      data: {
        quotationId: quotation.id,
        folio: quotation.quoteNumber,
        finalPrice: quotation.finalPrice.toString(),
      },
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Modo demostración en cliente estático")
    ) {
      const folio = `Q-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      return {
        success: true,
        data: {
          quotationId: `sim-${Date.now()}`,
          folio,
          finalPrice: "12332700",
        },
      };
    }
    return {
      success: false,
      error: resolveErrorMessage(
        error,
        "Ocurrió un error inesperado al procesar la cotización."
      ),
    };
  }
}

export async function reserveUnitAction(
  rawData: unknown
): Promise<ActionResponse<{ reservationId: string; expiresAt: string }>> {
  const validationResult = CreateReservationSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Parámetros de reserva inválidos.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await getAuthenticatedUser();
    const reservation = await ReservationService.reserveUnit(
      validationResult.data,
      user.id
    );

    revalidateTag("inventory-matrix");
    revalidatePath(`/dashboard/inventory`);
    revalidatePath(`/dashboard/deals/${validationResult.data.dealId}`);

    return {
      success: true,
      data: {
        reservationId: reservation.id,
        expiresAt: reservation.expiresAt.toISOString(),
      },
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Modo demostración en cliente estático")
    ) {
      const expiresAt = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      return {
        success: true,
        data: {
          reservationId: `rsv-${Math.floor(10000000 + Math.random() * 90000000)}`,
          expiresAt,
        },
      };
    }
    return {
      success: false,
      error: resolveErrorMessage(error, "No fue posible apartar la unidad."),
    };
  }
}

export async function registerPurchaseIntentAction(
  rawData: unknown
): Promise<ActionResponse<{ dealId: string; stage: string; probability: number }>> {
  const validationResult = RegisterPurchaseIntentSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      error: "Datos inválidos para registrar intención de compra en el CRM.",
      fieldErrors: validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const user = await getAuthenticatedUser();
    const deal = await InventoryCrmService.registerPurchaseIntent(
      validationResult.data,
      user.id
    );

    revalidateTag("inventory-matrix");
    revalidatePath(`/dashboard/inventory`);
    revalidatePath(`/dashboard/deals/${deal.id}`);

    return {
      success: true,
      data: {
        dealId: deal.id,
        stage: deal.stage,
        probability: deal.probability,
      },
    };
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Modo demostración en cliente estático")
    ) {
      return {
        success: true,
        data: {
          dealId: `deal-${Date.now()}`,
          stage: validationResult.data.initialStage ?? "NEGOTIATION",
          probability: 55,
        },
      };
    }
    return {
      success: false,
      error: resolveErrorMessage(
        error,
        "No se pudo vincular la unidad con el pipeline del CRM."
      ),
    };
  }
}

export async function runReservationAuditAction(): Promise<
  ActionResponse<{ unlockedUnits: number }>
> {
  try {
    const unlockedUnits = await ReservationService.cancelExpiredReservations();

    if (unlockedUnits > 0) {
      revalidateTag("inventory-matrix");
      revalidatePath(`/dashboard/inventory`);
    }

    return {
      success: true,
      data: { unlockedUnits },
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: resolveErrorMessage(error, "Error al auditar apartados expirados."),
    };
  }
}
