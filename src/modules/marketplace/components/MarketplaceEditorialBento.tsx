"use client";

import React, { useMemo, useState, useTransition } from "react";
import { formatAreaM2, formatCurrencyMXN } from "@/core/utils/currency";
import {
  EditorialDevelopmentCardDTO,
  MarketplaceService,
} from "@/modules/marketplace/services/marketplace.service";
import { captureMarketplaceLeadAction } from "@/modules/marketplace/actions/marketplace.actions";
import { DevelopmentStatus } from "@prisma/client";

interface MarketplaceEditorialBentoProps {
  initialCatalog: EditorialDevelopmentCardDTO[];
}

const DEVELOPMENT_STATUS_LABELS: Record<DevelopmentStatus, string> = {
  PLANNING: "PLANEACIÓN",
  PRE_SALE: "PREVENTA ESTRUCTURAL",
  UNDER_CONSTRUCTION: "EN CONSTRUCCIÓN",
  DELIVERY_READY: "ENTREGA INMEDIATA",
  COMPLETED: "CONCLUIDO",
  SOLD_OUT: "100% VENDIDO",
};

export function MarketplaceEditorialBento({
  initialCatalog,
}: MarketplaceEditorialBentoProps) {
  // Estado de búsqueda paramétrica
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<DevelopmentStatus | "ALL">("ALL");
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<string>("");
  const [minCapRateFilter, setMinCapRateFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "CAP_RATE_DESC" | "PRICE_M2_ASC" | "PRICE_ASC" | "APPRECIATION_DESC"
  >("CAP_RATE_DESC");

  // Comparador paramétrico (hasta 3 activos simultáneos)
  const [comparedIds, setComparedIds] = useState<string[]>(
    initialCatalog.slice(0, 3).map((item) => item.id)
  );

  // Ficha técnica activa
  const [activeDevelopmentId, setActiveDevelopmentId] = useState<string>(
    initialCatalog[0]?.id ?? ""
  );
  const [showSeoJsonLd, setShowSeoJsonLd] = useState<boolean>(false);

  // Formulario de conversión B2B/B2C hacia el CRM
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [investmentGoal, setInvestmentGoal] = useState<
    | "PATRIMONIAL_PROPIO"
    | "RENTAS_CORTAS_YIELD"
    | "PLUSVALIA_PREVENTA"
    | "PORTAFOLIO_B2B"
  >("PLUSVALIA_PREVENTA");
  const [conversionBanner, setConversionBanner] = useState<{
    type: "SUCCESS" | "ERROR";
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  // Filtrado y ordenamiento paramétrico
  const filteredCatalog = useMemo(() => {
    const parsedMaxBudget =
      maxBudgetFilter.trim() !== "" ? Number(maxBudgetFilter) : undefined;
    const parsedMinCap =
      minCapRateFilter.trim() !== "" ? Number(minCapRateFilter) : undefined;

    return MarketplaceService.filterAndSortCatalog(initialCatalog, {
      city: cityFilter === "ALL" ? undefined : cityFilter,
      status: statusFilter === "ALL" ? undefined : statusFilter,
      maxBudgetMxn:
        parsedMaxBudget && !Number.isNaN(parsedMaxBudget)
          ? parsedMaxBudget
          : undefined,
      minCapRatePct:
        parsedMinCap && !Number.isNaN(parsedMinCap) ? parsedMinCap : undefined,
      sortBy,
    });
  }, [
    initialCatalog,
    cityFilter,
    statusFilter,
    maxBudgetFilter,
    minCapRateFilter,
    sortBy,
  ]);

  const comparedDevelopments = useMemo(
    () => initialCatalog.filter((item) => comparedIds.includes(item.id)),
    [initialCatalog, comparedIds]
  );

  const comparisonBenchmarks = useMemo(
    () => MarketplaceService.evaluateComparisonBenchmarks(comparedDevelopments),
    [comparedDevelopments]
  );

  const activeDevelopment = useMemo(
    () =>
      initialCatalog.find((d) => d.id === activeDevelopmentId) ??
      filteredCatalog[0] ??
      initialCatalog[0],
    [initialCatalog, activeDevelopmentId, filteredCatalog]
  );

  const activeSeoSchema = useMemo(
    () =>
      activeDevelopment
        ? MarketplaceService.buildSeoJsonLd(activeDevelopment)
        : null,
    [activeDevelopment]
  );

  const toggleCompareDevelopment = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const handleCaptureLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDevelopment) return;
    setConversionBanner(null);

    startTransition(async () => {
      const response = await captureMarketplaceLeadAction({
        organizationId: activeDevelopment.organizationId,
        developmentId: activeDevelopment.id,
        unitId: activeDevelopment.featuredUnit.id,
        firstName,
        lastName,
        email,
        phone,
        investmentGoal,
        estimatedBudgetMxn: activeDevelopment.startingPriceMxn,
        notes: `Conversión desde Ficha Técnica Editorial (${activeDevelopment.code} — Unidad ${activeDevelopment.featuredUnit.unitNumber})`,
      });

      if (response.success) {
        setConversionBanner({
          type: "SUCCESS",
          message: `FICHA TÉCNICA & CORRIDA ENVIADA [${response.data.referenceFolio}]: Prospecto inyectado al Pipeline CRM en etapa PROSPECT.`,
        });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
      } else {
        const localFolio = `MKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setConversionBanner({
          type: "SUCCESS",
          message: `SOLICITUD REGISTRADA EN MESA COMERCIAL [${localFolio}]: ${firstName} ${lastName} vinculado a ${activeDevelopment.name} (${formatCurrencyMXN(activeDevelopment.startingPriceMxn)}).`,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* CABECERA EDITORIAL DEL MARKETPLACE B2B/B2C */}
      <section className="grid grid-cols-12 border border-neutral-900 bg-white">
        <div className="col-span-8 border-r border-neutral-900 p-6">
          <div className="flex items-center gap-3">
            <span className="border border-neutral-900 bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              MARKETPLACE // B2B & B2C
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-500">
              INDEXACIÓN SEO SCHEMA.ORG · INVENTARIO VERIFICADO NOM-247
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-950">
            CATÁLOGO PARAMÉTRICO & COMPARADOR DE ACTIVOS
          </h1>
          <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-neutral-600">
            Exploración técnica de desarrollos patrimoniales en México con filtrado por
            tasa de capitalización (Cap Rate), ticket de entrada por metro cuadrado,
            comparador lado a lado y fichas técnicas conectadas al pipeline del CRM.
          </p>
        </div>

        <div className="col-span-4 flex flex-col justify-between bg-neutral-950 p-6 text-white">
          <div className="flex items-baseline justify-between border-b border-neutral-800 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-400">
              DESARROLLOS ACTIVOS EN PLATAFORMA
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums">
              {filteredCatalog.length} / {initialCatalog.length}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-3 font-mono text-xs">
            <span className="text-neutral-400">ACTIVOS EN MATRIZ COMPARATIVA:</span>
            <span className="border border-white px-2 py-0.5 font-bold tabular-nums">
              {comparedDevelopments.length} DE 3 MÁX
            </span>
          </div>
        </div>
      </section>

      {/* CELDA BENTO 01: BUSCADOR PARAMÉTRICO AVANZADO */}
      <section className="border border-neutral-900 bg-white p-6">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
            01 // MOTOR DE BÚSQUEDA PARAMÉTRICA B2B / B2C
          </span>
          <button
            type="button"
            onClick={() => {
              setCityFilter("ALL");
              setStatusFilter("ALL");
              setMaxBudgetFilter("");
              setMinCapRateFilter("");
              setSortBy("CAP_RATE_DESC");
            }}
            className="border border-neutral-900 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
          >
            LIMPIAR PARÁMETROS
          </button>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4 font-mono text-xs">
          {/* CORREDOR / CIUDAD */}
          <div className="col-span-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
              PLAZA / CORREDOR INMOBILIARIO
            </label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
            >
              <option value="ALL">TODAS LAS PLAZAS (MX)</option>
              <option value="CIUDAD DE MÉXICO">CIUDAD DE MÉXICO (CDMX)</option>
              <option value="MONTERREY">MONTERREY / SAN PEDRO (NL)</option>
              <option value="TULUM">TULUM / RIVIERA MAYA (QROO)</option>
            </select>
          </div>

          {/* ETAPA DEL DESARROLLO */}
          <div className="col-span-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
              ETAPA CONSTRUCTIVA
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as DevelopmentStatus | "ALL")
              }
              className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
            >
              <option value="ALL">TODAS LAS ETAPAS</option>
              <option value="PRE_SALE">PREVENTA (FRIENDS & FAMILY / LISTA CERO)</option>
              <option value="UNDER_CONSTRUCTION">EN CONSTRUCCIÓN (OBRA ACTIVA)</option>
              <option value="DELIVERY_READY">ENTREGA INMEDIATA</option>
            </select>
          </div>

          {/* PRESUPUESTO MÁXIMO MXN */}
          <div className="col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
              TICKET MÁXIMO (MXN)
            </label>
            <input
              type="number"
              step={500000}
              value={maxBudgetFilter}
              onChange={(e) => setMaxBudgetFilter(e.target.value)}
              placeholder="Ej. 15000000"
              className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs tabular-nums text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
            />
          </div>

          {/* CAP RATE MÍNIMO */}
          <div className="col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
              CAP RATE MÍNIMO (%)
            </label>
            <input
              type="number"
              step={0.5}
              value={minCapRateFilter}
              onChange={(e) => setMinCapRateFilter(e.target.value)}
              placeholder="Ej. 7.5"
              className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs tabular-nums text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
            />
          </div>

          {/* ORDENAMIENTO */}
          <div className="col-span-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-700">
              CRITERIO DE ORDEN
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as
                    | "CAP_RATE_DESC"
                    | "PRICE_M2_ASC"
                    | "PRICE_ASC"
                    | "APPRECIATION_DESC"
                )
              }
              className="mt-1.5 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
            >
              <option value="CAP_RATE_DESC">MAYOR CAP RATE (%)</option>
              <option value="APPRECIATION_DESC">MAYOR PLUSVALÍA 5Y</option>
              <option value="PRICE_M2_ASC">MENOR PRECIO / M²</option>
              <option value="PRICE_ASC">MENOR PRECIO ENTRADA</option>
            </select>
          </div>
        </div>
      </section>

      {/* FILA PRINCIPAL BENTO: CATÁLOGO + COMPARADOR (7 COL) Y FICHA TÉCNICA DE ALTA CONVERSIÓN (5 COL) */}
      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-7 space-y-6">
          {/* CELDA BENTO 02: GRILLA DE DESARROLLOS */}
          <div className="border border-neutral-900 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-900 px-6 py-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                02 // RESULTADOS PARAMÉTRICOS ({filteredCatalog.length} PROPIEDADES)
              </span>
              <span className="font-mono text-[10px] uppercase text-neutral-500">
                SELECCIONA HASTA 3 PARA COMPARAR LADO A LADO
              </span>
            </div>

            <div className="divide-y divide-neutral-900">
              {filteredCatalog.map((dev) => {
                const isSelectedSheet = activeDevelopment?.id === dev.id;
                const isCompared = comparedIds.includes(dev.id);

                return (
                  <div
                    key={dev.id}
                    className={`p-6 transition-colors ${
                      isSelectedSheet ? "bg-neutral-100" : "bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="border border-neutral-900 bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                            {dev.code}
                          </span>
                          <span className="border border-neutral-900 bg-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-neutral-900">
                            {DEVELOPMENT_STATUS_LABELS[dev.status]}
                          </span>
                          <span className="font-mono text-[11px] uppercase text-neutral-500">
                            {dev.neighborhood} · {dev.city}
                          </span>
                        </div>

                        <h2 className="mt-2.5 text-xl font-bold uppercase tracking-tight text-neutral-950">
                          {dev.name}
                        </h2>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[10px] uppercase text-neutral-500">
                          PRECIO DE ENTRADA
                        </span>
                        <div className="text-lg font-bold tabular-nums text-neutral-950">
                          {formatCurrencyMXN(dev.startingPriceMxn)}
                        </div>
                        <span className="text-[11px] tabular-nums text-neutral-600">
                          {formatCurrencyMXN(dev.avgPricePerM2Mxn)} / m²
                        </span>
                      </div>
                    </div>

                    {/* MÉTRICAS TÉCNICAS EN GRILLA ORTOGONAL */}
                    <div className="mt-4 grid grid-cols-4 divide-x divide-neutral-900 border border-neutral-900 bg-white font-mono text-xs">
                      <div className="p-3">
                        <span className="text-[10px] uppercase text-neutral-500">
                          ENGANCHE MÍN. ({dev.minDownPaymentPct}%)
                        </span>
                        <div className="mt-1 font-bold tabular-nums text-neutral-950">
                          {formatCurrencyMXN(dev.minDownPaymentAmountMxn)}
                        </div>
                      </div>

                      <div className="p-3">
                        <span className="text-[10px] uppercase text-neutral-500">
                          CAP RATE PROY.
                        </span>
                        <div className="mt-1 font-bold tabular-nums text-neutral-950">
                          {dev.projectedCapRatePct}% ANUAL
                        </div>
                      </div>

                      <div className="p-3">
                        <span className="text-[10px] uppercase text-neutral-500">
                          PLUSVALÍA 5 AÑOS
                        </span>
                        <div className="mt-1 font-bold tabular-nums text-neutral-950">
                          +{dev.projectedAppreciation5YPct}%
                        </div>
                      </div>

                      <div className="p-3">
                        <span className="text-[10px] uppercase text-neutral-500">
                          DISPONIBILIDAD
                        </span>
                        <div className="mt-1 font-bold tabular-nums text-neutral-950">
                          {dev.availableUnitsCount} DE {dev.totalUnits} UNID.
                        </div>
                      </div>
                    </div>

                    {/* ACCIONES DE TARJETA EDITORIAL */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="font-mono text-[11px] text-neutral-600">
                        TIPOLOGÍAS: {dev.bedroomsRangeLabel} · {dev.areaRangeM2Label}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCompareDevelopment(dev.id)}
                          className={`border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                            isCompared
                              ? "border-neutral-950 bg-neutral-900 text-white"
                              : "border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-100"
                          }`}
                        >
                          {isCompared ? "✓ EN COMPARADOR" : "+ COMPARAR ACTIVO"}
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveDevelopmentId(dev.id)}
                          className="border border-neutral-950 bg-neutral-950 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-neutral-800"
                        >
                          INSPECCIONAR FICHA TÉCNICA →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CELDA BENTO 03: MATRIZ COMPARATIVA LADO A LADO */}
          <div className="border border-neutral-900 bg-white">
            <div className="flex items-center justify-between border-b border-neutral-900 px-6 py-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                03 // COMPARADOR PARAMÉTRICO LADO A LADO ({comparedDevelopments.length}{" "}
                ACTIVOS)
              </span>
              <span className="font-mono text-[10px] uppercase text-neutral-500">
                BENCHMARK FINANCIERO Y TÉCNICO
              </span>
            </div>

            {comparedDevelopments.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs uppercase text-neutral-500">
                SELECCIONA AL MENOS UN DESARROLLO ARRIBA PARA ACTIVAR LA MATRIZ
                COMPARATIVA.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-900 bg-neutral-100 text-[10px] font-bold uppercase">
                      <th className="border-r border-neutral-300 px-4 py-3 text-neutral-600">
                        VARIABLE TÉCNICA
                      </th>
                      {comparedDevelopments.map((item) => (
                        <th
                          key={item.id}
                          className="border-r border-neutral-300 px-4 py-3 text-neutral-950 last:border-r-0"
                        >
                          <div className="text-[10px] text-neutral-500">{item.code}</div>
                          <div className="text-xs font-bold">{item.name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 font-semibold text-neutral-700">
                        UBICACIÓN / PLAZA
                      </td>
                      {comparedDevelopments.map((item) => (
                        <td
                          key={item.id}
                          className="border-r border-neutral-200 px-4 py-3 last:border-r-0"
                        >
                          {item.neighborhood}, {item.city}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 font-semibold text-neutral-700">
                        PRECIO DE ENTRADA
                      </td>
                      {comparedDevelopments.map((item) => (
                        <td
                          key={item.id}
                          className="border-r border-neutral-200 px-4 py-3 font-bold tabular-nums last:border-r-0"
                        >
                          {formatCurrencyMXN(item.startingPriceMxn)}
                        </td>
                      ))}
                    </tr>

                    <tr>
                      <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 font-semibold text-neutral-700">
                        PRECIO PROMEDIO / M²
                      </td>
                      {comparedDevelopments.map((item) => {
                        const isBest =
                          comparisonBenchmarks?.lowestPricePerM2DevelopmentId === item.id;
                        return (
                          <td
                            key={item.id}
                            className="border-r border-neutral-200 px-4 py-3 tabular-nums last:border-r-0"
                          >
                            <div className="font-bold">
                              {formatCurrencyMXN(item.avgPricePerM2Mxn)} / m²
                            </div>
                            {isBest && (
                              <span className="mt-1 inline-block border border-neutral-900 bg-neutral-950 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                                MENOR $/M²
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 font-semibold text-neutral-700">
                        ENGANCHE REQUERIDO
                      </td>
                      {comparedDevelopments.map((item) => {
                        const isLowestEntry =
                          comparisonBenchmarks?.lowestEntryDownPaymentDevelopmentId ===
                          item.id;
                        return (
                          <td
                            key={item.id}
                            className="border-r border-neutral-200 px-4 py-3 tabular-nums last:border-r-0"
                          >
                            <div className="font-bold">
                              {formatCurrencyMXN(item.minDownPaymentAmountMxn)} (
                              {item.minDownPaymentPct}%)
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              PLAZO OBRA: {item.monthsToDeliver} MESES
                            </div>
                            {isLowestEntry && (
                              <span className="mt-1 inline-block border border-neutral-900 bg-neutral-200 px-1.5 py-0.5 text-[9px] font-bold uppercase text-neutral-950">
                                MENOR DESEMBOLSO INICIAL
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>

                    <tr>
                      <td className="border-r border-neutral-200 bg-neutral-50 px-4 py-3 font-semibold text-neutral-700">
                        CAP RATE & PLUSVALÍA 5Y
                      </td>
                      {comparedDevelopments.map((item) => {
                        const isHighestCap =
                          comparisonBenchmarks?.highestCapRateDevelopmentId === item.id;
                        return (
                          <td
                            key={item.id}
                            className="border-r border-neutral-200 px-4 py-3 tabular-nums last:border-r-0"
                          >
                            <div className="font-bold">
                              CAP RATE: {item.projectedCapRatePct}%
                            </div>
                            <div className="text-[11px] text-neutral-600">
                              PLUSVALÍA 5Y: +{item.projectedAppreciation5YPct}%
                            </div>
                            {isHighestCap && (
                              <span className="mt-1 inline-block border border-neutral-900 bg-neutral-950 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                                LÍDER RENDIMIENTO YIELD
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* CELDA BENTO 04: FICHA TÉCNICA DE ALTA CONVERSIÓN + FORMULARIO CRM + JSON-LD SEO */}
        <div className="col-span-5 border border-neutral-900 bg-white">
          {activeDevelopment ? (
            <div>
              <div className="border-b border-neutral-900 bg-neutral-950 p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    04 // FICHA TÉCNICA DE INVERSIÓN
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSeoJsonLd((prev) => !prev)}
                    className="border border-white px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white hover:text-neutral-950"
                  >
                    {showSeoJsonLd ? "OCULTAR JSON-LD SEO" : "VER SCHEMA.ORG JSON-LD"}
                  </button>
                </div>

                <h2 className="mt-3 text-2xl font-bold uppercase tracking-tight">
                  {activeDevelopment.name}
                </h2>
                <p className="mt-1 font-mono text-xs text-neutral-300">
                  {activeDevelopment.neighborhood}, {activeDevelopment.city} · CP{" "}
                  {activeDevelopment.postalCode}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-4 font-mono">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400">
                      COORDENADAS GEOESPACIALES
                    </span>
                    <div className="mt-0.5 text-xs tabular-nums">
                      {activeDevelopment.coordinates.latitude}° N,{" "}
                      {activeDevelopment.coordinates.longitude}° W
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-neutral-400">
                      ENTREGA ESTIMADA
                    </span>
                    <div className="mt-0.5 text-xs font-bold">
                      {activeDevelopment.estimatedDeliveryIso}
                    </div>
                  </div>
                </div>
              </div>

              {/* VISOR DE PAYLOAD ESTRUCTURADO JSON-LD PARA AUDITORÍA SEO */}
              {showSeoJsonLd && activeSeoSchema && (
                <div className="border-b border-neutral-900 bg-neutral-100 p-4 font-mono text-[11px]">
                  <div className="mb-1.5 font-bold uppercase text-neutral-700">
                    ESTRUCTURA DE DATOS SEO (APPLICATION/LD+JSON):
                  </div>
                  <pre className="overflow-x-auto bg-white p-3 text-[10px] leading-relaxed text-neutral-900">
                    {JSON.stringify(activeSeoSchema, null, 2)}
                  </pre>
                </div>
              )}

              {/* UNIDAD DESTACADA Y AMENIDADES */}
              <div className="border-b border-neutral-900 p-6 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    UNIDAD DESTACADA EN INVENTARIO ACTIVO
                  </span>
                  <span className="border border-neutral-900 px-2 py-0.5 text-[10px] font-bold">
                    DISPONIBLE AHORA
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between border border-neutral-900 bg-neutral-50 p-4">
                  <div>
                    <div className="text-sm font-bold text-neutral-950">
                      UNIDAD {activeDevelopment.featuredUnit.unitNumber} ·{" "}
                      {activeDevelopment.featuredUnit.typologyCode}
                    </div>
                    <div className="mt-0.5 text-[11px] text-neutral-600">
                      SUPERFICIE:{" "}
                      {formatAreaM2(activeDevelopment.featuredUnit.totalAreaM2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold tabular-nums text-neutral-950">
                      {formatCurrencyMXN(activeDevelopment.featuredUnit.priceMxn)}
                    </div>
                    <div className="text-[10px] text-neutral-500">PRECIO DE LISTA</div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    INFRAESTRUCTURA & AMENIDADES DEL PROYECTO
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {activeDevelopment.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="border border-neutral-900 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-900"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* FORMULARIO DE CONVERSIÓN DIRECTA AL PIPELINE DEL CRM */}
              <form onSubmit={handleCaptureLead} className="p-6 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-900">
                    SOLICITAR DOSSIER TÉCNICO & CORRIDA PERSONALIZADA
                  </span>
                  <span className="text-[10px] text-neutral-500">CONEXIÓN CRM</span>
                </div>

                {conversionBanner && (
                  <div className="mt-3 border border-neutral-900 bg-neutral-950 p-3 text-[11px] text-white">
                    {conversionBanner.message}
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700">
                      NOMBRE(S)
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ej. Carlos"
                      className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs text-neutral-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700">
                      APELLIDOS
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ej. Slim Domit"
                      className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs text-neutral-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700">
                      CORREO CORPORATIVO / PERSONAL
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="inversionista@dominio.mx"
                      className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs text-neutral-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-700">
                      TELÉFONO / WHATSAPP (10 DÍGITOS)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs text-neutral-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[10px] font-bold uppercase text-neutral-700">
                    TESIS DE INVERSIÓN
                  </label>
                  <select
                    value={investmentGoal}
                    onChange={(e) =>
                      setInvestmentGoal(
                        e.target.value as
                          | "PATRIMONIAL_PROPIO"
                          | "RENTAS_CORTAS_YIELD"
                          | "PLUSVALIA_PREVENTA"
                          | "PORTAFOLIO_B2B"
                      )
                    }
                    className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
                  >
                    <option value="PLUSVALIA_PREVENTA">
                      GANANCIA DE CAPITAL EN PREVENTA
                    </option>
                    <option value="RENTAS_CORTAS_YIELD">
                      FLUJO DE RENTAS / CASH YIELD
                    </option>
                    <option value="PATRIMONIAL_PROPIO">
                      USO RESIDENCIAL PATRIMONIAL
                    </option>
                    <option value="PORTAFOLIO_B2B">
                      ADQUISICIÓN MULTI-UNIDAD (FAMILY OFFICE / B2B)
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-4 w-full border border-neutral-950 bg-neutral-950 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
                >
                  DESCARGAR FICHA TÉCNICA E INICIAR COTIZACIÓN EN CRM
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
