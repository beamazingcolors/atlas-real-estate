import React, { useMemo, useState } from "react";
import {
  AureaProperty,
  CrmProspect,
  CurrencyCode,
  DeliveryStatus,
  SovereignZone,
  VipAppointment,
} from "../types";
import { formatSovereignCurrency } from "../storage/useAureaStorage";

interface ExecutiveDashboardProps {
  properties: AureaProperty[];
  prospects: CrmProspect[];
  appointments: VipAppointment[];
  favorites: string[];
  currency: CurrencyCode;
  onToggleFavorite: (id: string) => void;
  onOpenPhotoModal: (property: AureaProperty) => void;
  onOpenDossierModal: (property: AureaProperty) => void;
  onAddAppointment: (appt: VipAppointment) => void;
  onNavigateSection: (section: "inventory" | "crm" | "comparator") => void;
}

const ZONES_LIST: SovereignZone[] = [
  "Puerto Cancún",
  "Cancún Zona Hotelera",
  "Isla Pok Ta Pok",
  "Riviera Maya",
  "Playa del Carmen",
];

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardProps> = ({
  properties,
  prospects,
  appointments,
  favorites,
  currency,
  onToggleFavorite,
  onOpenPhotoModal,
  onOpenDossierModal,
  onAddAppointment,
  onNavigateSection,
}) => {
  const [subView, setSubView] = useState<"COMMAND" | "CARTOGRAPHY">("COMMAND");
  const [selectedMapZone, setSelectedMapZone] = useState<SovereignZone | "ALL">("ALL");
  const [selectedMapProp, setSelectedMapProp] = useState<AureaProperty>(
    properties[0]
  );
  const [intelligenceDeckToast, setIntelligenceDeckToast] = useState<string | null>(
    null
  );

  const flagshipProperties = useMemo(
    () => properties.filter((p) => p.isFlagship),
    [properties]
  );

  // Mini-Kanban de 4 etapas ejecutivas
  const miniKanbanColumns = useMemo(
    () => [
      {
        title: "Prospecto Calificado",
        badge: "ETAPA 01",
        items: prospects.filter(
          (p) =>
            p.stage === "CONTACTO_INICIAL" || p.stage === "CALIFICACION_PATRIMONIAL"
        ),
      },
      {
        title: "Due Diligence",
        badge: "ETAPA 02",
        items: prospects.filter((p) => p.stage === "ENVIO_PORTAFOLIO"),
      },
      {
        title: "Visita Privada",
        badge: "ETAPA 03",
        items: prospects.filter(
          (p) =>
            p.stage === "RECORRIDO_PRESENCIAL" || p.stage === "NEGOCIACION_OFERTA"
        ),
      },
      {
        title: "Cierre Notarial",
        badge: "ETAPA 04",
        items: prospects.filter((p) => p.stage === "FIRMA_NOTARIAL"),
      },
    ],
    [prospects]
  );

  const handleGenerateExpressDeck = () => {
    const timestamp = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setIntelligenceDeckToast(
      `Dossier Patrimonial Proyecto Atlas Intelligence compilado (${timestamp}) con ${flagshipProperties.length} activos insignia en divisa ${currency}. Abriendo vista de presentación...`
    );
    setTimeout(() => {
      if (flagshipProperties[0]) {
        onOpenDossierModal(flagshipProperties[0]);
      }
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Selector Superior: Mando Ejecutivo vs Cartografía & Preventas Cancún */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-[#eaedf0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div>
          <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0077cc]">
            PROYECTO ATLAS · REAL ESTATE PLATFORM
          </span>
          <h1 className="font-outfit text-2xl font-bold tracking-tight text-black">
            {subView === "COMMAND"
              ? "Centro de Mando Ejecutivo — Proyecto Atlas"
              : "Cartografía Soberana & Matriz de Preventas Cancún"}
          </h1>
        </div>

        <div className="flex border border-[#1c1b1a] bg-[#f8f9fa] p-0.5">
          <button
            type="button"
            onClick={() => setSubView("COMMAND")}
            className={`px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider transition-all ${
              subView === "COMMAND"
                ? "bg-[#000000] text-[#faeedd]"
                : "text-[#1c1b1a] hover:bg-white"
            }`}
          >
            ◈ Mando Ejecutivo
          </button>
          <button
            type="button"
            onClick={() => setSubView("CARTOGRAPHY")}
            className={`px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider transition-all ${
              subView === "CARTOGRAPHY"
                ? "bg-[#000000] text-[#faeedd]"
                : "text-[#1c1b1a] hover:bg-white"
            }`}
          >
            ⌖ Cartografía & Preventas Cancún
          </button>
        </div>
      </div>

      {intelligenceDeckToast && (
        <div className="flex items-center justify-between border border-[#755a34] bg-[#1c1b1a] px-6 py-3.5 text-xs text-[#faeedd]">
          <span className="font-outfit tracking-wide">✦ {intelligenceDeckToast}</span>
          <button
            type="button"
            onClick={() => setIntelligenceDeckToast(null)}
            className="border border-[#faeedd]/30 px-2.5 py-0.5 font-outfit text-[10px] uppercase"
          >
            Cerrar
          </button>
        </div>
      )}

      {subView === "COMMAND" ? (
        <>
          {/* 4 KPIs Ejecutivos */}
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Volumen en Cartera Gestionada
                </span>
                <span className="bg-[#faeedd] px-2 py-0.5 font-outfit text-[10px] font-bold text-[#755a34]">
                  AUM ACTIVO
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-black">
                {formatSovereignCurrency(48500000, currency, true)}
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                +18.4% vs. trimestre anterior · Mandatos exclusivos
              </p>
            </div>

            <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Comisiones Proyectadas (5%)
                </span>
                <span className="bg-[#004044]/10 px-2 py-0.5 font-outfit text-[10px] font-bold text-[#004044]">
                  FEE NETO
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-[#755a34]">
                {formatSovereignCurrency(2420000, currency, true)}
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                Sobre cierres en Due Diligence y Firma Notarial
              </p>
            </div>

            <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Preventas Activas Oficiales
                </span>
                <span className="border border-[#1c1b1a]/20 px-2 py-0.5 font-outfit text-[10px] font-bold text-[#1c1b1a]">
                  DRIVE AUDITADO
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-black">
                14 Desarrollos
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                Puerto Cancún · Zona Hotelera · Pok Ta Pok · Riviera Maya
              </p>
            </div>

            <div className="border border-[#1c1b1a] bg-[#1c1b1a] p-6 text-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-[#faeedd]/80">
                  Conversión a Visitas Privadas
                </span>
                <span className="border border-[#755a34] bg-[#755a34]/20 px-2 py-0.5 font-outfit text-[10px] font-bold text-[#faeedd]">
                  VIP PROTOCOL
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-white">
                32.4%
              </div>
              <p className="mt-1.5 text-xs text-neutral-400">
                Calificación patrimonial previa y traslado privado
              </p>
            </div>
          </section>

          {/* Propiedades Insignia en Cartera */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
                  TROPHY ASSETS PORTFOLIO
                </span>
                <h2 className="font-outfit text-xl font-bold text-black">
                  Propiedades Insignia en Cartera Soberana
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateSection("inventory")}
                className="border border-[#1c1b1a] bg-white px-4 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#000000] hover:text-white"
              >
                Explorar Inventario Completo ({properties.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {flagshipProperties.map((prop) => {
                const imgUrl = prop.customImageUrl ?? prop.defaultImageUrl;
                const isFav = favorites.includes(prop.id);

                return (
                  <div
                    key={prop.id}
                    className="group flex flex-col justify-between border border-[#eaedf0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all hover:border-[#755a34]"
                  >
                    <div>
                      {/* Fotografía con controles flotantes */}
                      <div className="relative h-64 w-full overflow-hidden bg-[#1c1b1a]">
                        <img
                          src={imgUrl}
                          alt={prop.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="bg-[#000000] px-3 py-1 font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-[#faeedd]">
                            {prop.zone}
                          </span>
                          <span className="bg-[#004044] px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white">
                            ROI {prop.roiAnnualPct}% ANUAL
                          </span>
                        </div>

                        <div className="absolute right-4 top-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenPhotoModal(prop)}
                            className="border border-white/40 bg-black/80 px-3 py-1.5 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#faeedd] backdrop-blur-sm transition-colors hover:bg-[#755a34] hover:text-white"
                          >
                            📷 Cambiar Foto
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleFavorite(prop.id)}
                            aria-label="Favorito"
                            className={`flex h-8 w-8 items-center justify-center border backdrop-blur-sm transition-colors ${
                              isFav
                                ? "border-[#755a34] bg-[#755a34] text-white"
                                : "border-white/40 bg-black/70 text-white hover:bg-white hover:text-black"
                            }`}
                          >
                            {isFav ? "★" : "☆"}
                          </button>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                          <div>
                            <span className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#faeedd]">
                              {prop.code} · {prop.deliveryStatus}
                            </span>
                            <h3 className="font-outfit text-2xl font-bold">
                              {prop.name}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="font-outfit text-xl font-bold text-[#faeedd]">
                              {formatSovereignCurrency(prop.priceUsd, currency)}
                            </div>
                            <span className="font-outfit text-[11px] text-neutral-300">
                              {prop.areaM2} m² · {prop.bedrooms} Rec · Comisión{" "}
                              {prop.brokerCommissionPct}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-medium text-[#1c1b1a]">
                          {prop.subtitle}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                          {prop.architecturalDigest}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {prop.amenities.slice(0, 4).map((amenity) => (
                            <span
                              key={amenity}
                              className="border border-[#eaedf0] bg-[#f8f9fa] px-2.5 py-1 font-outfit text-[10px] font-medium text-neutral-700"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Botonera de 4 acciones directas */}
                    <div className="grid grid-cols-2 gap-2 border-t border-[#eaedf0] bg-[#f8f9fa] p-4 sm:grid-cols-4">
                      <button
                        type="button"
                        onClick={() => onOpenDossierModal(prop)}
                        className="border border-[#1c1b1a] bg-white px-3 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-black hover:bg-[#000000] hover:text-white"
                      >
                        Ficha Técnica
                      </button>
                      <a
                        href={prop.driveFolderUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center border border-[#eaedf0] bg-white px-3 py-2 text-center font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#1c1b1a] hover:border-[#755a34]"
                      >
                        Google Drive
                      </a>
                      <button
                        type="button"
                        onClick={() => onOpenDossierModal(prop)}
                        className="border border-[#755a34] bg-[#faeedd]/60 px-3 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#755a34] hover:bg-[#755a34] hover:text-white"
                      >
                        Dossier PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onAddAppointment({
                            id: `vip-${Date.now()}`,
                            clientName: "Cliente Patrimonial VIP",
                            clientTier: "Family Office",
                            propertyName: prop.name,
                            dateLabel: "Mañana",
                            timeLabel: "12:00 HRS",
                            transportMode: "Chófer Ejecutivo",
                            status: "Confirmada",
                          });
                        }}
                        className="bg-[#000000] px-3 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#004044]"
                      >
                        Agendar Visita
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Fila Inferior: Embudo Comercial Activo (Mini-Kanban 4 etapas) + Agenda VIP & AUREA Intelligence */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            {/* Mini-Kanban de 4 Etapas */}
            <div className="xl:col-span-8 border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between border-b border-[#eaedf0] pb-4">
                <div>
                  <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                    ACTIVE DEAL FLOW
                  </span>
                  <h3 className="font-outfit text-lg font-bold text-black">
                    Embudo Comercial Activo (Mini-Kanban)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigateSection("crm")}
                  className="font-outfit text-xs font-semibold uppercase tracking-wider text-[#755a34] hover:underline"
                >
                  Abrir Pipeline de 6 Fases →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {miniKanbanColumns.map((col) => (
                  <div
                    key={col.title}
                    className="flex flex-col border border-[#eaedf0] bg-[#f8f9fa] p-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#eaedf0] pb-2">
                      <span className="font-outfit text-[10px] font-bold uppercase tracking-wider text-[#755a34]">
                        {col.badge}
                      </span>
                      <span className="bg-[#000000] px-2 py-0.5 font-outfit text-[10px] font-bold text-white">
                        {col.items.length}
                      </span>
                    </div>
                    <div className="mt-1.5 font-outfit text-xs font-bold text-black">
                      {col.title}
                    </div>

                    <div className="mt-3 space-y-2.5">
                      {col.items.map((item) => (
                        <div
                          key={item.id}
                          className="border border-[#eaedf0] bg-white p-3 shadow-xs"
                        >
                          <div className="font-outfit text-xs font-semibold text-black">
                            {item.fullName}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            {item.interestedPropertyName}
                          </div>
                          <div className="mt-2 font-outfit text-xs font-bold text-[#004044]">
                            {formatSovereignCurrency(item.budgetUsd, currency, true)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Próximas Citas VIP + Herramienta AUREA Intelligence */}
            <div className="xl:col-span-4 flex flex-col justify-between space-y-6">
              <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-[#eaedf0] pb-3">
                  <div>
                    <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                      CONCIERGE PROTOCOL
                    </span>
                    <h3 className="font-outfit text-base font-bold text-black">
                      Próximas Citas & Agenda VIP
                    </h3>
                  </div>
                  <span className="bg-[#faeedd] px-2.5 py-1 font-outfit text-[10px] font-bold text-[#755a34]">
                    {appointments.length} ACTIVAS
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-center justify-between border border-[#eaedf0] bg-[#f8f9fa] p-3"
                    >
                      <div>
                        <div className="font-outfit text-xs font-bold text-black">
                          {appt.clientName}
                        </div>
                        <div className="text-[11px] text-neutral-600">
                          {appt.propertyName} · {appt.transportMode}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-outfit text-xs font-semibold text-[#755a34]">
                          {appt.dateLabel}
                        </div>
                        <div className="font-outfit text-[10px] text-neutral-500">
                          {appt.timeLabel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proyecto Atlas Intelligence */}
              <div className="border border-[#0077cc]/40 bg-[#091e3a] p-6 text-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00c2ff]">
                  PROYECTO ATLAS INTELLIGENCE ENGINE
                </span>
                <h3 className="mt-1 font-outfit text-lg font-bold text-white">
                  Generador Express de Presentaciones Patrimoniales
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                  Compila en un clic un pitchbook institucional con proyecciones de Cap
                  Rate, plusvalía a 5 años y estructura fiduciaria en la divisa activa (
                  {currency}).
                </p>
                <button
                  type="button"
                  onClick={handleGenerateExpressDeck}
                  className="mt-4 w-full bg-[#755a34] px-4 py-3 font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#faeedd] hover:text-black"
                >
                  ✦ Generar Presentación Patrimonial (1-Clic)
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* SUB-VISTA: CARTOGRAFÍA & PREVENTAS CANCÚN */
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 border border-[#eaedf0] bg-[#1c1b1a] p-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#faeedd]">
                  SOVEREIGN GEOSPATIAL MATRIX
                </span>
                <h3 className="font-outfit text-lg font-bold">
                  Corredor Cancún — Puerto Cancún — Riviera Maya
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedMapZone("ALL")}
                  className={`px-2.5 py-1 font-outfit text-[10px] uppercase ${
                    selectedMapZone === "ALL"
                      ? "bg-[#755a34] text-white"
                      : "bg-white/10 text-neutral-300"
                  }`}
                >
                  Todas
                </button>
                {ZONES_LIST.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setSelectedMapZone(z)}
                    className={`px-2.5 py-1 font-outfit text-[10px] uppercase ${
                      selectedMapZone === z
                        ? "bg-[#755a34] text-white"
                        : "bg-white/10 text-neutral-300"
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Lienzo Cartográfico Interactivo */}
            <div className="relative mt-4 h-[420px] w-full overflow-hidden border border-white/15 bg-[#0a191e]">
              {/* Retícula Cartográfica SVG */}
              <svg
                viewBox="0 0 800 450"
                className="h-full w-full opacity-40"
                preserveAspectRatio="none"
              >
                <defs>
                  <pattern
                    id="sovereign-grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#004044"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="800" height="450" fill="url(#sovereign-grid)" />
                {/* Contorno estilizado de la costa del Caribe Mexicano e Isla Cancún */}
                <path
                  d="M 120 420 Q 260 350 380 260 T 520 110 L 660 150 L 630 220 L 540 210 Z"
                  fill="#1c1b1a"
                  stroke="#755a34"
                  strokeWidth="2"
                />
              </svg>

              <div className="absolute left-4 top-4 bg-black/80 px-3 py-1.5 font-outfit text-[10px] uppercase tracking-widest text-[#faeedd]">
                MAR CARIBE · ZONA FEDERAL MARÍTIMO TERRESTRE
              </div>

              {/* Marcadores interactivos de desarrollos */}
              {properties
                .filter(
                  (p) => selectedMapZone === "ALL" || p.zone === selectedMapZone
                )
                .map((prop) => {
                  const isCurrent = selectedMapProp.id === prop.id;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      style={{
                        left: `${prop.coordinates.mapX}%`,
                        top: `${prop.coordinates.mapY}%`,
                      }}
                      onClick={() => setSelectedMapProp(prop)}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 border px-3 py-1.5 font-outfit text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? "z-20 scale-110 border-[#faeedd] bg-[#755a34] text-white shadow-lg"
                          : "z-10 border-[#755a34] bg-black/90 text-[#faeedd] hover:scale-105"
                      }`}
                    >
                      ◈ {prop.name} ({prop.roiAnnualPct}% ROI)
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Ficha Cartográfica Seleccionada */}
          <div className="lg:col-span-5 border border-[#eaedf0] bg-white p-6">
            <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
              ACTIVO SELECCIONADO EN CARTOGRAFÍA
            </span>
            <h3 className="mt-1 font-outfit text-2xl font-bold text-black">
              {selectedMapProp.name}
            </h3>
            <p className="font-outfit text-xs text-neutral-500">
              {selectedMapProp.zone} · Lat {selectedMapProp.coordinates.lat}° N, Lng{" "}
              {selectedMapProp.coordinates.lng}° W
            </p>

            <div className="mt-4 h-48 w-full overflow-hidden border border-[#eaedf0]">
              <img
                src={selectedMapProp.customImageUrl ?? selectedMapProp.defaultImageUrl}
                alt={selectedMapProp.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border border-[#eaedf0] bg-[#f8f9fa] p-4 font-outfit">
              <div>
                <span className="text-[10px] uppercase text-neutral-500">
                  Precio de Lista
                </span>
                <div className="text-lg font-bold text-black">
                  {formatSovereignCurrency(selectedMapProp.priceUsd, currency)}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500">
                  Retorno Proyectado
                </span>
                <div className="text-lg font-bold text-[#004044]">
                  {selectedMapProp.roiAnnualPct}% Anual
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => onOpenDossierModal(selectedMapProp)}
                className="flex-1 bg-[#000000] py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#755a34]"
              >
                Abrir Dossier Completo
              </button>
              <button
                type="button"
                onClick={() => onOpenPhotoModal(selectedMapProp)}
                className="border border-[#1c1b1a] px-4 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#f2f4f6]"
              >
                Cambiar Foto
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

interface MasterInventoryViewProps {
  properties: AureaProperty[];
  favorites: string[];
  comparedIds: string[];
  currency: CurrencyCode;
  onlyFavoritesMode?: boolean;
  searchQuery: string;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenPhotoModal: (property: AureaProperty) => void;
  onOpenDossierModal: (property: AureaProperty) => void;
}

export const MasterInventoryView: React.FC<MasterInventoryViewProps> = ({
  properties,
  favorites,
  comparedIds,
  currency,
  onlyFavoritesMode = false,
  searchQuery,
  onToggleFavorite,
  onToggleCompare,
  onOpenPhotoModal,
  onOpenDossierModal,
}) => {
  const [zoneFilter, setZoneFilter] = useState<SovereignZone | "ALL">("ALL");
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(10000000);
  const [minRoiPct, setMinRoiPct] = useState<number>(0);
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryStatus | "ALL">("ALL");

  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (onlyFavoritesMode && !favorites.includes(prop.id)) return false;
      if (zoneFilter !== "ALL" && prop.zone !== zoneFilter) return false;
      if (prop.priceUsd > maxPriceUsd) return false;
      if (prop.roiAnnualPct < minRoiPct) return false;
      if (deliveryFilter !== "ALL" && prop.deliveryStatus !== deliveryFilter) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matches =
          prop.name.toLowerCase().includes(q) ||
          prop.zone.toLowerCase().includes(q) ||
          prop.code.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [
    properties,
    onlyFavoritesMode,
    favorites,
    zoneFilter,
    maxPriceUsd,
    minRoiPct,
    deliveryFilter,
    searchQuery,
  ]);

  return (
    <div className="space-y-6">
      {/* Consola de Filtrado del Inventario Maestro */}
      <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaedf0] pb-4">
          <div>
            <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
              {onlyFavoritesMode
                ? "CURATED FAVORITES VAULT"
                : "SOVEREIGN MASTER INVENTORY"}
            </span>
            <h1 className="font-outfit text-2xl font-bold text-black">
              {onlyFavoritesMode
                ? "Bóveda de Propiedades Favoritas"
                : "Inventario Maestro de Desarrollos & Personalización Visual"}
            </h1>
          </div>
          <span className="bg-[#f2f4f6] px-3 py-1.5 font-outfit text-xs font-semibold text-[#1c1b1a]">
            Mostrando {filteredProperties.length} de {properties.length} activos
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-outfit text-xs">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Zona / Corredor
            </label>
            <select
              value={zoneFilter}
              onChange={(e) =>
                setZoneFilter(e.target.value as SovereignZone | "ALL")
              }
              className="mt-1.5 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-medium text-black focus:border-[#755a34] focus:outline-none"
            >
              <option value="ALL">Todas las Zonas</option>
              {ZONES_LIST.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Presupuesto Máximo ({formatSovereignCurrency(maxPriceUsd, currency, true)})
            </label>
            <input
              type="range"
              min={1500000}
              max={10000000}
              step={250000}
              value={maxPriceUsd}
              onChange={(e) => setMaxPriceUsd(Number(e.target.value))}
              className="mt-3 w-full accent-[#755a34]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              ROI Mínimo Anual ({minRoiPct}%)
            </label>
            <select
              value={minRoiPct}
              onChange={(e) => setMinRoiPct(Number(e.target.value))}
              className="mt-1.5 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-medium text-black focus:border-[#755a34] focus:outline-none"
            >
              <option value={0}>Cualquier ROI (11%+)</option>
              <option value={12}>Superior a 12.0% Anual</option>
              <option value={13}>Superior a 13.0% Anual</option>
              <option value={14}>Superior a 14.0% Anual</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Estatus de Entrega
            </label>
            <select
              value={deliveryFilter}
              onChange={(e) =>
                setDeliveryFilter(e.target.value as DeliveryStatus | "ALL")
              }
              className="mt-1.5 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-medium text-black focus:border-[#755a34] focus:outline-none"
            >
              <option value="ALL">Todas las Entregas</option>
              <option value="Entrega Inmediata">Entrega Inmediata</option>
              <option value="Llave en Mano">Llave en Mano</option>
              <option value="Preventa Q4 2026">Preventa Q4 2026</option>
              <option value="Preventa Q2 2027">Preventa Q2 2027</option>
              <option value="Preventa Q1 2028">Preventa Q1 2028</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grilla de Tarjetas del Inventario Maestro */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProperties.map((prop) => {
          const imgUrl = prop.customImageUrl ?? prop.defaultImageUrl;
          const isFav = favorites.includes(prop.id);
          const isCompared = comparedIds.includes(prop.id);

          return (
            <div
              key={prop.id}
              className="flex flex-col justify-between border border-[#eaedf0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all hover:border-[#755a34]"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-[#1c1b1a]">
                  <img
                    src={imgUrl}
                    alt={prop.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span className="bg-black/85 px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#faeedd]">
                      {prop.zone}
                    </span>
                    <span className="bg-[#004044] px-2 py-1 font-outfit text-[10px] font-bold text-white">
                      ROI {prop.roiAnnualPct}%
                    </span>
                  </div>

                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenPhotoModal(prop)}
                      className="border border-white/30 bg-black/80 px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#755a34]"
                    >
                      📷 Cambiar Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(prop.id)}
                      className={`flex h-7 w-7 items-center justify-center border text-xs ${
                        isFav
                          ? "border-[#755a34] bg-[#755a34] text-white"
                          : "border-white/30 bg-black/75 text-white"
                      }`}
                    >
                      {isFav ? "★" : "☆"}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                    <div>
                      <div className="font-outfit text-[10px] uppercase tracking-widest text-[#faeedd]">
                        {prop.code} · {prop.deliveryStatus}
                      </div>
                      <h3 className="font-outfit text-lg font-bold">{prop.name}</h3>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between border-b border-[#eaedf0] pb-3">
                    <div>
                      <span className="font-outfit text-[10px] uppercase text-neutral-500">
                        Valor de Adquisición
                      </span>
                      <div className="font-outfit text-xl font-bold text-black">
                        {formatSovereignCurrency(prop.priceUsd, currency)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-outfit text-[10px] uppercase text-neutral-500">
                        Comisión Broker
                      </span>
                      <div className="font-outfit text-sm font-bold text-[#755a34]">
                        {prop.brokerCommissionPct}% Oficial
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 bg-[#f8f9fa] p-2.5 font-outfit text-[11px]">
                    <div>
                      <span className="text-neutral-500">Superficie:</span>
                      <div className="font-bold text-black">{prop.areaM2} m²</div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Programa:</span>
                      <div className="font-bold text-black">
                        {prop.bedrooms} Rec · {prop.bathrooms} B
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Unidades:</span>
                      <div className="font-bold text-[#004044]">
                        {prop.availableUnits} Disp.
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-neutral-600">{prop.typologies}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 border-t border-[#eaedf0] bg-[#f8f9fa] p-3">
                <button
                  type="button"
                  onClick={() => onOpenDossierModal(prop)}
                  className="bg-[#000000] py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
                >
                  Ficha & Dossier
                </button>
                <a
                  href={prop.driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center border border-[#1c1b1a]/20 bg-white py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-black hover:border-black"
                >
                  📂 Drive Oficial
                </a>
                <button
                  type="button"
                  onClick={() => onToggleCompare(prop.id)}
                  className={`border py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider ${
                    isCompared
                      ? "border-[#004044] bg-[#004044] text-white"
                      : "border-[#1c1b1a]/20 bg-white text-black hover:border-black"
                  }`}
                >
                  {isCompared ? "✓ Comparando" : "+ Comparar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ComparatorViewProps {
  properties: AureaProperty[];
  comparedIds: string[];
  currency: CurrencyCode;
  onToggleCompare: (id: string) => void;
  onOpenDossierModal: (property: AureaProperty) => void;
}

export const ComparatorView: React.FC<ComparatorViewProps> = ({
  properties,
  comparedIds,
  currency,
  onToggleCompare,
  onOpenDossierModal,
}) => {
  const comparedProps = useMemo(
    () => properties.filter((p) => comparedIds.includes(p.id)),
    [properties, comparedIds]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div>
          <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
            MULTIDIMENSIONAL ASSET BENCHMARK
          </span>
          <h1 className="font-outfit text-2xl font-bold text-black">
            Comparador Multidimensional de Propiedades (Hasta 3 en Simultáneo)
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {properties.map((p) => {
            const active = comparedIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onToggleCompare(p.id)}
                className={`border px-3 py-1.5 font-outfit text-xs font-medium transition-colors ${
                  active
                    ? "border-[#000000] bg-[#000000] text-[#faeedd]"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-neutral-700 hover:border-black"
                }`}
              >
                {active ? "✓ " : "+ "}
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto border border-[#eaedf0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#eaedf0] bg-[#1c1b1a] text-white">
              <th className="w-56 p-5 font-outfit text-xs uppercase tracking-wider text-[#faeedd]">
                Dimensión Patrimonial
              </th>
              {comparedProps.map((prop) => (
                <th key={prop.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-outfit text-[10px] uppercase tracking-widest text-[#faeedd]">
                      {prop.zone}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleCompare(prop.id)}
                      className="text-[10px] text-neutral-400 hover:text-white"
                    >
                      Quitar ✕
                    </button>
                  </div>
                  <div className="mt-1 font-outfit text-lg font-bold">
                    {prop.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaedf0]">
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Vista Arquitectónica
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4">
                  <img
                    src={prop.customImageUrl ?? prop.defaultImageUrl}
                    alt={prop.name}
                    className="h-36 w-full object-cover border border-[#eaedf0]"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Precio de Adquisición
              </td>
              {comparedProps.map((prop) => (
                <td
                  key={prop.id}
                  className="p-4 font-outfit text-base font-bold text-black"
                >
                  {formatSovereignCurrency(prop.priceUsd, currency)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Precio por m²
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4 font-outfit font-semibold text-neutral-800">
                  {formatSovereignCurrency(prop.priceUsd / prop.areaM2, currency)} / m² (
                  {prop.areaM2} m²)
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Retorno Anual Proyectado (ROI)
              </td>
              {comparedProps.map((prop) => (
                <td
                  key={prop.id}
                  className="p-4 font-outfit text-base font-bold text-[#004044]"
                >
                  {prop.roiAnnualPct}% Anual (~
                  {formatSovereignCurrency(
                    (prop.priceUsd * prop.roiAnnualPct) / 100,
                    currency,
                    true
                  )}
                  /año)
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Proyección de Plusvalía (5 Años)
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4 font-outfit font-bold text-[#755a34]">
                  +{prop.appreciation5YPct}% (Valor 5Y:{" "}
                  {formatSovereignCurrency(
                    prop.priceUsd * (1 + prop.appreciation5YPct / 100),
                    currency,
                    true
                  )}
                  )
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Costo de Mantenimiento Mensual
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4 font-outfit text-neutral-700">
                  {formatSovereignCurrency(prop.maintenanceMonthlyUsd, currency)} / mes
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Amenidades Clave
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {prop.amenities.map((a) => (
                      <span
                        key={a}
                        className="border border-[#eaedf0] bg-[#f8f9fa] px-2 py-0.5 font-outfit text-[10px]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Acción Ejecutiva
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4">
                  <button
                    type="button"
                    onClick={() => onOpenDossierModal(prop)}
                    className="w-full bg-[#000000] py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#755a34]"
                  >
                    Emitir Dossier Comparativo
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
