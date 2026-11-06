"use client";

import React, { useMemo, useState, useTransition } from "react";
import { formatCurrencyMXN } from "@/core/utils/currency";
import { STAGE_PROBABILITIES } from "@/modules/crm/validations/pipeline.schema";
import {
  logDealActivityAction,
  updateDealStageAction,
} from "@/modules/crm/actions/pipeline.actions";
import { ActivityType, DealStage } from "@prisma/client";

export interface CrmPipelineDealDTO {
  id: string;
  stage: DealStage;
  dealValue: number;
  currency: "MXN" | "USD";
  probability: number;
  leadScore: number;
  lostReason: string | null;
  updatedAtIso: string;
  lead: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    source: string;
    investmentGoal: string;
  };
  unit: {
    id: string;
    unitNumber: string;
    phaseName: string;
    typologyCode: string;
    totalAreaM2: number;
  } | null;
  agentName: string;
  recentActivities: Array<{
    id: string;
    type: ActivityType;
    subject: string;
    timestampIso: string;
  }>;
}

interface CrmPipelineBentoProps {
  initialDeals: CrmPipelineDealDTO[];
}

const KANBAN_COLUMNS: Array<{
  stage: DealStage;
  code: string;
  title: string;
}> = [
  { stage: "PROSPECT", code: "E-01", title: "PROSPECTO" },
  { stage: "DISCOVERY_CALL", code: "E-02", title: "DISCOVERY" },
  { stage: "SHOWING_SCHEDULED", code: "E-03", title: "VISITA AGENDADA" },
  { stage: "VISIT_COMPLETED", code: "E-04", title: "SHOWROOM OK" },
  { stage: "NEGOTIATION", code: "E-05", title: "NEGOCIACIÓN" },
  { stage: "RESERVED", code: "E-06", title: "APARTADO SPEI" },
  { stage: "CONTRACT_IN_REVIEW", code: "E-07", title: "CONTRATO LEGAL" },
  { stage: "CLOSED_WON", code: "E-08", title: "CERRADO GANADO" },
  { stage: "CLOSED_LOST", code: "E-09", title: "DESCARTADO" },
];

export function CrmPipelineBento({ initialDeals }: CrmPipelineBentoProps) {
  const [deals, setDeals] = useState<CrmPipelineDealDTO[]>(initialDeals);
  const [selectedDealId, setSelectedDealId] = useState<string>(
    initialDeals[0]?.id ?? ""
  );
  const [targetStage, setTargetStage] = useState<DealStage>(
    initialDeals[0]?.stage ?? "NEGOTIATION"
  );
  const [lostReasonInput, setLostReasonInput] = useState<string>("");

  // Bitácora multicanal
  const [activityType, setActivityType] = useState<ActivityType>("WHATSAPP_MESSAGE");
  const [activitySubject, setActivitySubject] = useState<string>("");
  const [activityBody, setActivityBody] = useState<string>("");

  const [auditBanner, setAuditBanner] = useState<{
    type: "SUCCESS" | "ERROR";
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const selectedDeal = useMemo(
    () => deals.find((d) => d.id === selectedDealId) ?? deals[0],
    [deals, selectedDealId]
  );

  // Cálculo reactivo de métricas de Forecast Ponderado
  const metrics = useMemo(() => {
    let activeCount = 0;
    let grossActiveMxn = 0;
    let weightedForecastMxn = 0;
    let closedWonMxn = 0;

    for (const deal of deals) {
      const weighted = (deal.dealValue * deal.probability) / 100;
      if (deal.stage === "CLOSED_WON") {
        closedWonMxn += deal.dealValue;
      } else if (deal.stage !== "CLOSED_LOST") {
        activeCount += 1;
        grossActiveMxn += deal.dealValue;
        weightedForecastMxn += weighted;
      }
    }

    return {
      activeCount,
      grossActiveMxn,
      weightedForecastMxn,
      closedWonMxn,
    };
  }, [deals]);

  const handleSelectDeal = (deal: CrmPipelineDealDTO) => {
    setSelectedDealId(deal.id);
    setTargetStage(deal.stage);
    setLostReasonInput(deal.lostReason ?? "");
  };

  const handleStageTransition = (dealId: string, newStage: DealStage, reason?: string) => {
    setAuditBanner(null);

    if (newStage === "CLOSED_LOST" && (!reason || reason.trim().length < 5)) {
      setAuditBanner({
        type: "ERROR",
        message:
          "VALIDACIÓN REQUERIDA: Debe ingresar un motivo de descarte (mín. 5 caracteres) para transicionar a CLOSED_LOST.",
      });
      return;
    }

    const newProbability = STAGE_PROBABILITIES[newStage];

    // Actualización optimista determinista en interfaz
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: newStage,
              probability: newProbability,
              lostReason: newStage === "CLOSED_LOST" ? (reason ?? null) : null,
            }
          : d
      )
    );

    startTransition(async () => {
      const result = await updateDealStageAction({
        dealId,
        newStage,
        lostReason: reason,
      });

      if (result.success) {
        setAuditBanner({
          type: "SUCCESS",
          message: `TRANSICIÓN CONFIRMADA: ${result.data.previousStage} → ${result.data.newStage} (Probabilidad: ${result.data.probability}% · Valor Ponderado: ${formatCurrencyMXN(result.data.weightedValueMxn)}).`,
        });
      } else {
        setAuditBanner({
          type: "ERROR",
          message: result.error,
        });
      }
    });
  };

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal || activitySubject.trim().length < 3) return;

    setAuditBanner(null);
    const subjectSnapshot = activitySubject.trim();
    const typeSnapshot = activityType;

    startTransition(async () => {
      const response = await logDealActivityAction({
        dealId: selectedDeal.id,
        type: typeSnapshot,
        subject: subjectSnapshot,
        body: activityBody.trim() || undefined,
      });

      setDeals((prev) =>
        prev.map((d) =>
          d.id === selectedDeal.id
            ? {
                ...d,
                recentActivities: [
                  {
                    id: response.success
                      ? response.data.activityId
                      : `act-${Date.now()}`,
                    type: typeSnapshot,
                    subject: subjectSnapshot,
                    timestampIso: new Date().toISOString(),
                  },
                  ...d.recentActivities,
                ],
              }
            : d
        )
      );

      setActivitySubject("");
      setActivityBody("");
      setAuditBanner({
        type: "SUCCESS",
        message: `BITÁCORA ACTUALIZADA [${typeSnapshot}]: "${subjectSnapshot}" registrado en el expediente de ${selectedDeal.lead.fullName}.`,
      });
    });
  };

  return (
    <div className="space-y-6">
      {/* FILA BENTO 01: MÉTRICAS DE FORECAST PONDERADO Y EMBUDO COMERCIAL */}
      <section className="grid grid-cols-12 border border-neutral-900 bg-white">
        <div className="col-span-4 border-r border-neutral-900 p-6">
          <span className="border border-neutral-900 bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            CRM // PIPELINE TRANSPARENTE
          </span>
          <h1 className="mt-3 text-2xl font-bold uppercase tracking-tight text-neutral-950">
            EMBUDO DE NEGOCIACIONES & FORECAST
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">
            Ponderación algorítmica por etapa comercial y sincronización bidireccional con
            el estatus de unidades en el Inventario Maestro.
          </p>
        </div>

        <div className="col-span-8 grid grid-cols-3 divide-x divide-neutral-900">
          <div className="flex flex-col justify-between p-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              01 // PIPELINE ACTIVO BRUTO
            </span>
            <div className="mt-3 font-mono text-2xl font-bold tabular-nums text-neutral-950">
              {formatCurrencyMXN(metrics.grossActiveMxn)}
            </div>
            <span className="mt-1 font-mono text-[11px] text-neutral-500">
              {metrics.activeCount} NEGOCIACIONES EN CURSO
            </span>
          </div>

          <div className="flex flex-col justify-between bg-neutral-50 p-6">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              02 // FORECAST PONDERADO (∑ VALOR × PROB)
            </span>
            <div className="mt-3 font-mono text-2xl font-bold tabular-nums text-neutral-950">
              {formatCurrencyMXN(metrics.weightedForecastMxn)}
            </div>
            <span className="mt-1 font-mono text-[11px] text-neutral-600">
              PROYECCIÓN AJUSTADA POR ETAPA
            </span>
          </div>

          <div className="flex flex-col justify-between bg-neutral-950 p-6 text-white">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
              03 // CIERRES ESCRITURADOS (CLOSED WON)
            </span>
            <div className="mt-3 font-mono text-2xl font-bold tabular-nums text-white">
              {formatCurrencyMXN(metrics.closedWonMxn)}
            </div>
            <span className="mt-1 font-mono text-[11px] text-neutral-400">
              PROB. CONSOLIDADA 100%
            </span>
          </div>
        </div>
      </section>

      {auditBanner && (
        <div
          className={`flex items-center justify-between border border-neutral-900 px-5 py-3 font-mono text-xs ${
            auditBanner.type === "SUCCESS"
              ? "bg-neutral-950 text-white"
              : "bg-neutral-200 text-neutral-950"
          }`}
        >
          <span>{auditBanner.message}</span>
          <button
            type="button"
            onClick={() => setAuditBanner(null)}
            className="border border-current px-2 py-0.5 text-[10px] uppercase tracking-widest"
          >
            CERRAR
          </button>
        </div>
      )}

      {/* FILA BENTO 02: TABLERO KANBAN ORTOGONAL (8 COL) + INSPECTOR DE EXPEDIENTE (4 COL) */}
      <section className="grid grid-cols-12 gap-6">
        {/* CELDA BENTO: MATRIZ KANBAN DE ETAPAS */}
        <div className="col-span-8 border border-neutral-900 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-900 px-6 py-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              MATRIZ DE ETAPAS DEL PIPELINE (PROSPECT → CLOSED_WON)
            </span>
            <span className="font-mono text-[11px] text-neutral-600">
              DESLIZA HORIZONTALMENTE PARA INSPECCIONAR LAS 9 ETAPAS
            </span>
          </div>

          <div className="grid grid-cols-3 divide-x divide-y divide-neutral-900">
            {KANBAN_COLUMNS.map((col) => {
              const stageDeals = deals.filter((d) => d.stage === col.stage);
              const stageProbability = STAGE_PROBABILITIES[col.stage];
              const stageTotalMxn = stageDeals.reduce((acc, d) => acc + d.dealValue, 0);

              return (
                <div key={col.stage} className="flex min-h-[290px] flex-col bg-neutral-50">
                  {/* CABECERA DE COLUMNA DE ETAPA */}
                  <div className="border-b border-neutral-900 bg-white px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-neutral-500">
                        {col.code} · PROB {stageProbability}%
                      </span>
                      <span className="border border-neutral-900 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-neutral-950">
                        {stageDeals.length}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-neutral-950">
                      {col.title}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] tabular-nums text-neutral-600">
                      {formatCurrencyMXN(stageTotalMxn)}
                    </div>
                  </div>

                  {/* TARJETAS DE NEGOCIACIÓN (BORDES RECTOS 1PX, CERO PÍLDORAS) */}
                  <div className="flex-1 space-y-3 p-3">
                    {stageDeals.length === 0 ? (
                      <div className="flex h-32 items-center justify-center border border-dashed border-neutral-300 p-4 text-center font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                        SIN DEALS EN {col.title}
                      </div>
                    ) : (
                      stageDeals.map((deal) => {
                        const isSelected = selectedDeal?.id === deal.id;
                        return (
                          <div
                            key={deal.id}
                            onClick={() => handleSelectDeal(deal)}
                            className={`cursor-pointer border p-3.5 transition-colors ${
                              isSelected
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-900 bg-white text-neutral-950 hover:bg-neutral-100"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold tracking-tight">
                                {deal.lead.fullName}
                              </span>
                              <span
                                className={`border px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                                  isSelected
                                    ? "border-white text-white"
                                    : "border-neutral-900 text-neutral-900"
                                }`}
                              >
                                SCORE {deal.leadScore}
                              </span>
                            </div>

                            {deal.unit ? (
                              <div
                                className={`mt-1.5 font-mono text-[11px] ${
                                  isSelected ? "text-neutral-300" : "text-neutral-600"
                                }`}
                              >
                                UNIDAD {deal.unit.unitNumber} · {deal.unit.typologyCode} (
                                {deal.unit.totalAreaM2} m²)
                              </div>
                            ) : (
                              <div className="mt-1.5 font-mono text-[11px] text-neutral-400">
                                SIN UNIDAD VINCULADA
                              </div>
                            )}

                            <div className="mt-3 flex items-baseline justify-between border-t border-current/20 pt-2 font-mono">
                              <span className="text-xs font-bold tabular-nums">
                                {formatCurrencyMXN(deal.dealValue)}
                              </span>
                              <span className="text-[10px] uppercase">
                                PONDERADO:{" "}
                                {formatCurrencyMXN(
                                  (deal.dealValue * deal.probability) / 100
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CELDA BENTO: CONTROLADOR DE TRANSICIÓN DE ETAPA Y BITÁCORA MULTICANAL */}
        <div className="col-span-4 border border-neutral-900 bg-white">
          {selectedDeal ? (
            <div>
              <div className="border-b border-neutral-900 bg-neutral-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    EXPEDIENTE DE NEGOCIACIÓN
                  </span>
                  <span className="border border-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    PROB. {selectedDeal.probability}%
                  </span>
                </div>
                <h2 className="mt-2 font-mono text-xl font-bold">
                  {selectedDeal.lead.fullName}
                </h2>
                <p className="mt-0.5 font-mono text-[11px] text-neutral-300">
                  {selectedDeal.lead.email} · {selectedDeal.lead.phone}
                </p>
                <div className="mt-3 flex items-baseline justify-between border-t border-neutral-800 pt-3 font-mono text-xs">
                  <span className="text-neutral-400">VALOR DE OPERACIÓN:</span>
                  <span className="text-base font-bold tabular-nums">
                    {formatCurrencyMXN(selectedDeal.dealValue)}
                  </span>
                </div>
              </div>

              {/* FORMULARIO DE MUTACIÓN DE ETAPA (CONECTADO A updateDealStageAction) */}
              <div className="border-b border-neutral-900 p-5">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                  TRANSICIONAR ETAPA EN EL EMBUDO
                </label>

                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as DealStage)}
                  className="mt-2 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
                >
                  {KANBAN_COLUMNS.map((col) => (
                    <option key={col.stage} value={col.stage}>
                      {col.code} — {col.title} ({STAGE_PROBABILITIES[col.stage]}%)
                    </option>
                  ))}
                </select>

                {targetStage === "CLOSED_LOST" && (
                  <div className="mt-3">
                    <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-900">
                      MOTIVO OBLIGATORIO DE PÉRDIDA (CLOSED_LOST)
                    </label>
                    <input
                      type="text"
                      value={lostReasonInput}
                      onChange={(e) => setLostReasonInput(e.target.value)}
                      placeholder="Ej. Crédito puente rechazado / Compró en otro desarrollo"
                      className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                <button
                  type="button"
                  disabled={isPending || targetStage === selectedDeal.stage}
                  onClick={() =>
                    handleStageTransition(
                      selectedDeal.id,
                      targetStage,
                      targetStage === "CLOSED_LOST" ? lostReasonInput : undefined
                    )
                  }
                  className="mt-3 w-full border border-neutral-950 bg-neutral-950 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-600"
                >
                  EJECUTAR TRANSICIÓN DE ETAPA ({STAGE_PROBABILITIES[targetStage]}%)
                </button>
              </div>

              {/* REGISTRO DE SEGUIMIENTO MULTICANAL */}
              <form onSubmit={handleLogActivity} className="border-b border-neutral-900 p-5">
                <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                  REGISTRAR INTERACCIÓN MULTICANAL
                </span>

                <div className="mt-2 grid grid-cols-3 border border-neutral-900">
                  {(
                    [
                      { type: "WHATSAPP_MESSAGE", label: "WHATSAPP" },
                      { type: "PHONE_CALL", label: "LLAMADA" },
                      { type: "SHOWROOM_VISIT", label: "SHOWROOM" },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setActivityType(item.type)}
                      className={`border-r border-neutral-900 py-1.5 font-mono text-[10px] font-bold uppercase last:border-r-0 ${
                        activityType === item.type
                          ? "bg-neutral-950 text-white"
                          : "bg-white text-neutral-800 hover:bg-neutral-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  value={activitySubject}
                  onChange={(e) => setActivitySubject(e.target.value)}
                  placeholder="Asunto: Envío de corrida 30/50/20 o visita..."
                  className="mt-2.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
                />

                <textarea
                  rows={2}
                  value={activityBody}
                  onChange={(e) => setActivityBody(e.target.value)}
                  placeholder="Acuerdos comerciales y fecha de próximo seguimiento..."
                  className="mt-2 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-2.5 w-full border border-neutral-900 bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-neutral-950 transition-colors hover:bg-neutral-100"
                >
                  GUARDAR EN BITÁCORA DE AUDITORÍA
                </button>
              </form>

              {/* HISTORIAL DE AUDITORÍA RECIENTE */}
              <div className="p-5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                  HISTORIAL DE ACTIVIDADES ({selectedDeal.recentActivities.length})
                </span>
                <div className="mt-3 space-y-2.5">
                  {selectedDeal.recentActivities.map((act) => (
                    <div
                      key={act.id}
                      className="border border-neutral-300 bg-neutral-50 p-3 font-mono text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-neutral-500">
                        <span className="font-bold text-neutral-900">{act.type}</span>
                        <span>{act.timestampIso.slice(0, 10)}</span>
                      </div>
                      <p className="mt-1 font-medium text-neutral-900">{act.subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
