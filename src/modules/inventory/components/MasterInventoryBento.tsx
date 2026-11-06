"use client";

import React, { useMemo, useState, useTransition } from "react";
import { formatAreaM2, formatCurrencyMXN } from "@/core/utils/currency";
import { OccupancyAnalytics } from "@/modules/crm/services/inventory-crm.service";
import {
  createQuotationAction,
  registerPurchaseIntentAction,
  reserveUnitAction,
} from "@/modules/inventory/actions/sales.actions";

export type SerializedUnitStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "BLOCKED"
  | "UNDER_CONTRACT"
  | "SOLD";

export interface InventoryUnitDTO {
  id: string;
  unitNumber: string;
  floorLevel: number;
  status: SerializedUnitStatus;
  basePrice: number;
  currentPrice: number;
  pricePerM2: number;
  currency: "MXN" | "USD";
  maintenanceFee: number;
  orientation: string;
  isCorner: boolean;
  phase: {
    id: string;
    name: string;
  };
  typology: {
    id: string;
    code: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    parkingSpots: number;
    interiorAreaM2: number;
    exteriorAreaM2: number;
    totalAreaM2: number;
  };
  activeDeals: Array<{
    id: string;
    stage: string;
    probability: number;
    leadName: string;
    leadId: string;
  }>;
}

export interface PaymentPlanDTO {
  id: string;
  name: string;
  downPaymentPct: number;
  deferredInstallmentsPct: number;
  monthsToDeliver: number;
  finalBalancePct: number;
  discountPct: number;
}

export interface CrmLeadDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  investmentGoal: string;
  budgetMax: number;
  activeDealId?: string;
}

interface MasterInventoryBentoProps {
  developmentName: string;
  developmentCode: string;
  locationLabel: string;
  initialAnalytics: OccupancyAnalytics;
  units: InventoryUnitDTO[];
  paymentPlans: PaymentPlanDTO[];
  crmLeads: CrmLeadDTO[];
}

const STATUS_META: Record<
  SerializedUnitStatus,
  { label: string; borderClass: string; bgClass: string; textClass: string }
> = {
  AVAILABLE: {
    label: "DISPONIBLE",
    borderClass: "border-neutral-900",
    bgClass: "bg-white",
    textClass: "text-neutral-950",
  },
  RESERVED: {
    label: "RESERVADA",
    borderClass: "border-neutral-900",
    bgClass: "bg-neutral-200",
    textClass: "text-neutral-950",
  },
  UNDER_CONTRACT: {
    label: "EN CONTRATO",
    borderClass: "border-neutral-900",
    bgClass: "bg-neutral-800",
    textClass: "text-white",
  },
  SOLD: {
    label: "VENDIDA",
    borderClass: "border-neutral-950",
    bgClass: "bg-neutral-950",
    textClass: "text-white",
  },
  BLOCKED: {
    label: "BLOQUEADA",
    borderClass: "border-neutral-400",
    bgClass: "bg-neutral-100",
    textClass: "text-neutral-500",
  },
};

export function MasterInventoryBento({
  developmentName,
  developmentCode,
  locationLabel,
  initialAnalytics,
  units,
  paymentPlans,
  crmLeads,
}: MasterInventoryBentoProps) {
  // Estados de filtrado paramétrico
  const [maxPriceM2Filter, setMaxPriceM2Filter] = useState<string>("");
  const [minPriceM2Filter, setMinPriceM2Filter] = useState<string>("");
  const [bedroomsFilter, setBedroomsFilter] = useState<number | "ALL">("ALL");
  const [floorFilter, setFloorFilter] = useState<number | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<SerializedUnitStatus | "ALL">("ALL");

  // Unidad activa seleccionada para Cotizador y Conexión CRM
  const [selectedUnitId, setSelectedUnitId] = useState<string>(units[0]?.id ?? "");
  const [selectedPlanId, setSelectedPlanId] = useState<string>(paymentPlans[0]?.id ?? "");
  const [customDiscountPct, setCustomDiscountPct] = useState<number>(0);

  // Estado de conexión al Pipeline CRM
  const [selectedLeadId, setSelectedLeadId] = useState<string>(crmLeads[0]?.id ?? "");
  const [reservationAmount, setReservationAmount] = useState<number>(100000);
  const [crmNotes, setCrmNotes] = useState<string>("");
  const [operationBanner, setOperationBanner] = useState<{
    type: "SUCCESS" | "ERROR";
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  // Pisos disponibles ordenados para el selector
  const availableFloors = useMemo(() => {
    const set = new Set<number>(units.map((u) => u.floorLevel));
    return Array.from(set).sort((a, b) => a - b);
  }, [units]);

  // Filtrado de unidades en tiempo real por Precio/m², Recámaras, Piso y Estatus
  const filteredUnits = useMemo(() => {
    const minPpm2 = minPriceM2Filter.trim() !== "" ? Number(minPriceM2Filter) : null;
    const maxPpm2 = maxPriceM2Filter.trim() !== "" ? Number(maxPriceM2Filter) : null;

    return units.filter((unit) => {
      if (statusFilter !== "ALL" && unit.status !== statusFilter) {
        return false;
      }
      if (bedroomsFilter !== "ALL") {
        if (bedroomsFilter === 3 && unit.typology.bedrooms < 3) return false;
        if (bedroomsFilter !== 3 && unit.typology.bedrooms !== bedroomsFilter) return false;
      }
      if (floorFilter !== "ALL" && unit.floorLevel !== floorFilter) {
        return false;
      }
      if (minPpm2 !== null && !Number.isNaN(minPpm2) && unit.pricePerM2 < minPpm2) {
        return false;
      }
      if (maxPpm2 !== null && !Number.isNaN(maxPpm2) && unit.pricePerM2 > maxPpm2) {
        return false;
      }
      return true;
    });
  }, [units, statusFilter, bedroomsFilter, floorFilter, minPriceM2Filter, maxPriceM2Filter]);

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) ?? filteredUnits[0] ?? units[0],
    [units, selectedUnitId, filteredUnits]
  );

  const selectedPlan = useMemo(
    () => paymentPlans.find((p) => p.id === selectedPlanId) ?? paymentPlans[0],
    [paymentPlans, selectedPlanId]
  );

  const selectedLead = useMemo(
    () => crmLeads.find((l) => l.id === selectedLeadId) ?? crmLeads[0],
    [crmLeads, selectedLeadId]
  );

  // Motor de cálculo de cotización en tiempo real (Enganche, Mensualidades, Liquidación)
  const quotationSimulation = useMemo(() => {
    if (!selectedUnit || !selectedPlan) return null;

    const effectiveDiscountPct =
      customDiscountPct > 0 ? customDiscountPct : selectedPlan.discountPct;
    const discountAmount = Number(
      ((selectedUnit.currentPrice * effectiveDiscountPct) / 100).toFixed(2)
    );
    const finalPrice = Number((selectedUnit.currentPrice - discountAmount).toFixed(2));

    const downPaymentAmount = Number(
      ((finalPrice * selectedPlan.downPaymentPct) / 100).toFixed(2)
    );
    const deferredTotalAmount = Number(
      ((finalPrice * selectedPlan.deferredInstallmentsPct) / 100).toFixed(2)
    );
    const months = Math.max(1, selectedPlan.monthsToDeliver);
    const monthlyInstallment =
      selectedPlan.deferredInstallmentsPct > 0
        ? Number((deferredTotalAmount / months).toFixed(2))
        : 0;
    const deliveryBalance = Number(
      (finalPrice - downPaymentAmount - deferredTotalAmount).toFixed(2)
    );

    return {
      listPrice: selectedUnit.currentPrice,
      effectiveDiscountPct,
      discountAmount,
      finalPrice,
      downPaymentPct: selectedPlan.downPaymentPct,
      downPaymentAmount,
      deferredInstallmentsPct: selectedPlan.deferredInstallmentsPct,
      deferredTotalAmount,
      monthsToDeliver: selectedPlan.deferredInstallmentsPct > 0 ? months : 0,
      monthlyInstallment,
      finalBalancePct: selectedPlan.finalBalancePct,
      deliveryBalance,
    };
  }, [selectedUnit, selectedPlan, customDiscountPct]);

  // Handlers de conexión con Server Actions (CRM + Cotización + Apartado)
  const handleRegisterPurchaseIntent = () => {
    if (!selectedUnit || !selectedLead) return;
    setOperationBanner(null);

    startTransition(async () => {
      const response = await registerPurchaseIntentAction({
        unitId: selectedUnit.id,
        leadId: selectedLead.id,
        paymentPlanId: selectedPlan?.id,
        initialStage: "NEGOTIATION",
        notes: crmNotes,
      });

      if (response.success) {
        setOperationBanner({
          type: "SUCCESS",
          message: `INTENCIÓN REGISTRADA EN PIPELINE: Unidad ${selectedUnit.unitNumber} vinculada a ${selectedLead.fullName} (Etapa: ${response.data.stage} · Probabilidad: ${response.data.probability}%).`,
        });
      } else {
        setOperationBanner({
          type: "ERROR",
          message: response.error,
        });
      }
    });
  };

  const handleEmitFormalQuotation = () => {
    if (!selectedUnit || !selectedPlan || !selectedLead) return;
    setOperationBanner(null);

    const dealId =
      selectedUnit.activeDeals[0]?.id ??
      selectedLead.activeDealId ??
      "d9b2d63d-a233-4123-847a-6630a8719001";

    startTransition(async () => {
      const response = await createQuotationAction({
        dealId,
        unitId: selectedUnit.id,
        paymentPlanId: selectedPlan.id,
        validityDays: 15,
        overrideDiscountPct: customDiscountPct > 0 ? customDiscountPct : undefined,
      });

      if (response.success) {
        setOperationBanner({
          type: "SUCCESS",
          message: `COTIZACIÓN EMITIDA [${response.data.folio}]: Precio neto ${formatCurrencyMXN(Number(response.data.finalPrice))} para ${selectedLead.fullName}.`,
        });
      } else {
        setOperationBanner({
          type: "ERROR",
          message: response.error,
        });
      }
    });
  };

  const handleReserveUnit = () => {
    if (!selectedUnit || !selectedLead) return;
    setOperationBanner(null);

    const dealId =
      selectedUnit.activeDeals[0]?.id ??
      selectedLead.activeDealId ??
      "d9b2d63d-a233-4123-847a-6630a8719001";

    startTransition(async () => {
      const response = await reserveUnitAction({
        dealId,
        unitId: selectedUnit.id,
        amount: reservationAmount,
        currency: "MXN",
        expirationHours: 48,
        notes: crmNotes,
      });

      if (response.success) {
        setOperationBanner({
          type: "SUCCESS",
          message: `APARTADO ATÓMICO APLICADO: Unidad ${selectedUnit.unitNumber} bloqueada por 48h (Folio: ${response.data.reservationId.slice(0, 8).toUpperCase()}).`,
        });
      } else {
        setOperationBanner({
          type: "ERROR",
          message: response.error,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* CABECERA EDITORIAL DEL INVENTARIO MAESTRO */}
      <section className="grid grid-cols-12 border border-neutral-900 bg-white">
        <div className="col-span-8 border-r border-neutral-900 p-6">
          <div className="flex items-center gap-3">
            <span className="border border-neutral-900 bg-neutral-950 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
              {developmentCode}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-500">
              {locationLabel}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-neutral-950">
            {developmentName} — MATRIZ DE INVENTARIO & COTIZACIÓN
          </h1>
          <p className="mt-1.5 max-w-3xl text-xs leading-relaxed text-neutral-600">
            Control paramétrico de unidades, listas de precios dinámicas por metro cuadrado,
            simulación de financiamiento fraccionado y vinculación directa con el pipeline de
            Leads del CRM.
          </p>
        </div>

        <div className="col-span-4 flex flex-col justify-between bg-neutral-50 p-6">
          <div className="flex items-baseline justify-between border-b border-neutral-300 pb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              VALOR TOTAL INVENTARIO
            </span>
            <span className="font-mono text-lg font-bold tabular-nums text-neutral-950">
              {formatCurrencyMXN(initialAnalytics.totalInventoryValueMxn)}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              VALOR ABSORBIDO (VENDIDO + APARTADO)
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-neutral-900">
              {formatCurrencyMXN(initialAnalytics.absorbedInventoryValueMxn)}
            </span>
          </div>
        </div>
      </section>

      {/* BENTO GRID FILA 1: BLOQUE ANALÍTICO DE OCUPACIÓN PORCENTUAL + CONSOLA DE FILTROS */}
      <section className="grid grid-cols-12 gap-6">
        {/* CELDA BENTO 01: OCUPACIÓN PORCENTUAL Y ABSORCIÓN COMERCIAL */}
        <div className="col-span-5 flex flex-col justify-between border border-neutral-900 bg-white p-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                01 // BLOQUE ANALÍTICO DE OCUPACIÓN COMERCIAL
              </span>
              <span className="border border-neutral-900 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-900">
                TIEMPO REAL
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="font-mono text-5xl font-bold tracking-tighter tabular-nums text-neutral-950">
                  {initialAnalytics.occupancyPct.toFixed(1)}%
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                  ÍNDICE DE ABSORCIÓN ({initialAnalytics.soldUnits + initialAnalytics.reservedUnits}{" "}
                  DE {initialAnalytics.totalUnits} UNIDADES)
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                  PRECIO PROMEDIO / M²
                </span>
                <div className="mt-1 font-mono text-xl font-bold tabular-nums text-neutral-950">
                  {formatCurrencyMXN(initialAnalytics.avgPricePerM2Mxn)}
                </div>
              </div>
            </div>

            {/* BARRA SEGMENTADA ORTOGONAL (SIN BORDES REDONDEADOS NI COLORES PASTEL) */}
            <div className="mt-4">
              <div className="flex h-4 w-full border border-neutral-900 bg-white">
                <div
                  style={{ width: `${initialAnalytics.soldPct}%` }}
                  className="h-full bg-neutral-950 transition-all"
                  title={`Vendidas: ${initialAnalytics.soldPct}%`}
                />
                <div
                  style={{ width: `${initialAnalytics.reservedPct}%` }}
                  className="h-full border-l border-neutral-900 bg-neutral-400 transition-all"
                  title={`Reservadas: ${initialAnalytics.reservedPct}%`}
                />
                <div
                  style={{ width: `${initialAnalytics.blockedPct}%` }}
                  className="h-full border-l border-neutral-900 bg-neutral-200 transition-all"
                  title={`Bloqueadas: ${initialAnalytics.blockedPct}%`}
                />
                <div
                  style={{ width: `${initialAnalytics.availablePct}%` }}
                  className="h-full bg-white transition-all"
                  title={`Disponibles: ${initialAnalytics.availablePct}%`}
                />
              </div>
            </div>
          </div>

          {/* DESGLOSE CUANTITATIVO ORTOGONAL POR ESTATUS */}
          <div className="mt-5 grid grid-cols-4 divide-x divide-neutral-900 border border-neutral-900 bg-neutral-50">
            <div className="p-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 border border-neutral-900 bg-white" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                  DISP.
                </span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-neutral-950">
                {initialAnalytics.availableUnits}
              </p>
              <p className="font-mono text-[10px] text-neutral-500">
                {initialAnalytics.availablePct}%
              </p>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 border border-neutral-900 bg-neutral-400" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                  RESERV.
                </span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-neutral-950">
                {initialAnalytics.reservedUnits}
              </p>
              <p className="font-mono text-[10px] text-neutral-500">
                {initialAnalytics.reservedPct}%
              </p>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 bg-neutral-950" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                  VEND.
                </span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-neutral-950">
                {initialAnalytics.soldUnits}
              </p>
              <p className="font-mono text-[10px] text-neutral-500">
                {initialAnalytics.soldPct}%
              </p>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 border border-neutral-500 bg-neutral-200" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-600">
                  BLOQ.
                </span>
              </div>
              <p className="mt-1 font-mono text-lg font-bold tabular-nums text-neutral-950">
                {initialAnalytics.blockedUnits}
              </p>
              <p className="font-mono text-[10px] text-neutral-500">
                {initialAnalytics.blockedPct}%
              </p>
            </div>
          </div>
        </div>

        {/* CELDA BENTO 02: FILTRADO PARAMÉTRICO (PRECIO/M2, RECÁMARAS, PISO, ESTATUS) */}
        <div className="col-span-7 flex flex-col justify-between border border-neutral-900 bg-white p-6">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                02 // PARÁMETROS DE FILTRADO TÉCNICO
              </span>
              <button
                type="button"
                onClick={() => {
                  setMinPriceM2Filter("");
                  setMaxPriceM2Filter("");
                  setBedroomsFilter("ALL");
                  setFloorFilter("ALL");
                  setStatusFilter("ALL");
                }}
                className="border border-neutral-900 bg-white px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-950 hover:text-white"
              >
                RESTABLECER MATRIZ
              </button>
            </div>

            <div className="mt-5 grid grid-cols-12 gap-4">
              {/* RANGO DE PRECIO POR M2 */}
              <div className="col-span-5">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                  RANGO PRECIO POR M² (MXN)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      value={minPriceM2Filter}
                      onChange={(e) => setMinPriceM2Filter(e.target.value)}
                      placeholder="MÍN. $85,000"
                      className="w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={maxPriceM2Filter}
                      onChange={(e) => setMaxPriceM2Filter(e.target.value)}
                      placeholder="MÁX. $135,000"
                      className="w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SELECTOR DE RECÁMARAS */}
              <div className="col-span-4">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                  CONFIGURACIÓN RECÁMARAS
                </label>
                <div className="mt-2 grid grid-cols-4 border border-neutral-900">
                  {(
                    [
                      { value: "ALL", label: "TODAS" },
                      { value: 1, label: "1 REC" },
                      { value: 2, label: "2 REC" },
                      { value: 3, label: "3+ REC" },
                    ] as const
                  ).map((option) => {
                    const active = bedroomsFilter === option.value;
                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => setBedroomsFilter(option.value)}
                        className={`border-r border-neutral-900 py-2 font-mono text-[11px] font-semibold uppercase last:border-r-0 ${
                          active
                            ? "bg-neutral-950 text-white"
                            : "bg-white text-neutral-800 hover:bg-neutral-100"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SELECTOR DE PISO / NIVEL */}
              <div className="col-span-3">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                  NIVEL / PISO
                </label>
                <select
                  value={floorFilter === "ALL" ? "ALL" : String(floorFilter)}
                  onChange={(e) =>
                    setFloorFilter(
                      e.target.value === "ALL" ? "ALL" : Number(e.target.value)
                    )
                  }
                  className="mt-2 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
                >
                  <option value="ALL">TODOS LOS NIVELES</option>
                  {availableFloors.map((floor) => (
                    <option key={floor} value={floor}>
                      NIVEL {floor.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* FILTRO DE ESTATUS Y CONTADOR DE RESULTADOS */}
          <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                ESTATUS:
              </span>
              {(
                [
                  { id: "ALL", label: "TODOS" },
                  { id: "AVAILABLE", label: "DISPONIBLES" },
                  { id: "RESERVED", label: "RESERVADAS" },
                  { id: "SOLD", label: "VENDIDAS" },
                  { id: "BLOCKED", label: "BLOQUEADAS" },
                ] as const
              ).map((st) => {
                const isSelected = statusFilter === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    className={`border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-900"
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-xs font-semibold text-neutral-950">
              MOSTRANDO {filteredUnits.length} DE {units.length} UNIDADES
            </div>
          </div>
        </div>
      </section>

      {/* BANNER DE AUDITORÍA DE OPERACIÓN EN TIEMPO REAL */}
      {operationBanner && (
        <div
          className={`flex items-center justify-between border border-neutral-900 px-5 py-3 font-mono text-xs ${
            operationBanner.type === "SUCCESS"
              ? "bg-neutral-950 text-white"
              : "bg-neutral-200 text-neutral-950"
          }`}
        >
          <span>{operationBanner.message}</span>
          <button
            type="button"
            onClick={() => setOperationBanner(null)}
            className="border border-current px-2 py-0.5 text-[10px] uppercase tracking-widest"
          >
            CERRAR
          </button>
        </div>
      )}

      {/* BENTO GRID FILA 2: MATRIZ DE INVENTARIO (8 COL) + COTIZADOR Y CRM PIPELINE (4 COL) */}
      <section className="grid grid-cols-12 gap-6">
        {/* CELDA BENTO 03: MATRIZ MAESTRA DE UNIDADES */}
        <div className="col-span-8 border border-neutral-900 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-900 px-6 py-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
              03 // MATRIZ COMERCIAL DE UNIDADES INDIVIDUALES
            </span>
            <span className="font-mono text-[11px] text-neutral-600">
              SELECCIONA UNA UNIDAD PARA COTIZAR O VINCULAR A UN LEAD
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-900 bg-neutral-100 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-600">
                  <th className="border-r border-neutral-300 px-4 py-3">UNIDAD / FASE</th>
                  <th className="border-r border-neutral-300 px-3 py-3">NIVEL</th>
                  <th className="border-r border-neutral-300 px-4 py-3">TIPOLOGÍA</th>
                  <th className="border-r border-neutral-300 px-3 py-3 text-right">
                    SUPERFICIE
                  </th>
                  <th className="border-r border-neutral-300 px-4 py-3 text-right">
                    PRECIO / M²
                  </th>
                  <th className="border-r border-neutral-300 px-4 py-3 text-right">
                    PRECIO LISTA (MXN)
                  </th>
                  <th className="border-r border-neutral-300 px-3 py-3">ESTATUS</th>
                  <th className="px-4 py-3">PIPELINE CRM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono text-xs">
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center font-mono text-xs uppercase tracking-widest text-neutral-500"
                    >
                      NINGUNA UNIDAD COINCIDE CON LOS PARÁMETROS DE FILTRADO SELECCIONADOS.
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map((unit) => {
                    const isSelected = selectedUnit?.id === unit.id;
                    const statusStyle = STATUS_META[unit.status];

                    return (
                      <tr
                        key={unit.id}
                        onClick={() => setSelectedUnitId(unit.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-neutral-900 text-white"
                            : "bg-white text-neutral-900 hover:bg-neutral-50"
                        }`}
                      >
                        <td className="border-r border-neutral-200 px-4 py-3.5">
                          <div className="font-bold tracking-tight">
                            U-{unit.unitNumber}
                          </div>
                          <div
                            className={`text-[10px] uppercase ${
                              isSelected ? "text-neutral-300" : "text-neutral-500"
                            }`}
                          >
                            {unit.phase.name}
                          </div>
                        </td>

                        <td className="border-r border-neutral-200 px-3 py-3.5 tabular-nums">
                          PISO {unit.floorLevel.toString().padStart(2, "0")}
                        </td>

                        <td className="border-r border-neutral-200 px-4 py-3.5">
                          <div className="font-semibold">{unit.typology.code}</div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? "text-neutral-300" : "text-neutral-500"
                            }`}
                          >
                            {unit.typology.bedrooms} REC · {unit.typology.bathrooms} BAÑOS
                          </div>
                        </td>

                        <td className="border-r border-neutral-200 px-3 py-3.5 text-right tabular-nums">
                          <div>{formatAreaM2(unit.typology.totalAreaM2)}</div>
                          <div
                            className={`text-[10px] ${
                              isSelected ? "text-neutral-300" : "text-neutral-500"
                            }`}
                          >
                            INT {unit.typology.interiorAreaM2}m² · EXT{" "}
                            {unit.typology.exteriorAreaM2}m²
                          </div>
                        </td>

                        <td className="border-r border-neutral-200 px-4 py-3.5 text-right font-semibold tabular-nums">
                          {formatCurrencyMXN(unit.pricePerM2)}
                        </td>

                        <td className="border-r border-neutral-200 px-4 py-3.5 text-right font-bold tabular-nums">
                          {formatCurrencyMXN(unit.currentPrice)}
                        </td>

                        <td className="border-r border-neutral-200 px-3 py-3.5">
                          <span
                            className={`inline-block border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle.borderClass} ${statusStyle.bgClass} ${statusStyle.textClass}`}
                          >
                            {statusStyle.label}
                          </span>
                        </td>

                        <td className="px-4 py-3.5">
                          {unit.activeDeals.length > 0 ? (
                            <div>
                              <div className="text-[11px] font-semibold">
                                {unit.activeDeals[0].leadName}
                              </div>
                              <div
                                className={`text-[10px] uppercase ${
                                  isSelected ? "text-neutral-300" : "text-neutral-500"
                                }`}
                              >
                                {unit.activeDeals[0].stage} ({unit.activeDeals[0].probability}
                                %)
                              </div>
                            </div>
                          ) : (
                            <span
                              className={`text-[10px] uppercase tracking-wider ${
                                isSelected ? "text-neutral-400" : "text-neutral-400"
                              }`}
                            >
                              SIN LEAD ASIGNADO
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* CELDA BENTO 04: MOTOR DE COTIZACIÓN FINANCIERA + VINCULACIÓN CRM PIPELINE */}
        <div className="col-span-4 flex flex-col justify-between border border-neutral-900 bg-white">
          {selectedUnit && quotationSimulation ? (
            <div>
              {/* CABECERA DE LA UNIDAD ACTIVA */}
              <div className="border-b border-neutral-900 bg-neutral-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    04 // COTIZADOR & PIPELINE CRM
                  </span>
                  <span className="border border-white px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest">
                    {STATUS_META[selectedUnit.status].label}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <h2 className="font-mono text-2xl font-bold tracking-tight">
                      UNIDAD {selectedUnit.unitNumber}
                    </h2>
                    <p className="font-mono text-[11px] text-neutral-300">
                      {selectedUnit.phase.name} · PISO {selectedUnit.floorLevel} ·{" "}
                      {selectedUnit.typology.code} (
                      {formatAreaM2(selectedUnit.typology.totalAreaM2)})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] uppercase text-neutral-400">
                      PRECIO DE LISTA
                    </span>
                    <div className="font-mono text-lg font-bold tabular-nums">
                      {formatCurrencyMXN(selectedUnit.currentPrice)}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN A: ESQUEMA DE FINANCIAMIENTO (ENGANCHE / MENSUALIDADES / ENTREGA) */}
              <div className="border-b border-neutral-900 p-5">
                <label className="block font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                  ESQUEMA DE PAGO AUTORIZADO
                </label>
                <select
                  value={selectedPlan?.id ?? ""}
                  onChange={(e) => setSelectedPlanId(e.target.value)}
                  className="mt-2 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
                >
                  {paymentPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} (DESC. BASE {plan.discountPct}%)
                    </option>
                  ))}
                </select>

                <div className="mt-3 flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                    DESCUENTO COMERCIAL DISCRECIONAL (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    step={0.5}
                    value={customDiscountPct}
                    onChange={(e) =>
                      setCustomDiscountPct(
                        Math.min(15, Math.max(0, Number(e.target.value) || 0))
                      )
                    }
                    className="w-24 border border-neutral-900 bg-neutral-50 px-2.5 py-1 text-right font-mono text-xs font-semibold tabular-nums text-neutral-950"
                  />
                </div>

                {/* TABLA TÉCNICA DE DESGLOSE FINANCIERO */}
                <div className="mt-4 divide-y divide-neutral-200 border border-neutral-900 bg-neutral-50 font-mono text-xs">
                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <span className="text-[11px] text-neutral-600">
                      DESCUENTO ({quotationSimulation.effectiveDiscountPct}%)
                    </span>
                    <span className="font-semibold tabular-nums text-neutral-900">
                      - {formatCurrencyMXN(quotationSimulation.discountAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white px-3.5 py-2.5 font-bold">
                    <span className="text-[11px] uppercase text-neutral-950">
                      PRECIO FINAL NETO
                    </span>
                    <span className="text-sm tabular-nums text-neutral-950">
                      {formatCurrencyMXN(quotationSimulation.finalPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <div>
                      <div className="text-[11px] font-semibold text-neutral-900">
                        1. ENGANCHE ({quotationSimulation.downPaymentPct}%)
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        FIRMA DE CONTRATO DE PROMESA
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-neutral-950">
                      {formatCurrencyMXN(quotationSimulation.downPaymentAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <div>
                      <div className="text-[11px] font-semibold text-neutral-900">
                        2. OBRA ({quotationSimulation.deferredInstallmentsPct}%)
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {quotationSimulation.monthsToDeliver > 0
                          ? `${quotationSimulation.monthsToDeliver} MENSUALIDADES DE ${formatCurrencyMXN(quotationSimulation.monthlyInstallment)}`
                          : "SIN PAGOS DIFERIDOS EN OBRA"}
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-neutral-950">
                      {formatCurrencyMXN(quotationSimulation.deferredTotalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3.5 py-2.5">
                    <div>
                      <div className="text-[11px] font-semibold text-neutral-900">
                        3. LIQUIDACIÓN ({quotationSimulation.finalBalancePct}%)
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        CONTRA ENTREGA / ESCRITURACIÓN
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-neutral-950">
                      {formatCurrencyMXN(quotationSimulation.deliveryBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECCIÓN B: CONEXIÓN AL PIPELINE DE LEADS DEL CRM */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-700">
                    VINCULAR A LEAD ACTIVO EN CRM
                  </label>
                  <span className="font-mono text-[10px] text-neutral-500">
                    PIPELINE COMERCIAL
                  </span>
                </div>

                <select
                  value={selectedLead?.id ?? ""}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="mt-2 w-full border border-neutral-900 bg-neutral-50 px-3 py-2 font-mono text-xs font-semibold text-neutral-950 focus:bg-white focus:outline-none"
                >
                  {crmLeads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.fullName} — {lead.investmentGoal} (MÁX{" "}
                      {formatCurrencyMXN(lead.budgetMax)})
                    </option>
                  ))}
                </select>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                      MONTO APARTADO (MXN)
                    </label>
                    <input
                      type="number"
                      step={10000}
                      value={reservationAmount}
                      onChange={(e) => setReservationAmount(Number(e.target.value) || 0)}
                      className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-2.5 py-1.5 font-mono text-xs font-semibold tabular-nums text-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                      VIGENCIA BLOQUEO SPEI
                    </label>
                    <div className="mt-1 border border-neutral-300 bg-neutral-100 px-2.5 py-1.5 font-mono text-xs font-semibold text-neutral-800">
                      48 HORAS HÁBILES
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-neutral-600">
                    NOTA COMERCIAL / CONDICIONES ESPECIALES
                  </label>
                  <input
                    type="text"
                    value={crmNotes}
                    onChange={(e) => setCrmNotes(e.target.value)}
                    placeholder="Ej. Inversionista solicita corrida con entrega Q4..."
                    className="mt-1 w-full border border-neutral-900 bg-neutral-50 px-3 py-1.5 font-mono text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:outline-none"
                  />
                </div>

                {/* BOTONERA DE ACCIONES TRANSACCIONALES */}
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleRegisterPurchaseIntent}
                    className="w-full border border-neutral-900 bg-white px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-neutral-950 transition-colors hover:bg-neutral-100 disabled:opacity-50"
                  >
                    1. REGISTRAR INTENCIÓN DE COMPRA EN CRM
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleEmitFormalQuotation}
                    className="w-full border border-neutral-900 bg-neutral-800 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-950 disabled:opacity-50"
                  >
                    2. EMITIR FOLIO DE COTIZACIÓN FORMAL
                  </button>

                  <button
                    type="button"
                    disabled={isPending || selectedUnit.status !== "AVAILABLE"}
                    onClick={handleReserveUnit}
                    className="w-full border border-neutral-950 bg-neutral-950 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-600"
                  >
                    {selectedUnit.status === "AVAILABLE"
                      ? "3. APARTAR UNIDAD Y BLOQUEAR INVENTARIO"
                      : `UNIDAD NO DISPONIBLE (${STATUS_META[selectedUnit.status].label})`}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
