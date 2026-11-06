"use client";

import React, { useState, useTransition } from "react";
import { Currency, DealStage } from "@prisma/client";
import { updateDealStageAction } from "@/modules/crm/actions/pipeline.actions";
import { STAGE_PROBABILITIES } from "@/modules/crm/validations/pipeline.schema";

export interface KanbanCardData {
  id: string;
  leadName: string;
  unitCode?: string;
  developmentName?: string;
  dealValue: string;
  currency: Currency;
  probability: number;
  stage: DealStage;
}

interface KanbanBoardProps {
  deals: KanbanCardData[];
}

const STAGES: ReadonlyArray<{ key: DealStage; label: string }> = [
  { key: DealStage.PROSPECT, label: "01. PROSPECTO" },
  { key: DealStage.DISCOVERY_CALL, label: "02. CALIFICACIÓN" },
  { key: DealStage.SHOWING_SCHEDULED, label: "03. RECORRIDO" },
  { key: DealStage.NEGOTIATION, label: "04. NEGOCIACIÓN" },
  { key: DealStage.RESERVED, label: "05. APARTADO" },
  { key: DealStage.CONTRACT_IN_REVIEW, label: "06. CONTRATO" },
  { key: DealStage.CLOSED_WON, label: "07. CIERRE GANADO" },
];

export function KanbanBoard({ deals: initialDeals }: KanbanBoardProps) {
  const [boardDeals, setBoardDeals] = useState<KanbanCardData[]>(initialDeals);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleStageChange = (dealId: string, newStage: DealStage) => {
    setErrorMessage(null);
    const updatedProbability = STAGE_PROBABILITIES[newStage];

    // Mutación optimista inmediata para experiencia de baja latencia
    setBoardDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? { ...d, stage: newStage, probability: updatedProbability }
          : d
      )
    );

    startTransition(async () => {
      const response = await updateDealStageAction({ dealId, newStage });
      if (!response.success) {
        setErrorMessage(response.error);
        setBoardDeals(initialDeals);
      }
    });
  };

  return (
    <div className="w-full overflow-x-auto border border-neutral-800 bg-black p-6 text-neutral-200">
      {errorMessage && (
        <div className="mb-4 flex items-center justify-between border border-neutral-700 bg-neutral-900 px-4 py-2.5 font-mono text-xs text-white">
          <span>ERROR DE TRANSICIÓN: {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="border border-neutral-600 px-2 py-0.5 text-[10px] uppercase"
          >
            CERRAR
          </button>
        </div>
      )}

      <div className="flex min-w-[1400px] gap-4">
        {STAGES.map((col) => {
          const colDeals = boardDeals.filter((d) => d.stage === col.key);
          const totalColValue = colDeals.reduce(
            (acc, curr) => acc + Number(curr.dealValue),
            0
          );

          return (
            <div
              key={col.key}
              className="flex min-w-[220px] flex-1 flex-col border border-neutral-800 bg-neutral-950"
            >
              {/* Header de Columna Editorial */}
              <div className="border-b border-neutral-800 bg-neutral-900/60 p-3">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-neutral-400">
                  <span>{col.label}</span>
                  <span className="font-semibold tabular-nums text-white">
                    {colDeals.length}
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs tabular-nums text-neutral-500">
                  Total: $
                  {totalColValue.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                  })}
                </div>
              </div>

              {/* Lista de Tarjetas */}
              <div className="flex min-h-[500px] flex-col gap-2 p-2">
                {colDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className="border border-neutral-800 bg-black p-3 transition-colors hover:border-neutral-600"
                  >
                    <div className="font-mono text-xs uppercase tracking-tight text-neutral-500">
                      {deal.developmentName ?? "INVENTARIO GENERAL"}
                    </div>

                    <div className="mt-1 truncate text-sm font-medium text-white">
                      {deal.leadName}
                    </div>

                    {deal.unitCode && (
                      <div className="mt-0.5 font-mono text-xs text-neutral-400">
                        Unidad: {deal.unitCode}
                      </div>
                    )}

                    <div className="mt-3 flex items-baseline justify-between border-t border-neutral-900 pt-2">
                      <span className="font-mono text-xs tabular-nums text-neutral-400">
                        {deal.probability}% PROB
                      </span>
                      <span className="font-mono text-xs font-medium tabular-nums text-white">
                        ${Number(deal.dealValue).toLocaleString("es-MX")}{" "}
                        {deal.currency}
                      </span>
                    </div>

                    {/* Selector de cambio de etapa sin librerías externas */}
                    <div className="mt-3">
                      <select
                        aria-label="Cambiar etapa de negociación"
                        disabled={isPending}
                        value={deal.stage}
                        onChange={(e) =>
                          handleStageChange(deal.id, e.target.value as DealStage)
                        }
                        className="w-full rounded-none border border-neutral-800 bg-neutral-900 p-1 font-mono text-[11px] text-neutral-300 focus:border-white focus:outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            Mover a: {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
