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
import { DossierTabKey } from "../components/SovereignModals";
import { RealInteractiveMap } from "../components/RealInteractiveMap";

interface ExecutiveDashboardProps {
  properties: AureaProperty[];
  prospects: CrmProspect[];
  appointments: VipAppointment[];
  favorites: string[];
  currency: CurrencyCode;
  onToggleFavorite: (id: string) => void;
  onOpenPhotoModal: (property: AureaProperty) => void;
  onOpenDossierModal: (
    property: AureaProperty,
    initialTab?: DossierTabKey
  ) => void;
  onAddAppointment: (appt: VipAppointment) => void;
  onNavigateSection: (section: "inventory" | "crm" | "comparator") => void;
}

const ZONES_LIST: SovereignZone[] = [
  "Cancún Zona Hotelera",
  "Isla Pok Ta Pok",
  "Puerto Cancún",
  "Playa del Carmen",
  "Riviera Maya",
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
  const [selectedMapZone, setSelectedMapZone] = useState<
    SovereignZone | "ALL"
  >("ALL");
  const [selectedMapProp, setSelectedMapProp] = useState<AureaProperty>(
    properties[0]
  );
  const [intelligenceDeckToast, setIntelligenceDeckToast] = useState<
    string | null
  >(null);

  const flagshipProperties = useMemo(
    () => properties.filter((p) => p.isFlagship),
    [properties]
  );

  const mapFilteredProperties = useMemo(
    () =>
      properties.filter(
        (p) => selectedMapZone === "ALL" || p.zone === selectedMapZone
      ),
    [properties, selectedMapZone]
  );

  // Mini-Kanban de 4 etapas ejecutivas
  const miniKanbanColumns = useMemo(
    () => [
      {
        title: "Prospecto Calificado",
        badge: "ETAPA 01",
        items: prospects.filter(
          (p) =>
            p.stage === "CONTACTO_INICIAL" ||
            p.stage === "CALIFICACION_PATRIMONIAL"
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
            p.stage === "RECORRIDO_PRESENCIAL" ||
            p.stage === "NEGOCIACION_OFERTA"
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
      `Dossier Patrimonial Proyecto Atlas Intelligence compilado (${timestamp}) con ${flagshipProperties.length} activos insignia en divisa ${currency}. Abriendo expediente...`
    );
    setTimeout(() => {
      if (flagshipProperties[0]) {
        onOpenDossierModal(flagshipProperties[0], "GALLERY");
      }
    }, 500);
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
              : "Mapa Real Interactivo & Matriz de Preventas Cancún"}
          </h1>
        </div>

        <div className="flex border border-[#091e3a] bg-[#f8f9fa] p-0.5">
          <button
            type="button"
            onClick={() => setSubView("COMMAND")}
            className={`px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider transition-all ${
              subView === "COMMAND"
                ? "bg-[#091e3a] text-white"
                : "text-[#091e3a] hover:bg-white"
            }`}
          >
            Mando Ejecutivo
          </button>
          <button
            type="button"
            onClick={() => setSubView("CARTOGRAPHY")}
            className={`px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider transition-all ${
              subView === "CARTOGRAPHY"
                ? "bg-[#091e3a] text-white"
                : "text-[#091e3a] hover:bg-white"
            }`}
          >
            Mapa Real &amp; Preventas Cancún
          </button>
        </div>
      </div>

      {intelligenceDeckToast && (
        <div className="flex items-center justify-between border border-[#755a34] bg-[#091e3a] px-6 py-3.5 text-xs text-white">
          <span className="font-outfit tracking-wide">
            {intelligenceDeckToast}
          </span>
          <button
            type="button"
            onClick={() => setIntelligenceDeckToast(null)}
            className="border border-white/30 px-2.5 py-0.5 font-outfit text-[10px] uppercase"
          >
            Cerrar
          </button>
        </div>
      )}

      {subView === "COMMAND" ? (
        <>
          {/* 4 KPIs Ejecutivos como Botones Interactivos */}
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              onClick={() => onNavigateSection("inventory")}
              className="border border-[#eaedf0] bg-white p-6 text-left shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#091e3a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Volumen en Cartera Gestionada
                </span>
                <span className="font-outfit text-[10px] font-bold text-[#755a34]">
                  AUM ACTIVO →
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-black">
                {formatSovereignCurrency(48500000, currency, true)}
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                Nautica · The Villas · Isla Blanca · Hodela · Prana
              </p>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSection("crm")}
              className="border border-[#eaedf0] bg-white p-6 text-left shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#091e3a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Comisiones Proyectadas (5%)
                </span>
                <span className="font-outfit text-[10px] font-bold text-[#004044]">
                  PIPELINE CRM →
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-[#755a34]">
                {formatSovereignCurrency(2420000, currency, true)}
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                Sobre cierres en Due Diligence y Firma Notarial
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenDossierModal(properties[0], "INVENTORY")
              }
              className="border border-[#eaedf0] bg-white p-6 text-left shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#091e3a]"
            >
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Expedientes Google Drive
                </span>
                <span className="font-outfit text-[10px] font-bold text-[#0077cc]">
                  VER INVENTARIO →
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-black">
                {properties.reduce((acc, p) => acc + p.availableUnits, 0)}{" "}
                Unidades
              </div>
              <p className="mt-1.5 text-xs text-neutral-500">
                Fotos, Brochures, Precios, Planes de Pago y Fichas
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSubView("CARTOGRAPHY")}
              className="border border-[#091e3a] bg-[#091e3a] p-6 text-left text-white shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:bg-[#0d284c]"
            >
              <div className="flex items-center justify-between">
                <span className="font-outfit text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00b4f5]">
                  Mapa Satelital Interactivo
                </span>
                <span className="font-outfit text-[10px] font-bold text-[#faeedd]">
                  ABRIR MAPA →
                </span>
              </div>
              <div className="mt-3 font-outfit text-3xl font-bold tracking-tight text-white">
                GPS en Vivo
              </div>
              <p className="mt-1.5 text-xs text-slate-300">
                Laguna Nichupté · Huayacán · Playa del Carmen
              </p>
            </button>
          </section>

          {/* Propiedades Insignia en Cartera */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
                  TROPHY ASSETS PORTFOLIO · GOOGLE DRIVE SINCRONIZADO
                </span>
                <h2 className="font-outfit text-xl font-bold text-black">
                  Desarrollos Insignia con Expediente Completo en Mano
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateSection("inventory")}
                className="border border-[#091e3a] bg-white px-4 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#091e3a] hover:text-white"
              >
                Explorar Inventario Completo ({properties.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {flagshipProperties.map((prop) => {
                const imgUrl = prop.customImageUrl ?? prop.defaultImageUrl;
                const isFav = favorites.includes(prop.id);

                return (
                  <div
                    key={prop.id}
                    className="group flex flex-col justify-between border border-[#eaedf0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all hover:border-[#091e3a]"
                  >
                    <div>
                      <div className="relative h-60 w-full overflow-hidden bg-[#091e3a]">
                        <img
                          src={imgUrl}
                          alt={prop.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="bg-[#091e3a] px-3 py-1 font-outfit text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                            {prop.zone}
                          </span>
                          <span className="bg-[#004044] px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white">
                            ROI {prop.roiAnnualPct}%
                          </span>
                        </div>

                        <div className="absolute right-4 top-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenPhotoModal(prop)}
                            className="border border-white/40 bg-black/80 px-3 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-[#755a34]"
                          >
                            Cambiar Foto
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
                            <span className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#00b4f5]">
                              {prop.code} · {prop.availableUnits} Unidades Disp.
                            </span>
                            <h3 className="font-outfit text-lg font-bold">
                              {prop.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="flex items-baseline justify-between border-b border-[#eaedf0] pb-3">
                          <span className="font-outfit text-xs text-neutral-500">
                            Desde ({prop.areaM2} m²)
                          </span>
                          <span className="font-outfit text-lg font-bold text-[#091e3a]">
                            {formatSovereignCurrency(prop.priceUsd, currency)}
                          </span>
                        </div>

                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-neutral-600">
                          {prop.subtitle}
                        </p>

                        {/* Botonera Directa a las 5 Secciones del Google Drive */}
                        <div className="mt-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => onOpenDossierModal(prop, "GALLERY")}
                            className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2.5 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                          >
                            Fotos ({prop.galleryImages?.length ?? 1})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenDossierModal(prop, "BROCHURES")
                            }
                            className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2.5 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                          >
                            Brochure ({prop.brochures?.length ?? 1})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenDossierModal(prop, "INVENTORY")
                            }
                            className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2.5 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                          >
                            Inventario ({prop.inventoryUnits?.length ?? 1})
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenDossierModal(prop, "PAYMENT_PLANS")
                            }
                            className="border border-[#755a34]/40 bg-[#faeedd]/50 px-2.5 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#755a34] hover:bg-[#755a34] hover:text-white"
                          >
                            Planes de Pago
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              onOpenDossierModal(prop, "TECH_SPECS")
                            }
                            className="col-span-2 sm:col-span-1 border border-[#0077cc]/30 bg-[#0077cc]/5 px-2.5 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#0077cc] hover:bg-[#0077cc] hover:text-white"
                          >
                            Fichas Técnicas
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Botonera inferior */}
                    <div className="grid grid-cols-2 gap-2 border-t border-[#eaedf0] bg-[#f8f9fa] p-3">
                      <a
                        href={prop.driveFolderUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center border border-[#eaedf0] bg-white px-3 py-2 text-center font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:border-[#091e3a]"
                      >
                        Abrir Drive Oficial ↗
                      </a>
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
                        className="bg-[#091e3a] px-3 py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
                      >
                        Agendar Visita VIP
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Fila Inferior: Embudo Comercial Activo + Agenda VIP & Proyecto Atlas Intelligence */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] xl:col-span-8">
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
                      <span className="bg-[#091e3a] px-2 py-0.5 font-outfit text-[10px] font-bold text-white">
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
                            {formatSovereignCurrency(
                              item.budgetUsd,
                              currency,
                              true
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-6 xl:col-span-4">
              <div className="border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-[#eaedf0] pb-3">
                  <div>
                    <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                      CONCIERGE PROTOCOL
                    </span>
                    <h3 className="font-outfit text-base font-bold text-black">
                      Próximas Citas &amp; Agenda VIP
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

              <div className="border border-[#0077cc]/40 bg-[#091e3a] p-6 text-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00c2ff]">
                  PROYECTO ATLAS INTELLIGENCE ENGINE
                </span>
                <h3 className="mt-1 font-outfit text-lg font-bold text-white">
                  Generador Express de Presentaciones Patrimoniales
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-300">
                  Compila en un clic el expediente de Google Drive con inventario,
                  planes de pago y fichas técnicas en la divisa activa (
                  {currency}).
                </p>
                <button
                  type="button"
                  onClick={handleGenerateExpressDeck}
                  className="mt-4 w-full bg-[#755a34] px-4 py-3 font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#faeedd] hover:text-black"
                >
                  Generar Presentación Patrimonial (1-Clic)
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* SUB-VISTA: MAPA REAL E INTERACTIVO & PREVENTAS CANCÚN */
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="border border-[#eaedf0] bg-[#091322] p-6 text-white lg:col-span-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="font-outfit text-[10px] uppercase tracking-[0.2em] text-[#00b4f5]">
                  MAPA REAL INTERACTIVO (LEAFLET + ESRI SATÉLITE)
                </span>
                <h3 className="font-outfit text-lg font-bold">
                  Corredor Cancún — Laguna Nichupté — Huayacán — Playa del Carmen
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
                  Todas ({properties.length})
                </button>
                {ZONES_LIST.map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => {
                      setSelectedMapZone(z);
                      const firstInZone = properties.find((p) => p.zone === z);
                      if (firstInZone) setSelectedMapProp(firstInZone);
                    }}
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

            <RealInteractiveMap
              properties={mapFilteredProperties}
              selectedProperty={selectedMapProp}
              currency={currency}
              onSelectProperty={(p) => setSelectedMapProp(p)}
              onOpenDossier={(p) => onOpenDossierModal(p, "GALLERY")}
            />
          </div>

          {/* Ficha Cartográfica Seleccionada con Botonera Completa del Google Drive */}
          <div className="flex flex-col justify-between border border-[#eaedf0] bg-white p-6 lg:col-span-4">
            <div>
              <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                DESARROLLO SELECCIONADO EN EL MAPA
              </span>
              <h3 className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                {selectedMapProp.name}
              </h3>
              <p className="font-outfit text-xs text-neutral-500">
                {selectedMapProp.zone} · GPS{" "}
                {selectedMapProp.coordinates.lat.toFixed(4)}° N,{" "}
                {selectedMapProp.coordinates.lng.toFixed(4)}° W
              </p>

              <div className="mt-4 h-44 w-full overflow-hidden border border-[#eaedf0]">
                <img
                  src={
                    selectedMapProp.customImageUrl ??
                    selectedMapProp.defaultImageUrl
                  }
                  alt={selectedMapProp.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border border-[#eaedf0] bg-[#f8f9fa] p-3.5 font-outfit">
                <div>
                  <span className="text-[10px] uppercase text-neutral-500">
                    Precio Desde
                  </span>
                  <div className="text-base font-bold text-black">
                    {formatSovereignCurrency(
                      selectedMapProp.priceUsd,
                      currency
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-500">
                    Retorno Proyectado
                  </span>
                  <div className="text-base font-bold text-[#004044]">
                    {selectedMapProp.roiAnnualPct}% Anual
                  </div>
                </div>
              </div>

              {/* Botones para abrir directamente cada sección del Google Drive */}
              <div className="mt-4 space-y-2">
                <span className="block font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#0077cc]">
                  ABRIR MÓDULO DEL EXPEDIENTE GOOGLE DRIVE:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDossierModal(selectedMapProp, "GALLERY")
                    }
                    className="border border-[#091e3a]/25 bg-[#f8f9fa] py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                  >
                    1. Fotos &amp; Renders
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDossierModal(selectedMapProp, "BROCHURES")
                    }
                    className="border border-[#091e3a]/25 bg-[#f8f9fa] py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                  >
                    2. Brochures PDF
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDossierModal(selectedMapProp, "INVENTORY")
                    }
                    className="border border-[#091e3a]/25 bg-[#f8f9fa] py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                  >
                    3. Inventario Real
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenDossierModal(selectedMapProp, "PAYMENT_PLANS")
                    }
                    className="border border-[#755a34] bg-[#faeedd]/60 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#755a34] hover:bg-[#755a34] hover:text-white"
                  >
                    4. Planes de Pago
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onOpenDossierModal(selectedMapProp, "TECH_SPECS")
                  }
                  className="w-full border border-[#0077cc] bg-[#0077cc]/10 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#0077cc] hover:bg-[#0077cc] hover:text-white"
                >
                  5. Fichas Técnicas &amp; Plantas Ambientadas
                </button>
              </div>
            </div>

            <div className="mt-5 flex gap-2 border-t border-[#eaedf0] pt-4">
              <a
                href={selectedMapProp.driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 border border-[#091e3a] bg-white py-2.5 text-center font-outfit text-xs font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#f2f4f6]"
              >
                Abrir Google Drive ↗
              </a>
              <button
                type="button"
                onClick={() => onOpenPhotoModal(selectedMapProp)}
                className="bg-[#091e3a] px-4 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
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
  onOpenDossierModal: (
    property: AureaProperty,
    initialTab?: DossierTabKey
  ) => void;
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
  const [maxPriceUsd, setMaxPriceUsd] = useState<number>(3000000);
  const [minRoiPct, setMinRoiPct] = useState<number>(0);
  const [deliveryFilter, setDeliveryFilter] = useState<
    DeliveryStatus | "ALL"
  >("ALL");

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
                : "SOVEREIGN MASTER INVENTORY · GOOGLE DRIVE INTEGRADO"}
            </span>
            <h1 className="font-outfit text-2xl font-bold text-black">
              {onlyFavoritesMode
                ? "Bóveda de Desarrollos Favoritos"
                : "Inventario Maestro de Desarrollos — Expedientes Google Drive en Mano"}
            </h1>
          </div>
          <span className="bg-[#f2f4f6] px-3 py-1.5 font-outfit text-xs font-semibold text-[#1c1b1a]">
            Mostrando {filteredProperties.length} de {properties.length}{" "}
            desarrollos
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 font-outfit text-xs sm:grid-cols-2 lg:grid-cols-4">
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
              Presupuesto Base Máximo (
              {formatSovereignCurrency(maxPriceUsd, currency, true)})
            </label>
            <input
              type="range"
              min={200000}
              max={3000000}
              step={50000}
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
              <option value={0}>Cualquier ROI (12%+)</option>
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
              className="flex flex-col justify-between border border-[#eaedf0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all hover:border-[#091e3a]"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden bg-[#091e3a]">
                  <img
                    src={imgUrl}
                    alt={prop.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

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
                      className="border border-white/30 bg-black/80 px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
                    >
                      Cambiar Foto
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
                      <div className="font-outfit text-[10px] uppercase tracking-widest text-[#00b4f5]">
                        {prop.code} · {prop.deliveryStatus}
                      </div>
                      <h3 className="font-outfit text-lg font-bold">
                        {prop.name}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between border-b border-[#eaedf0] pb-3">
                    <div>
                      <span className="font-outfit text-[10px] uppercase text-neutral-500">
                        Precio Desde
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
                      <div className="font-bold text-black">
                        {prop.areaM2} m²
                      </div>
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

                  {/* Botonera Directa a las 5 Secciones del Google Drive */}
                  <div className="mt-4 border-t border-[#eaedf0] pt-3">
                    <span className="block font-outfit text-[9px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                      EXPEDIENTE GOOGLE DRIVE EN MANO:
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => onOpenDossierModal(prop, "GALLERY")}
                        className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                      >
                        Fotos ({prop.galleryImages?.length ?? 1})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossierModal(prop, "BROCHURES")}
                        className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                      >
                        Brochure ({prop.brochures?.length ?? 1})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossierModal(prop, "INVENTORY")}
                        className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                      >
                        Inventario ({prop.inventoryUnits?.length ?? 1})
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenDossierModal(prop, "PAYMENT_PLANS")
                        }
                        className="border border-[#755a34]/40 bg-[#faeedd]/50 px-2 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#755a34] hover:bg-[#755a34] hover:text-white"
                      >
                        Planes Pago
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossierModal(prop, "TECH_SPECS")}
                        className="col-span-2 sm:col-span-1 border border-[#0077cc]/30 bg-[#0077cc]/5 px-2 py-1.5 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#0077cc] hover:bg-[#0077cc] hover:text-white"
                      >
                        Fichas Técnicas
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 border-t border-[#eaedf0] bg-[#f8f9fa] p-3">
                <button
                  type="button"
                  onClick={() => onOpenDossierModal(prop, "GALLERY")}
                  className="bg-[#091e3a] py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
                >
                  Expediente Completo
                </button>
                <a
                  href={prop.driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center border border-[#1c1b1a]/20 bg-white py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-black hover:border-black"
                >
                  Drive Oficial ↗
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
                  {isCompared ? "Comparando" : "+ Comparar"}
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
  onOpenDossierModal: (
    property: AureaProperty,
    initialTab?: DossierTabKey
  ) => void;
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
            Comparador Multidimensional de Desarrollos (Hasta 3 en Simultáneo)
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
                    ? "border-[#091e3a] bg-[#091e3a] text-white"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-neutral-700 hover:border-black"
                }`}
              >
                {active ? "✓ " : "+ "}
                {p.name.split("—")[0].split("(")[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto border border-[#eaedf0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#eaedf0] bg-[#091e3a] text-white">
              <th className="w-56 p-5 font-outfit text-xs uppercase tracking-wider text-[#00b4f5]">
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
                      className="text-[10px] text-neutral-300 hover:text-white"
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
                Render Oficial Google Drive
              </td>
              {comparedProps.map((prop) => (
                <td key={prop.id} className="p-4">
                  <img
                    src={prop.customImageUrl ?? prop.defaultImageUrl}
                    alt={prop.name}
                    className="h-36 w-full border border-[#eaedf0] object-cover"
                  />
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Precio Base de Lista
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
                <td
                  key={prop.id}
                  className="p-4 font-outfit font-semibold text-neutral-800"
                >
                  {formatSovereignCurrency(
                    prop.priceUsd / prop.areaM2,
                    currency
                  )}{" "}
                  / m² ({prop.areaM2} m²)
                </td>
              ))}
            </tr>
            <tr>
              <td className="bg-[#f8f9fa] p-4 font-outfit font-semibold text-[#1c1b1a]">
                Planes de Pago &amp; Descuento Máximo
              </td>
              {comparedProps.map((prop) => {
                const maxDesc = Math.max(
                  ...(prop.paymentPlans?.map((pl) => pl.discountPct) ?? [0])
                );
                return (
                  <td
                    key={prop.id}
                    className="p-4 font-outfit font-semibold text-[#755a34]"
                  >
                    {prop.paymentPlans?.length ?? 1} Esquemas Oficiales · Hasta{" "}
                    {maxDesc}% de Descuento
                  </td>
                );
              })}
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
                <td
                  key={prop.id}
                  className="p-4 font-outfit font-bold text-[#755a34]"
                >
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
                Unidades Disponibles en Drive
              </td>
              {comparedProps.map((prop) => (
                <td
                  key={prop.id}
                  className="p-4 font-outfit font-semibold text-[#091e3a]"
                >
                  {prop.availableUnits} de {prop.totalUnits} unidades
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
                    onClick={() => onOpenDossierModal(prop, "INVENTORY")}
                    className="w-full bg-[#091e3a] py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
                  >
                    Abrir Expediente &amp; Precios
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
