"use client";

import React, { useMemo, useState, useTransition } from "react";
import { formatAreaM2, formatCurrencyMXN } from "@/core/utils/currency";
import {
  ComparableWitnessInput,
  SubjectPropertyInput,
} from "@/modules/ai-engine/validations/valuation.schema";
import { ValuationEngineService } from "@/modules/ai-engine/services/valuation.service";
import { generateValuationAction } from "@/modules/ai-engine/actions/valuation.actions";
import { ConservationState, PropertyType } from "@prisma/client";

export interface SubmarketZoneDTO {
  id: string;
  name: string;
  city: string;
  state: string;
  avgPriceM2: number;
  avgRentM2: number;
  historicalCapRate: number;
  annualAppreciation: number;
}

interface ValuationEngineBentoProps {
  zones: SubmarketZoneDTO[];
  initialWitnesses: ComparableWitnessInput[];
}

const CONSERVATION_LABELS: Record<ConservationState, string> = {
  LUXURY_REMODELED: "LUJO REMODELADO (+15%)",
  EXCELLENT: "EXCELENTE / NUEVO (+5%)",
  GOOD: "BUEN ESTADO (BASE 1.00)",
  REGULAR: "REGULAR (-12%)",
  REQUIRES_REPAIR: "REQUIERE OBRA (-28%)",
};

export function ValuationEngineBento({
  zones,
  initialWitnesses,
}: ValuationEngineBentoProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id ?? "");
  const [propertyType, setPropertyType] = useState<PropertyType>("APARTMENT");
  const [totalAreaM2, setTotalAreaM2] = useState<number>(135);
  const [interiorAreaM2, setInteriorAreaM2] = useState<number>(118);
  const [ageYears, setAgeYears] = useState<number>(1);
  const [conservationState, setConservationState] =
    useState<ConservationState>("EXCELLENT");
  const [parkingSpots, setParkingSpots] = useState<number>(2);
  const [amenitiesCount, setAmenitiesCount] = useState<number>(6);

  const [witnesses, setWitnesses] =
    useState<ComparableWitnessInput[]>(initialWitnesses);
  const [emittedFolio, setEmittedFolio] = useState<string>("VAL-2026-SIM");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const activeZone = useMemo(
    () => zones.find((z) => z.id === selectedZoneId) ?? zones[0],
    [zones, selectedZoneId]
  );

  const subjectInput: SubjectPropertyInput = useMemo(
    () => ({
      userId: "a2d1f930-5847-4e08-8e68-0fc29b719488",
      submarketZoneId: activeZone?.id ?? "00000000-0000-4000-8000-000000000001",
      propertyType,
      totalAreaM2: Math.max(20, totalAreaM2),
      interiorAreaM2: Math.max(15, interiorAreaM2),
      ageYears,
      conservationState,
      parkingSpots,
      amenitiesCount,
      latitude: 19.432608,
      longitude: -99.194702,
    }),
    [
      activeZone,
      propertyType,
      totalAreaM2,
      interiorAreaM2,
      ageYears,
      conservationState,
      parkingSpots,
      amenitiesCount,
    ]
  );

  const simulation = useMemo(() => {
    if (!activeZone || witnesses.length < 3) return null;
    return ValuationEngineService.simulateValuation(subjectInput, witnesses, {
      historicalCapRatePct: activeZone.historicalCapRate,
      annualAppreciationPct: activeZone.annualAppreciation,
    });
  }, [subjectInput, witnesses, activeZone]);

  const handlePersistStudy = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const response = await generateValuationAction(subjectInput, witnesses);
      if (response.success) {
        setEmittedFolio(response.data.folio);
        setStatusMessage(
          `DICTAMEN PERSISTIDO [${response.data.folio}]: Valor estimado ${formatCurrencyMXN(Number(response.data.estimatedValue))} (${formatCurrencyMXN(Number(response.data.priceM2))}/m²).`
        );
      } else {
        const fallbackFolio = `VAL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setEmittedFolio(fallbackFolio);
        setStatusMessage(
          `SIMULACIÓN AUDITADA EN MEMORIA [${fallbackFolio}]: ${response.error}`
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* CABECERA DEL MOTOR DE INTELIGENCIA INMOBILIARIA */}
      <section className="grid grid-cols-12 border border-neutral-900 bg-white">
        <div className="col-span-8 border-r border-neutral-900 p-6">
          <div className="flex items-center gap-3">
            <span className="border border-neutral-900 bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              AI-ENGINE // HEDONIC + COMPARABLES
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              FOLIO ACTIVO: {emittedFolio}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-950">
            MOTOR DE VALUACIÓN ALGORÍTMICA & PLUSVALÍA PREDICTIVA
          </h1>
          <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-neutral-600">
            Homologación econométrica de testigos de mercado mediante elasticidad de
            superficie $(A_s / A_t)^{-0.12}$, ponderación exponencial por distancia
            geodésica y proyección compuesta de plusvalía a 3 y 5 años.
          </p>
        </div>

        <div className="col-span-4 flex flex-col justify-between bg-neutral-950 p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
              VALOR COMERCIAL ESTIMADO (MXN)
            </span>
            <span className="border border-white px-2 py-0.5 font-mono text-[10px] font-bold">
              CONFIANZA {simulation?.confidenceScorePct ?? 0}%
            </span>
          </div>

          <div className="my-2 font-mono text-3xl font-bold tabular-nums">
            {simulation ? formatCurrencyMXN(simulation.estimatedValueMxn) : "$0"}
          </div>

          <div className="flex items-center justify-between border-t border-neutral-800 pt-3 font-mono text-xs text-neutral-300">
            <span>UNITARIO HOMOLOGADO:</span>
            <span className="font-bold tabular-nums text-white">
              {simulation ? `${formatCurrencyMXN(simulation.estimatedPriceM2Mxn)} / m²` : "-"}
            </span>
          </div>
        </div>
      </section>

      {statusMessage && (
        <div className="flex items-center justify-between border border-neutral-900 bg-neutral-950 px-5 py-3 font-mono text-xs text-white">
          <span>{statusMessage}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="border border-white px-2 py-0.5 text-[10px] uppercase"
          >
            CERRAR
          </button>
        </div>
      )}

      {/* BENTO FILA 1: PARÁMETROS DEL INMUEBLE SUJETO (5 COL) + PROYECCIÓN DE PLUSVALÍA Y RENTABILIDAD (7 COL) */}
      <section className="grid grid-cols-12 gap-6">
        {/* CELDA BENTO 01: PARAMETRIZACIÓN DEL INMUEBLE SUJETO */}
        <div className="col-span-5 border border-neutral-900 bg-white p-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              01 // VECTOR DEL INMUEBLE SUJETO
            </span>
            <span className="font-mono text-[10px] uppercase text-neutral-500">
              PARÁMETROS FÍSICOS
            </span>
          </div>

          <div className="mt-4 space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                POLÍGONO DE SUBMERCADO
              </label>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {z.city} (PLUSVALÍA {z.annualAppreciation}% ANUAL)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  SUPERFICIE TOTAL (M²)
                </label>
                <input
                  type="number"
                  min={25}
                  max={2000}
                  value={totalAreaM2}
                  onChange={(e) => setTotalAreaM2(Number(e.target.value) || 25)}
                  className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-bold tabular-nums text-neutral-950"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  ÁREA INTERIOR (M²)
                </label>
                <input
                  type="number"
                  min={20}
                  max={2000}
                  value={interiorAreaM2}
                  onChange={(e) => setInteriorAreaM2(Number(e.target.value) || 20)}
                  className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-bold tabular-nums text-neutral-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                ESTADO DE CONSERVACIÓN (FACTOR K_c)
              </label>
              <select
                value={conservationState}
                onChange={(e) =>
                  setConservationState(e.target.value as ConservationState)
                }
                className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-semibold text-neutral-950"
              >
                {(Object.keys(CONSERVATION_LABELS) as ConservationState[]).map(
                  (state) => (
                    <option key={state} value={state}>
                      {CONSERVATION_LABELS[state]}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  EDAD (AÑOS)
                </label>
                <input
                  type="number"
                  min={0}
                  max={80}
                  value={ageYears}
                  onChange={(e) => setAgeYears(Math.max(0, Number(e.target.value) || 0))}
                  className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-1.5 font-mono text-xs font-bold tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  CAJONES EST.
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={parkingSpots}
                  onChange={(e) =>
                    setParkingSpots(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-1.5 font-mono text-xs font-bold tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                  AMENIDADES
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={amenitiesCount}
                  onChange={(e) =>
                    setAmenitiesCount(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-1.5 font-mono text-xs font-bold tabular-nums"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={isPending}
              onClick={handlePersistStudy}
              className="mt-2 w-full border border-neutral-950 bg-neutral-950 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
            >
              EMITIR Y CERTIFICAR FOLIO DE VALUACIÓN
            </button>
          </div>
        </div>

        {/* CELDA BENTO 02: BANDA DE CONFIANZA, PLUSVALÍA 3Y/5Y Y SCORING DE INVERSIÓN */}
        <div className="col-span-7 flex flex-col justify-between border border-neutral-900 bg-white p-6">
          {simulation && (
            <>
              <div>
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    02 // INTERVALO DE CONFIANZA (±6.5%) & RENDIMIENTO PATRIMONIAL
                  </span>
                  <span className="border border-neutral-900 px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                    MÉTODO: HYBRID_WEIGHTED
                  </span>
                </div>

                {/* INTERVALO MÍNIMO - ESTIMADO - MÁXIMO */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-neutral-900 border border-neutral-900 bg-neutral-50 font-mono">
                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                      BANDA INFERIOR (-6.5%)
                    </span>
                    <div className="mt-1 text-lg font-bold tabular-nums text-neutral-900">
                      {formatCurrencyMXN(simulation.valueRangeMinMxn)}
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-4 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                      VALOR CENTRAL HOMOLOGADO
                    </span>
                    <div className="mt-1 text-lg font-bold tabular-nums">
                      {formatCurrencyMXN(simulation.estimatedValueMxn)}
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                      BANDA SUPERIOR (+6.5%)
                    </span>
                    <div className="mt-1 text-lg font-bold tabular-nums text-neutral-900">
                      {formatCurrencyMXN(simulation.valueRangeMaxMxn)}
                    </div>
                  </div>
                </div>

                {/* PROYECCIÓN DE PLUSVALÍA A 3 Y 5 AÑOS */}
                <div className="mt-5">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                    CURVA DE APRECIACIÓN DE CAPITAL PROYECTADA
                  </span>

                  <div className="mt-2 grid grid-cols-3 gap-4 font-mono">
                    <div className="border border-neutral-900 p-4">
                      <div className="text-[10px] font-bold uppercase text-neutral-500">
                        HOY (AÑO 0)
                      </div>
                      <div className="mt-2 text-base font-bold tabular-nums text-neutral-950">
                        {formatCurrencyMXN(simulation.estimatedValueMxn)}
                      </div>
                      <div className="mt-1 text-[10px] text-neutral-500">
                        BASE SPOT SUBMERCADO
                      </div>
                    </div>

                    <div className="border border-neutral-900 bg-neutral-50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-neutral-600">
                          HORIZONTE 3 AÑOS
                        </span>
                        <span className="border border-neutral-900 bg-white px-1.5 py-0.5 text-[10px] font-bold">
                          +{simulation.appreciation3YPct}%
                        </span>
                      </div>
                      <div className="mt-2 text-base font-bold tabular-nums text-neutral-950">
                        {formatCurrencyMXN(simulation.projectedValue3YMxn)}
                      </div>
                      <div className="mt-1 text-[10px] text-neutral-600">
                        GANANCIA:{" "}
                        {formatCurrencyMXN(
                          simulation.projectedValue3YMxn - simulation.estimatedValueMxn
                        )}
                      </div>
                    </div>

                    <div className="border border-neutral-900 bg-neutral-100 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-neutral-900">
                          HORIZONTE 5 AÑOS
                        </span>
                        <span className="border border-neutral-900 bg-neutral-950 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          +{simulation.appreciation5YPct}%
                        </span>
                      </div>
                      <div className="mt-2 text-base font-bold tabular-nums text-neutral-950">
                        {formatCurrencyMXN(simulation.projectedValue5YMxn)}
                      </div>
                      <div className="mt-1 text-[10px] text-neutral-700">
                        GANANCIA:{" "}
                        {formatCurrencyMXN(
                          simulation.projectedValue5YMxn - simulation.estimatedValueMxn
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* INDICADORES DE INVERSIÓN (CAP RATE Y ROI TOTAL 5Y) */}
              <div className="mt-5 grid grid-cols-2 divide-x divide-neutral-900 border border-neutral-900 bg-white font-mono">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-neutral-500">
                      CAP RATE ANUAL ESTIMADO
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      RENTA BRUTA / VALOR ACTIVO
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-neutral-950">
                    {simulation.projectedCapRatePct}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-neutral-500">
                      ROI ACUMULADO (5 AÑOS)
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      PLUSVALÍA + FLUJO RENTAS
                    </div>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-neutral-950">
                    {simulation.projectedRoi5YPct}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* BENTO FILA 2: MATRIZ DE HOMOLOGACIÓN DE TESTIGOS DE MERCADO */}
      <section className="border border-neutral-900 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-900 px-6 py-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            03 // MATRIZ DE HOMOLOGACIÓN ECONOMÉTRICA DE TESTIGOS ({witnesses.length}{" "}
            COMPARABLES)
          </span>
          <span className="font-mono text-[11px] text-neutral-600">
            ELASTICIDAD ÁREA: (A_SUJETO / A_TESTIGO)^-0.12 · DECAIMIENTO GEODÉSICO EXP(-0.5·d)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-neutral-900 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="border-r border-neutral-300 px-4 py-3">FUENTE / TESTIGO</th>
                <th className="border-r border-neutral-300 px-3 py-3 text-right">
                  PRECIO LISTA
                </th>
                <th className="border-r border-neutral-300 px-3 py-3 text-right">
                  ÁREA
                </th>
                <th className="border-r border-neutral-300 px-3 py-3 text-right">
                  $/M² BRUTO
                </th>
                <th className="border-r border-neutral-300 px-3 py-3 text-right">
                  DISTANCIA
                </th>
                <th className="border-r border-neutral-300 px-3 py-3 text-right">
                  FACTOR ÁREA
                </th>
                <th className="border-r border-neutral-300 px-3 py-3 text-right">
                  FACTOR CONS.
                </th>
                <th className="border-r border-neutral-300 px-4 py-3 text-right">
                  $/M² HOMOLOGADO
                </th>
                <th className="px-4 py-3 text-right">PESO SIMILITUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {simulation?.homologatedWitnesses.map((hw, idx) => (
                <tr key={`${hw.sourceName}-${idx}`} className="hover:bg-neutral-50">
                  <td className="border-r border-neutral-200 px-4 py-3 font-semibold text-neutral-950">
                    <div>{hw.sourceName}</div>
                    <div className="text-[10px] text-neutral-500">
                      {hw.conservationState}
                    </div>
                  </td>
                  <td className="border-r border-neutral-200 px-3 py-3 text-right tabular-nums">
                    {formatCurrencyMXN(hw.listingPrice)}
                  </td>
                  <td className="border-r border-neutral-200 px-3 py-3 text-right tabular-nums">
                    {formatAreaM2(hw.totalAreaM2)}
                  </td>
                  <td className="border-r border-neutral-200 px-3 py-3 text-right tabular-nums text-neutral-600">
                    {formatCurrencyMXN(hw.rawPricePerM2)}
                  </td>
                  <td className="border-r border-neutral-200 px-3 py-3 text-right tabular-nums">
                    {hw.distanceMeters} m
                  </td>
                  <td className="border-r border-neutral-200 px-3 py-3 text-right tabular-nums">
                    {hw.areaFactor.toFixed(3)}x
                  </td>
                  <td className="border-r border-neutral-200 px-3 py-3 text-right tabular-nums">
                    {hw.conservationFactor.toFixed(3)}x
                  </td>
                  <td className="border-r border-neutral-200 px-4 py-3 text-right font-bold tabular-nums text-neutral-950">
                    {formatCurrencyMXN(hw.adjustedPriceM2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="border border-neutral-900 bg-neutral-950 px-2 py-0.5 text-[11px] font-bold tabular-nums text-white">
                      {(hw.similarityFactor * 100).toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
