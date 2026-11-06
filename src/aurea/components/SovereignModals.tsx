import React, { useState } from "react";
import {
  AureaProperty,
  CrmProspect,
  CurrencyCode,
  InteractiveOptionDetail,
  NavSectionId,
  WhiteLabelConfig,
} from "../types";
import { PHOTO_PRESETS } from "../data/initialData";
import {
  formatSovereignCurrency,
  sanitizeSovereignInput,
} from "../storage/useAureaStorage";
import { AtlasBrandLogo } from "./AtlasBrandLogo";

export type DossierTabKey =
  | "GALLERY"
  | "BROCHURES"
  | "INVENTORY"
  | "PAYMENT_PLANS"
  | "TECH_SPECS";

interface PhotoCustomizerModalProps {
  property: AureaProperty;
  onClose: () => void;
  onSavePhoto: (propertyId: string, newUrl: string | undefined) => void;
}

export const PhotoCustomizerModal: React.FC<PhotoCustomizerModalProps> = ({
  property,
  onClose,
  onSavePhoto,
}) => {
  const currentUrl = property.customImageUrl ?? property.defaultImageUrl;
  const [selectedUrl, setSelectedUrl] = useState<string>(currentUrl);
  const [customUrlInput, setCustomUrlInput] = useState<string>(
    property.customImageUrl ?? ""
  );

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    onSavePhoto(property.id, trimmed);
    onClose();
  };

  const driveGallery = property.galleryImages ?? [];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-6 w-full max-w-2xl border border-[#1c1b1a] bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eaedf0] bg-[#091e3a] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <AtlasBrandLogo variant="icon" theme="dark" className="h-9 w-9" />
            <div>
              <span className="font-outfit text-[10px] uppercase tracking-[0.22em] text-[#00c2ff]">
                PROYECTO ATLAS · CURADURÍA FOTOGRÁFICA GOOGLE DRIVE
              </span>
              <h3 className="font-outfit text-lg font-semibold">
                Seleccionar Fotografía — {property.name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/20 px-3 py-1 font-outfit text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black"
          >
            Cerrar
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Vista previa activa */}
          <div className="relative h-56 w-full overflow-hidden border border-[#eaedf0] bg-[#f2f4f6]">
            <img
              src={selectedUrl}
              alt={property.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 font-outfit text-[11px] uppercase tracking-wider text-[#faeedd]">
              Vista Previa Activa · Clic fuera del recuadro para cerrar
            </div>
          </div>

          {/* Renders Oficiales del Google Drive de este Desarrollo */}
          {driveGallery.length > 0 && (
            <div>
              <label className="block font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-[#091e3a]">
                1. Renders Oficiales Extraídos del Google Drive del Desarrollo
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {driveGallery.map((img) => {
                  const isSelected = selectedUrl === img.url;
                  return (
                    <button
                      key={img.url + img.label}
                      type="button"
                      onClick={() => {
                        setSelectedUrl(img.url);
                        setCustomUrlInput(img.url);
                        onSavePhoto(property.id, img.url);
                      }}
                      className={`group flex flex-col border text-left transition-all ${
                        isSelected
                          ? "border-[#0077cc] bg-[#0077cc]/5 ring-1 ring-[#0077cc]"
                          : "border-[#eaedf0] bg-white hover:border-[#091e3a]"
                      }`}
                    >
                      <div className="h-20 w-full overflow-hidden bg-[#f2f4f6]">
                        <img
                          src={img.url}
                          alt={img.label}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-2">
                        <div className="font-outfit text-[9px] font-semibold uppercase tracking-wider text-[#0077cc]">
                          {img.category}
                        </div>
                        <div className="line-clamp-1 font-outfit text-[11px] font-medium text-[#000000]">
                          {img.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Presets Globales */}
          <div>
            <label className="block font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-[#1c1b1a]">
              2. Presets Fotográficos de Cartera
            </label>
            <div className="mt-3 grid grid-cols-5 gap-2.5">
              {PHOTO_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedUrl(preset.url);
                      setCustomUrlInput(preset.url);
                      onSavePhoto(property.id, preset.url);
                    }}
                    className={`group flex flex-col border text-left transition-all ${
                      isSelected
                        ? "border-[#755a34] bg-[#faeedd]/40 ring-1 ring-[#755a34]"
                        : "border-[#eaedf0] bg-white hover:border-[#1c1b1a]"
                    }`}
                  >
                    <div className="h-14 w-full overflow-hidden bg-[#f2f4f6]">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-1.5">
                      <div className="font-outfit text-[10px] font-semibold text-[#000000]">
                        {preset.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* URL Personalizada */}
          <form onSubmit={handleApplyCustomUrl}>
            <label className="block font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-[#1c1b1a]">
              3. O Ingresar URL de Imagen Personalizada
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customUrlInput}
                onChange={(e) => {
                  setCustomUrlInput(e.target.value);
                  if (
                    e.target.value.startsWith("http") ||
                    e.target.value.startsWith("/")
                  ) {
                    setSelectedUrl(e.target.value);
                  }
                }}
                placeholder="https://... o /drive-assets/..."
                className="flex-1 border border-[#1c1b1a]/30 bg-[#f8f9fa] px-3.5 py-2 text-xs text-black focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#091e3a] px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
              >
                Aplicar
              </button>
            </div>
          </form>

          {/* Restaurar original */}
          <div className="flex items-center justify-between border-t border-[#eaedf0] pt-4">
            <button
              type="button"
              onClick={() => {
                onSavePhoto(property.id, undefined);
                onClose();
              }}
              className="border border-[#1c1b1a] bg-white px-4 py-2 font-outfit text-xs font-medium uppercase tracking-wider text-[#1c1b1a] hover:bg-[#f2f4f6]"
            >
              Restaurar Fotografía Original
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#755a34] px-6 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#000000]"
            >
              Guardar y Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DossierModalProps {
  property: AureaProperty;
  currency: CurrencyCode;
  whiteLabel: WhiteLabelConfig;
  initialTab?: DossierTabKey;
  onClose: () => void;
  onScheduleVisit: (property: AureaProperty) => void;
}

export const PropertyDossierModal: React.FC<DossierModalProps> = ({
  property,
  currency,
  whiteLabel,
  initialTab = "GALLERY",
  onClose,
  onScheduleVisit,
}) => {
  const [activeTab, setActiveTab] = useState<DossierTabKey>(initialTab);
  const [activeGalleryImg, setActiveGalleryImg] = useState<string>(
    property.customImageUrl ?? property.defaultImageUrl
  );
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(0);
  const [inventoryFilter, setInventoryFilter] = useState<string>("ALL");

  const gallery = property.galleryImages ?? [
    {
      label: property.name,
      url: property.customImageUrl ?? property.defaultImageUrl,
      category: "Fachada" as const,
    },
  ];
  const brochures = property.brochures ?? [];
  const paymentPlans = property.paymentPlans ?? [];
  const inventoryUnits = property.inventoryUnits ?? [];
  const technicalSpecs = property.technicalSpecs ?? [];
  const subfolders = property.driveSubfolders ?? [];

  const pricePerM2Usd = property.priceUsd / property.areaM2;
  const projected5YValueUsd =
    property.priceUsd * (1 + property.appreciation5YPct / 100);
  const annualYieldUsd = property.priceUsd * (property.roiAnnualPct / 100);

  // Unidad activa para simulador de Plan de Pago
  const activeUnit = inventoryUnits[selectedUnitIndex];
  const baseSimPriceUsd = activeUnit ? activeUnit.priceUsd : property.priceUsd;
  const baseSimPriceMxn = activeUnit
    ? activeUnit.priceMxn
    : Math.round(property.priceUsd * 20.15);
  const activePlan = paymentPlans[selectedPlanIndex];
  const discountMultiplier = activePlan
    ? 1 - activePlan.discountPct / 100
    : 1;
  const finalPriceUsd = baseSimPriceUsd * discountMultiplier;
  const finalPriceMxn = baseSimPriceMxn * discountMultiplier;
  const savingsMxn = baseSimPriceMxn - finalPriceMxn;

  const filteredUnits = inventoryUnits.filter((u) => {
    if (inventoryFilter === "ALL") return true;
    return u.typology.toLowerCase().includes(inventoryFilter.toLowerCase());
  });

  const TABS: { id: DossierTabKey; label: string; count?: number }[] = [
    { id: "GALLERY", label: "Fotos & Renders", count: gallery.length },
    { id: "BROCHURES", label: "Brochures Oficiales", count: brochures.length },
    {
      id: "INVENTORY",
      label: "Inventario & Precios",
      count: inventoryUnits.length,
    },
    {
      id: "PAYMENT_PLANS",
      label: "Planes de Pago",
      count: paymentPlans.length,
    },
    {
      id: "TECH_SPECS",
      label: "Fichas Técnicas & Planos",
      count: technicalSpecs.length,
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-3 sm:p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="my-auto max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-[#091e3a] bg-white text-[#091e3a] shadow-2xl"
      >
        {/* Barra institucional del Dossier */}
        <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[#0077cc]/40 bg-[#091e3a] px-6 py-4 text-white">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center border border-white/15 bg-white/5 p-1">
              <AtlasBrandLogo variant="icon" theme="dark" className="h-9 w-9" />
            </div>
            <div>
              <div className="font-outfit text-[10px] uppercase tracking-[0.24em] text-[#00c2ff]">
                {whiteLabel.agencyName} · EXPEDIENTE SINCRONIZADO GOOGLE DRIVE
              </div>
              <h2 className="font-outfit text-lg font-semibold tracking-tight sm:text-xl">
                {property.name} ({property.code})
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={property.driveFolderUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-[#00b4f5]/50 bg-[#0077cc]/20 px-3.5 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
            >
              Abrir Carpeta Raíz Drive ↗
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-[#755a34] bg-[#755a34] px-3.5 py-2 font-outfit text-[11px] font-semibold uppercase tracking-wider text-white hover:bg-[#5e4728]"
            >
              Exportar PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-white/30 px-3 py-2 font-outfit text-[11px] uppercase text-white hover:bg-white hover:text-black"
            >
              Cerrar ✕
            </button>
          </div>
        </div>

        {/* Botonera de 5 Pestañas Interactivas del Expediente */}
        <div className="sticky top-[73px] z-10 flex flex-wrap border-b border-[#eaedf0] bg-[#f8f9fa] px-6 pt-2">
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-outfit text-xs font-semibold uppercase tracking-wider transition ${
                  active
                    ? "border-[#0077cc] bg-white text-[#091e3a]"
                    : "border-transparent text-neutral-500 hover:text-[#091e3a]"
                }`}
              >
                <span>{t.label}</span>
                {typeof t.count === "number" && t.count > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] ${
                      active
                        ? "bg-[#091e3a] text-white"
                        : "bg-[#eaedf0] text-neutral-600"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Contenido Dinámico según la Pestaña Seleccionada */}
        <div className="space-y-6 p-6 sm:p-8">
          {/* ===============================================================
              PESTAÑA 1: FOTOS, RENDERS REALES & RESUMEN EJECUTIVO
          ================================================================ */}
          {activeTab === "GALLERY" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Visor Fotográfico Principal + Miniaturas de Google Drive */}
                <div className="space-y-3 lg:col-span-7">
                  <div className="relative h-72 w-full overflow-hidden border border-[#eaedf0] bg-[#091e3a] sm:h-80">
                    <img
                      src={activeGalleryImg}
                      alt={property.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 font-outfit text-[10px] uppercase tracking-widest text-[#faeedd]">
                      Render Oficial Google Drive · {property.developerName}
                    </div>
                  </div>

                  {/* Selector de Fotos del Desarrollo */}
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {gallery.map((item) => {
                      const isCurrent = activeGalleryImg === item.url;
                      return (
                        <button
                          key={item.url + item.label}
                          type="button"
                          onClick={() => setActiveGalleryImg(item.url)}
                          className={`group overflow-hidden border text-left transition ${
                            isCurrent
                              ? "border-[#0077cc] ring-2 ring-[#0077cc]/40"
                              : "border-[#eaedf0] opacity-80 hover:opacity-100"
                          }`}
                        >
                          <div className="h-14 w-full overflow-hidden bg-neutral-200">
                            <img
                              src={item.url}
                              alt={item.label}
                              className="h-full w-full object-cover transition group-hover:scale-105"
                            />
                          </div>
                          <div className="truncate p-1 font-outfit text-[9px] font-medium text-neutral-700">
                            {item.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen Financiero y Descriptivo */}
                <div className="flex flex-col justify-between border border-[#eaedf0] bg-[#f8f9fa] p-6 lg:col-span-5">
                  <div>
                    <div className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                      {property.zone} · {property.deliveryStatus}
                    </div>
                    <h3 className="mt-2 font-outfit text-2xl font-bold text-[#091e3a]">
                      Desde {formatSovereignCurrency(property.priceUsd, currency)}
                    </h3>
                    <p className="mt-1 font-outfit text-xs text-neutral-500">
                      Valor promedio por m²:{" "}
                      {formatSovereignCurrency(pricePerM2Usd, currency)} / m²
                    </p>
                    <p className="mt-4 text-xs leading-relaxed text-neutral-700">
                      {property.architecturalDigest}
                    </p>

                    {property.engineeringAndFinishes && (
                      <ul className="mt-4 space-y-1.5 border-t border-[#eaedf0] pt-3 text-[11px] text-neutral-600">
                        {property.engineeringAndFinishes.map((spec) => (
                          <li key={spec} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#0077cc]">▪</span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-4 border-t border-[#eaedf0] pt-4">
                    <div className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#004044]">
                      Desarrollador: {property.developerName}
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">
                      Tipologías: {property.typologies}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 KPIs Financieros del Desarrollo */}
              <div className="grid grid-cols-2 gap-4 border border-[#eaedf0] bg-[#f2f4f6] p-4 sm:grid-cols-4">
                <div className="border border-[#eaedf0] bg-white p-4">
                  <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                    ROI Neto Proyectado
                  </span>
                  <div className="mt-1 font-outfit text-xl font-bold text-[#004044]">
                    {property.roiAnnualPct}% Anual
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    ~{formatSovereignCurrency(annualYieldUsd, currency, true)} / año
                  </span>
                </div>

                <div className="border border-[#eaedf0] bg-white p-4">
                  <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                    Valor Proyectado (5 Años)
                  </span>
                  <div className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                    {formatSovereignCurrency(projected5YValueUsd, currency, true)}
                  </div>
                  <span className="text-[11px] text-[#755a34]">
                    +{property.appreciation5YPct}% Plusvalía Estimada
                  </span>
                </div>

                <div className="border border-[#eaedf0] bg-white p-4">
                  <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                    Unidades en Inventario
                  </span>
                  <div className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                    {property.availableUnits} Disponibles
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    De {property.totalUnits} unidades totales
                  </span>
                </div>

                <div className="border border-[#eaedf0] bg-white p-4">
                  <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                    Comisión Agencia / Broker
                  </span>
                  <div className="mt-1 font-outfit text-xl font-bold text-[#755a34]">
                    {property.brokerCommissionPct}%
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {formatSovereignCurrency(
                      (property.priceUsd * property.brokerCommissionPct) / 100,
                      currency,
                      true
                    )}
                  </span>
                </div>
              </div>

              {/* Subcarpetas Oficiales de Google Drive como Botones Interactivos */}
              {subfolders.length > 0 && (
                <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
                  <div className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
                     ÍNDICE DE CARPETAS VERIFICADAS EN GOOGLE DRIVE
                  </div>
                  <h4 className="mt-1 font-outfit text-sm font-bold text-[#091e3a]">
                    Acceso Directo a Subcarpetas del Desarrollador
                  </h4>
                  <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                    {subfolders.map((folder) => (
                      <a
                        key={folder.label}
                        href={folder.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col justify-between border border-[#eaedf0] bg-white p-3.5 transition hover:border-[#091e3a] hover:shadow-md"
                      >
                        <div>
                          <span className="font-outfit text-[9px] font-semibold uppercase tracking-widest text-[#755a34]">
                            {folder.category}
                          </span>
                          <div className="mt-1 font-outfit text-xs font-semibold text-[#091e3a] group-hover:text-[#0077cc]">
                            {folder.label}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-[#eaedf0] pt-2 font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                          <span>Abrir en Drive</span>
                          <span>↗</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              PESTAÑA 2: BROCHURES OFICIALES (ESPAÑOL / INGLÉS / VILLAS)
          ================================================================ */}
          {activeTab === "BROCHURES" && (
            <div className="space-y-5">
              <div className="border-b border-[#eaedf0] pb-4">
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
                  DOCUMENTACIÓN COMERCIAL &amp; PRESENTACIONES
                </span>
                <h3 className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                  Brochures Oficiales — {property.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  Haz clic en cualquier brochure para abrir o descargar el documento PDF original alojado en Google Drive.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {brochures.map((doc) => (
                  <a
                    key={doc.title}
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col justify-between border border-[#eaedf0] bg-[#f8f9fa] p-6 transition hover:-translate-y-0.5 hover:border-[#091e3a] hover:bg-white hover:shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#eaedf0] pb-3">
                        <span className="bg-[#091e3a] px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-widest text-white">
                          IDIOMA: {doc.language}
                        </span>
                        <span className="font-outfit text-xs font-semibold text-[#0077cc]">
                          PDF OFICIAL DRIVE ↗
                        </span>
                      </div>
                      <h4 className="mt-4 font-outfit text-base font-bold text-[#091e3a] group-hover:text-[#0077cc]">
                        {doc.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                        {doc.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#eaedf0] pt-3 font-outfit text-xs font-semibold uppercase tracking-wider text-[#755a34]">
                      <span>Abrir / Descargar Brochure Completo</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ===============================================================
              PESTAÑA 3: INVENTARIO POR UNIDAD & LISTA DE PRECIOS VIGENTE
          ================================================================ */}
          {activeTab === "INVENTORY" && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#eaedf0] pb-4">
                <div>
                  <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
                    LISTA DE PRECIOS &amp; DISPONIBILIDAD AUDITADA
                  </span>
                  <h3 className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                    Inventario Oficial de Unidades — {property.name}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-600">
                    Precios extraídos de las listas de precios vigentes en Google Drive. Selecciona cualquier unidad para cotizar su plan de pagos.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {["ALL", "1 Rec", "2 Rec", "3 Rec", "Villa", "PH"].map(
                    (flt) => (
                      <button
                        key={flt}
                        type="button"
                        onClick={() => setInventoryFilter(flt)}
                        className={`px-3 py-1.5 font-outfit text-[11px] font-semibold uppercase tracking-wider transition ${
                          inventoryFilter === flt
                            ? "bg-[#091e3a] text-white"
                            : "border border-[#eaedf0] bg-[#f8f9fa] text-neutral-600 hover:border-[#091e3a]"
                        }`}
                      >
                        {flt === "ALL" ? "Todas" : flt}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="overflow-x-auto border border-[#eaedf0]">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#eaedf0] bg-[#091e3a] font-outfit text-[10px] uppercase tracking-wider text-white">
                    <tr>
                      <th className="px-4 py-3">Unidad</th>
                      <th className="px-4 py-3">Torre / Nivel</th>
                      <th className="px-4 py-3">Modelo</th>
                      <th className="px-4 py-3">Tipología</th>
                      <th className="px-4 py-3">Superficie</th>
                      <th className="px-4 py-3">Vista / Orientación</th>
                      <th className="px-4 py-3">Precio Lista (MXN)</th>
                      <th className="px-4 py-3">Equivalente ({currency})</th>
                      <th className="px-4 py-3">Estatus</th>
                      <th className="px-4 py-3">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaedf0]">
                    {filteredUnits.map((u, idx) => (
                      <tr
                        key={u.unit + u.towerOrLevel}
                        className="bg-white transition hover:bg-[#f8f9fa]"
                      >
                        <td className="px-4 py-3 font-outfit font-bold text-[#091e3a]">
                          {u.unit}
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {u.towerOrLevel}
                        </td>
                        <td className="px-4 py-3 font-outfit font-semibold text-[#755a34]">
                          {u.model}
                        </td>
                        <td className="px-4 py-3 text-neutral-700">
                          {u.typology}
                        </td>
                        <td className="px-4 py-3 font-outfit font-semibold">
                          {u.areaM2.toFixed(2)} m²
                        </td>
                        <td className="px-4 py-3 text-neutral-500">
                          {u.viewOrOrientation}
                        </td>
                        <td className="px-4 py-3 font-outfit font-semibold text-[#091e3a]">
                          ${u.priceMxn.toLocaleString("es-MX")} MXN
                        </td>
                        <td className="px-4 py-3 font-outfit font-bold text-[#004044]">
                          {formatSovereignCurrency(u.priceUsd, currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 font-outfit text-[10px] font-semibold uppercase ${
                              u.status === "Disponible"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : u.status === "Showroom"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUnitIndex(idx);
                              setActiveTab("PAYMENT_PLANS");
                            }}
                            className="border border-[#091e3a] bg-[#091e3a] px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
                          >
                            Cotizar Plan →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===============================================================
              PESTAÑA 4: PLANES DE PAGO & SIMULADOR DE DESCUENTOS
          ================================================================ */}
          {activeTab === "PAYMENT_PLANS" && (
            <div className="space-y-6">
              <div className="border-b border-[#eaedf0] pb-4">
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
                  POLÍTICA OFICIAL DE DESCUENTOS &amp; CORRIDA FINANCIERA
                </span>
                <h3 className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                  Planes de Pago Autorizados — {property.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  Selecciona una unidad del inventario y haz clic en cualquiera de los esquemas de pago para calcular el descuento y los montos exactos.
                </p>
              </div>

              {/* Selector de unidad para simular */}
              {inventoryUnits.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 border border-[#eaedf0] bg-[#f8f9fa] p-4">
                  <div>
                    <label className="block font-outfit text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Unidad Seleccionada para Cotización:
                    </label>
                    <select
                      value={selectedUnitIndex}
                      onChange={(e) =>
                        setSelectedUnitIndex(Number(e.target.value))
                      }
                      className="mt-1 border border-[#091e3a] bg-white px-3.5 py-2 font-outfit text-xs font-semibold text-[#091e3a] focus:outline-none"
                    >
                      {inventoryUnits.map((u, idx) => (
                        <option key={u.unit + idx} value={idx}>
                          {u.unit} ({u.towerOrLevel}) — {u.model} · {u.areaM2} m² · $
                          {u.priceMxn.toLocaleString("es-MX")} MXN
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right font-outfit">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                      Precio de Lista Nominal
                    </span>
                    <div className="text-lg font-bold text-[#091e3a]">
                      ${baseSimPriceMxn.toLocaleString("es-MX")} MXN (
                      {formatSovereignCurrency(baseSimPriceUsd, currency)})
                    </div>
                  </div>
                </div>
              )}

              {/* Tarjetas de Esquemas de Pago Interactivos */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {paymentPlans.map((plan, idx) => {
                  const isSelected = selectedPlanIndex === idx;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanIndex(idx)}
                      className={`flex flex-col justify-between border p-5 text-left transition-all ${
                        isSelected
                          ? "border-[#091e3a] bg-[#091e3a] text-white shadow-lg"
                          : "border-[#eaedf0] bg-white text-[#091e3a] hover:border-[#0077cc]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-current/15 pb-3">
                          <span className="font-outfit text-xs font-bold uppercase tracking-wider">
                            {plan.schemeName}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 font-outfit text-xs font-bold ${
                              plan.discountPct > 0
                                ? "bg-[#755a34] text-white"
                                : "bg-neutral-200 text-neutral-800"
                            }`}
                          >
                            {plan.discountPct > 0
                              ? `${plan.discountPct}% DESCUENTO`
                              : "PRECIO LISTA"}
                          </span>
                        </div>
                        <div
                          className={`mt-3 font-outfit text-base font-semibold ${
                            isSelected ? "text-[#00b4f5]" : "text-[#0077cc]"
                          }`}
                        >
                          {plan.structure}
                        </div>
                        <p
                          className={`mt-2 text-xs leading-relaxed ${
                            isSelected ? "text-slate-300" : "text-neutral-600"
                          }`}
                        >
                          {plan.notes}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-current/15 pt-3 font-outfit text-[11px] uppercase tracking-wider">
                        <span>
                          {isSelected
                            ? "Esquema Activo en Cotización"
                            : "Seleccionar Esquema"}
                        </span>
                        <span>→</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Resumen de Liquidación con el Esquema Seleccionado */}
              {activePlan && (
                <div className="grid grid-cols-1 gap-4 border border-[#091e3a] bg-[#f8f9fa] p-6 sm:grid-cols-3">
                  <div>
                    <span className="font-outfit text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Esquema Aplicado
                    </span>
                    <div className="mt-1 font-outfit text-base font-bold text-[#091e3a]">
                      {activePlan.schemeName}
                    </div>
                    <div className="text-xs text-[#0077cc]">
                      {activePlan.structure}
                    </div>
                  </div>

                  <div>
                    <span className="font-outfit text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Ahorro Directo por Descuento ({activePlan.discountPct}%)
                    </span>
                    <div className="mt-1 font-outfit text-lg font-bold text-[#755a34]">
                      -${Math.round(savingsMxn).toLocaleString("es-MX")} MXN
                    </div>
                    <div className="text-xs text-neutral-500">
                      Aplicado en Carta Oferta oficial
                    </div>
                  </div>

                  <div>
                    <span className="font-outfit text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      Precio Final Neto con Descuento
                    </span>
                    <div className="mt-1 font-outfit text-xl font-bold text-[#004044]">
                      ${Math.round(finalPriceMxn).toLocaleString("es-MX")} MXN
                    </div>
                    <div className="font-outfit text-xs font-semibold text-[#091e3a]">
                      Equivalente: {formatSovereignCurrency(finalPriceUsd, currency)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===============================================================
              PESTAÑA 5: FICHAS TÉCNICAS, PROTOTIPOS & PLANTAS AMBIENTADAS
          ================================================================ */}
          {activeTab === "TECH_SPECS" && (
            <div className="space-y-6">
              <div className="border-b border-[#eaedf0] pb-4">
                <span className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
                  INGENIERÍA ARQUITECTÓNICA &amp; PLANTAS AMBIENTADAS
                </span>
                <h3 className="mt-1 font-outfit text-xl font-bold text-[#091e3a]">
                  Fichas Técnicas por Prototipo — {property.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-600">
                  Especificaciones de superficie, programa arquitectónico, estacionamiento y planos ejecutivos verificados en Google Drive.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {technicalSpecs.map((spec) => (
                  <div
                    key={spec.prototypeName + spec.modelCode}
                    className="flex flex-col justify-between border border-[#eaedf0] bg-[#f8f9fa] p-6"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-[#eaedf0] pb-3">
                        <span className="font-outfit text-xs font-bold uppercase tracking-wider text-[#755a34]">
                          {spec.modelCode}
                        </span>
                        <span className="bg-[#091e3a] px-2.5 py-1 font-outfit text-[11px] font-semibold text-white">
                          {spec.areaM2}
                        </span>
                      </div>

                      <h4 className="mt-4 font-outfit text-lg font-bold text-[#091e3a]">
                        {spec.prototypeName}
                      </h4>

                      <div className="mt-3 grid grid-cols-3 gap-2 border border-[#eaedf0] bg-white p-3 font-outfit text-[11px]">
                        <div>
                          <span className="block text-[9px] uppercase text-neutral-400">
                            Recámaras
                          </span>
                          <span className="font-semibold text-[#091e3a]">
                            {spec.bedrooms}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase text-neutral-400">
                            Baños
                          </span>
                          <span className="font-semibold text-[#091e3a]">
                            {spec.bathrooms}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase text-neutral-400">
                            Estacionamiento
                          </span>
                          <span className="font-semibold text-[#091e3a]">
                            {spec.parking}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                        {spec.layoutDetails}
                      </p>

                      {spec.floorplanImageUrl && (
                        <div className="mt-4 overflow-hidden border border-[#eaedf0] bg-white p-2">
                          <img
                            src={spec.floorplanImageUrl}
                            alt={spec.prototypeName}
                            className="h-44 w-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {spec.pdfUrl && (
                      <div className="mt-4 border-t border-[#eaedf0] pt-3">
                        <a
                          href={spec.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 font-outfit text-xs font-semibold uppercase tracking-wider text-[#0077cc] hover:text-[#091e3a]"
                        >
                          <span>Abrir Plano / Ficha Técnica en Drive</span>
                          <span>↗</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Barra Inferior Permanente de Amenidades y Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#eaedf0] pt-5">
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((am) => (
                <span
                  key={am}
                  className="border border-[#091e3a]/20 bg-[#f8f9fa] px-3 py-1 font-outfit text-[11px] font-medium text-[#091e3a]"
                >
                  {am}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={property.driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-[#091e3a] bg-white px-4 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-[#091e3a] hover:bg-[#f2f4f6]"
              >
                Abrir Google Drive Oficial
              </a>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleVisit(property);
                }}
                className="bg-[#091e3a] px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
              >
                Agendar Visita / Carta Oferta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   MODAL DE DETALLE PROFUNDO PARA OPCIONES Y BOTONES INTERACTIVOS
   (Se cierra automáticamente al hacer clic en el vacío / fondo)
============================================================================ */
interface OptionDetailModalProps {
  detail: InteractiveOptionDetail;
  isDarkMode?: boolean;
  onClose: () => void;
  onNavigate?: (section: NavSectionId) => void;
}

export const OptionDetailModal: React.FC<OptionDetailModalProps> = ({
  detail,
  isDarkMode = false,
  onClose,
  onNavigate,
}) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`my-auto w-full max-w-2xl border shadow-2xl ${
          isDarkMode
            ? "border-[#1e2f48] bg-[#0c1524] text-white"
            : "border-[#091e3a] bg-white text-[#091e3a]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/15 bg-[#091e3a] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <AtlasBrandLogo variant="icon" theme="dark" className="h-8 w-8" />
            <div>
              <div className="font-outfit text-[10px] font-semibold uppercase tracking-[0.24em] text-[#00b4f5]">
                {detail.kicker}
              </div>
              <h3 className="font-outfit text-lg font-bold">{detail.title}</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/25 px-3 py-1 font-outfit text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black"
          >
            Cerrar ✕
          </button>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <div className="font-outfit text-xs font-semibold uppercase tracking-wider text-[#755a34]">
              {detail.subtitle}
            </div>
            <p
              className={`mt-2 text-xs leading-relaxed sm:text-sm ${
                isDarkMode ? "text-slate-300" : "text-neutral-600"
              }`}
            >
              {detail.executiveSummary}
            </p>
          </div>

          {detail.keyMetrics.length > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {detail.keyMetrics.map((m) => (
                <div
                  key={m.label}
                  className={`border p-3.5 ${
                    isDarkMode
                      ? "border-slate-800 bg-[#091322]"
                      : "border-[#eaedf0] bg-[#f8f9fa]"
                  }`}
                >
                  <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-400">
                    {m.label}
                  </span>
                  <div className="mt-1 font-outfit text-base font-bold text-[#0077cc]">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h4 className="font-outfit text-xs font-semibold uppercase tracking-[0.2em] text-[#755a34]">
              Alcance Operativo &amp; Especificaciones
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              {detail.bulletPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-[#0077cc]">▪</span>
                  <span
                    className={
                      isDarkMode ? "text-slate-300" : "text-neutral-700"
                    }
                  >
                    {pt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {detail.deliverables.length > 0 && (
            <div
              className={`border p-4 ${
                isDarkMode
                  ? "border-slate-800 bg-[#091322]"
                  : "border-[#eaedf0] bg-[#f8f9fa]"
              }`}
            >
              <div className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#004044]">
                Entregables &amp; Verificación en Plataforma
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {detail.deliverables.map((deliv) => (
                  <span
                    key={deliv}
                    className={`border px-2.5 py-1 font-outfit text-[11px] font-medium ${
                      isDarkMode
                        ? "border-slate-700 bg-[#0c1524] text-slate-200"
                        : "border-[#eaedf0] bg-white text-[#091e3a]"
                    }`}
                  >
                    {deliv}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eaedf0]/30 pt-4">
            <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-400">
              Haz clic en el espacio vacío exterior para cerrar esta ventana
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="border border-current/25 px-4 py-2 font-outfit text-xs uppercase tracking-wider"
              >
                Cerrar
              </button>
              {detail.targetNav && onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    const target = detail.targetNav!;
                    onClose();
                    onNavigate(target);
                  }}
                  className="bg-[#091e3a] px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
                >
                  {detail.actionLabel ?? "Ir al Módulo Operativo"} →
                </button>
              )}
              {detail.externalUrl && (
                <a
                  href={detail.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#755a34] px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#091e3a]"
                >
                  {detail.actionLabel ?? "Abrir Documento Oficial"} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickLeadModalProps {
  properties: AureaProperty[];
  onClose: () => void;
  onAddProspect: (prospect: CrmProspect, hadSecurityAlert: boolean) => void;
  onHoneypotTriggered: () => void;
}

export const QuickLeadModal: React.FC<QuickLeadModalProps> = ({
  properties,
  onClose,
  onAddProspect,
  onHoneypotTriggered,
}) => {
  const [fullName, setFullName] = useState("");
  const [titleOrOffice, setTitleOrOffice] = useState("");
  const [phone, setPhone] = useState("+52 ");
  const [email, setEmail] = useState("");
  const [budgetUsd, setBudgetUsd] = useState(550000);
  const [source, setSource] = useState("Referido Banca Privada");
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [privateNotes, setPrivateNotes] = useState("");
  const [honeypotTrap, setHoneypotTrap] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypotTrap.trim().length > 0) {
      onHoneypotTriggered();
      onClose();
      return;
    }

    const nameSanitized = sanitizeSovereignInput(fullName);
    const notesSanitized = sanitizeSovereignInput(privateNotes);
    const selectedProp =
      properties.find((p) => p.id === propertyId) ?? properties[0];

    const newProspect: CrmProspect = {
      id: `lead-${Date.now()}`,
      fullName: nameSanitized.clean || "Inversionista Confidencial",
      titleOrOffice:
        sanitizeSovereignInput(titleOrOffice).clean || "Family Office",
      phone: phone.replace(/\s+/g, ""),
      email: email.trim(),
      budgetUsd: Number(budgetUsd) || 480000,
      source,
      interestedPropertyId: selectedProp.id,
      interestedPropertyName: selectedProp.name,
      stage: "CONTACTO_INICIAL",
      privateNotes:
        notesSanitized.clean ||
        "Prospecto registrado desde consola ejecutiva Proyecto Atlas.",
      assignedBrokerName: "Andre Fraga",
      createdAtIso: new Date().toISOString().slice(0, 10),
    };

    onAddProspect(
      newProspect,
      nameSanitized.hadInjectionAttempt || notesSanitized.hadInjectionAttempt
    );
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg border border-[#1c1b1a] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#eaedf0] bg-[#091e3a] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <AtlasBrandLogo variant="icon" theme="dark" className="h-9 w-9" />
            <div>
              <span className="font-outfit text-[10px] uppercase tracking-[0.22em] text-[#00c2ff]">
                PROYECTO ATLAS CRM · ESCUDO ACTIVO
              </span>
              <h3 className="font-outfit text-lg font-semibold">
                Registrar Nuevo Prospecto Patrimonial
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/20 px-2.5 py-1 font-outfit text-xs text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 text-xs">
          <input
            type="text"
            name="website_verification_honey"
            value={honeypotTrap}
            onChange={(e) => setHoneypotTrap(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                Nombre del Inversionista *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Lorenzo Zambrano"
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                Fondo / Family Office
              </label>
              <input
                type="text"
                value={titleOrOffice}
                onChange={(e) => setTitleOrOffice(e.target.value)}
                placeholder="Ej. Capital Patrimonial S.A."
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                WhatsApp Directo *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                Correo Confidencial *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="inversionista@familyoffice.com"
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                Presupuesto Estimado (USD)
              </label>
              <input
                type="number"
                step={50000}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-outfit font-semibold focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                Desarrollo de Interés
              </label>
              <select
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-outfit focus:border-[#755a34] focus:bg-white focus:outline-none"
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
              Fuente del Lead
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-outfit focus:border-[#755a34] focus:bg-white focus:outline-none"
            >
              <option value="Referido Banca Privada">
                Referido Banca Privada
              </option>
              <option value="Family Office Directo">
                Family Office Directo
              </option>
              <option value="Broker Aliado Internacional">
                Broker Aliado Internacional
              </option>
              <option value="Showroom Nautica / Hodela">
                Showroom Nautica / Hodela
              </option>
            </select>
          </div>

          <div>
            <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
              Notas de Due Diligence &amp; Esquema de Pago
            </label>
            <textarea
              rows={2}
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Ej. Interesado en esquema 80/20 con 8% de descuento en Nautica Torre B..."
              className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 focus:border-[#755a34] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-[#eaedf0] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#eaedf0] px-4 py-2 font-outfit text-xs uppercase text-neutral-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#091e3a] px-6 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
            >
              Inyectar al Pipeline CRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
