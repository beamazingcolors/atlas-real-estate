import React, { useState } from "react";
import {
  AureaProperty,
  CrmProspect,
  CurrencyCode,
  WhiteLabelConfig,
} from "../types";
import { PHOTO_PRESETS } from "../data/initialData";
import {
  formatSovereignCurrency,
  sanitizeSovereignInput,
} from "../storage/useAureaStorage";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl border border-[#1c1b1a] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eaedf0] bg-[#1c1b1a] px-6 py-4 text-white">
          <div>
            <span className="font-outfit text-[10px] uppercase tracking-[0.22em] text-[#faeedd]">
              AUREA VISUAL CURATION STUDIO
            </span>
            <h3 className="font-outfit text-lg font-semibold">
              Personalizar Fotografía — {property.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/20 px-3 py-1 font-outfit text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black"
          >
            Cerrar ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Vista previa activa */}
          <div className="relative h-52 w-full overflow-hidden border border-[#eaedf0] bg-[#f2f4f6]">
            <img
              src={selectedUrl}
              alt={property.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 font-outfit text-[11px] uppercase tracking-wider text-[#faeedd]">
              Vista Previa en Tiempo Real · Guardado Persistente en LocalStorage
            </div>
          </div>

          {/* 5 Presets Arquitectónicos */}
          <div>
            <label className="block font-outfit text-xs font-semibold uppercase tracking-[0.16em] text-[#1c1b1a]">
              1. Seleccionar Preset Fotográfico de Autor
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
                    <div className="h-16 w-full overflow-hidden bg-[#f2f4f6]">
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-2">
                      <div className="font-outfit text-[11px] font-semibold text-[#000000]">
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
              2. O Ingresar URL de Imagen Personalizada (Alta Resolución)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => {
                  setCustomUrlInput(e.target.value);
                  if (e.target.value.startsWith("http")) {
                    setSelectedUrl(e.target.value);
                  }
                }}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 border border-[#1c1b1a]/30 bg-[#f8f9fa] px-3.5 py-2 text-xs text-black focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#000000] px-5 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#755a34]"
              >
                Aplicar URL
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
              ↺ Restaurar Fotografía Original
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-[#755a34] px-6 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#000000]"
            >
              Listo y Guardar
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
  onClose: () => void;
  onScheduleVisit: (property: AureaProperty) => void;
}

export const PropertyDossierModal: React.FC<DossierModalProps> = ({
  property,
  currency,
  whiteLabel,
  onClose,
  onScheduleVisit,
}) => {
  const imageUrl = property.customImageUrl ?? property.defaultImageUrl;
  const pricePerM2Usd = property.priceUsd / property.areaM2;
  const projected5YValueUsd =
    property.priceUsd * (1 + property.appreciation5YPct / 100);
  const annualYieldUsd = property.priceUsd * (property.roiAnnualPct / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-4xl border border-[#1c1b1a] bg-white shadow-2xl">
        {/* Barra institucional del Dossier */}
        <div className="flex items-center justify-between border-b border-[#755a34]/40 bg-[#000000] px-8 py-5 text-white">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-[#755a34] bg-[#1c1b1a] font-outfit text-sm font-bold tracking-widest text-[#faeedd]">
              {whiteLabel.monogram}
            </div>
            <div>
              <div className="font-outfit text-[10px] uppercase tracking-[0.26em] text-[#faeedd]">
                {whiteLabel.agencyName} · PRIVATE WEALTH DOSSIER
              </div>
              <h2 className="font-outfit text-xl font-semibold tracking-tight">
                {property.name} ({property.code})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="border border-[#755a34] bg-[#755a34] px-4 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#5e4728]"
            >
              ⎙ Imprimir / Exportar Dossier PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-white/30 px-3.5 py-2 font-outfit text-xs uppercase text-white hover:bg-white hover:text-black"
            >
              Cerrar ✕
            </button>
          </div>
        </div>

        {/* Contenido Editorial del Dossier */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 overflow-hidden border border-[#eaedf0]">
              <img
                src={imageUrl}
                alt={property.name}
                className="h-72 w-full object-cover"
              />
            </div>

            <div className="col-span-5 flex flex-col justify-between border border-[#eaedf0] bg-[#f8f9fa] p-6">
              <div>
                <span className="inline-block bg-[#faeedd] px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-widest text-[#755a34]">
                  {property.zone} · {property.deliveryStatus}
                </span>
                <h3 className="mt-3 font-outfit text-2xl font-bold text-black">
                  {formatSovereignCurrency(property.priceUsd, currency)}
                </h3>
                <p className="mt-1 font-outfit text-xs text-neutral-500">
                  Valor por m²: {formatSovereignCurrency(pricePerM2Usd, currency)} / m²
                </p>
                <p className="mt-4 text-xs leading-relaxed text-neutral-700">
                  {property.architecturalDigest}
                </p>
              </div>

              <div className="border-t border-[#eaedf0] pt-4">
                <div className="font-outfit text-[11px] font-semibold uppercase tracking-wider text-[#004044]">
                  Desarrollador: {property.developerName}
                </div>
                <div className="mt-1 text-xs text-neutral-600">
                  Tipología: {property.typologies}
                </div>
              </div>
            </div>
          </div>

          {/* Matriz Financiera del Dossier */}
          <div className="grid grid-cols-4 gap-4 border border-[#eaedf0] bg-[#f2f4f6] p-5">
            <div className="bg-white p-4 border border-[#eaedf0]">
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

            <div className="bg-white p-4 border border-[#eaedf0]">
              <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                Valor Proyectado (5 Años)
              </span>
              <div className="mt-1 font-outfit text-xl font-bold text-black">
                {formatSovereignCurrency(projected5YValueUsd, currency, true)}
              </div>
              <span className="text-[11px] text-[#755a34]">
                +{property.appreciation5YPct}% Plusvalía Acumulada
              </span>
            </div>

            <div className="bg-white p-4 border border-[#eaedf0]">
              <span className="font-outfit text-[10px] uppercase tracking-wider text-neutral-500">
                Superficie & Programa
              </span>
              <div className="mt-1 font-outfit text-xl font-bold text-black">
                {property.areaM2} m²
              </div>
              <span className="text-[11px] text-neutral-500">
                {property.bedrooms} Recámaras · {property.bathrooms} Baños
              </span>
            </div>

            <div className="bg-white p-4 border border-[#eaedf0]">
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

          {/* Amenidades y Acciones */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#eaedf0] pt-4">
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((am) => (
                <span
                  key={am}
                  className="border border-[#1c1b1a]/20 bg-[#f8f9fa] px-3 py-1 font-outfit text-[11px] font-medium text-[#1c1b1a]"
                >
                  ✦ {am}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <a
                href={property.driveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="border border-[#1c1b1a] bg-white px-4 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#f2f4f6]"
              >
                📂 Abrir Google Drive Oficial
              </a>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onScheduleVisit(property);
                }}
                className="bg-[#000000] px-5 py-2.5 font-outfit text-xs font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#755a34]"
              >
                Agendar Visita Privada VIP
              </button>
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
  const [budgetUsd, setBudgetUsd] = useState(3500000);
  const [source, setSource] = useState("Referido Banca Privada");
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [privateNotes, setPrivateNotes] = useState("");
  // Trampa Honeypot invisible para bots
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
      titleOrOffice: sanitizeSovereignInput(titleOrOffice).clean || "Family Office",
      phone: phone.replace(/\s+/g, ""),
      email: email.trim(),
      budgetUsd: Number(budgetUsd) || 2500000,
      source,
      interestedPropertyId: selectedProp.id,
      interestedPropertyName: selectedProp.name,
      stage: "CONTACTO_INICIAL",
      privateNotes:
        notesSanitized.clean ||
        "Prospecto registrado desde consola ejecutiva AUREA.",
      assignedBrokerName: "Alexis Garzón",
      createdAtIso: new Date().toISOString().slice(0, 10),
    };

    onAddProspect(
      newProspect,
      nameSanitized.hadInjectionAttempt || notesSanitized.hadInjectionAttempt
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg border border-[#1c1b1a] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eaedf0] bg-[#000000] px-6 py-4 text-white">
          <div>
            <span className="font-outfit text-[10px] uppercase tracking-[0.22em] text-[#faeedd]">
              AUREA PRIVATE CRM · ESCUDO ACTIVO
            </span>
            <h3 className="font-outfit text-lg font-semibold">
              Registrar Nuevo Prospecto Patrimonial
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/20 px-2.5 py-1 font-outfit text-xs text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Honeypot invisible para bots */}
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
                step={100000}
                value={budgetUsd}
                onChange={(e) => setBudgetUsd(Number(e.target.value))}
                className="mt-1 w-full border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-outfit font-semibold focus:border-[#755a34] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
                Propiedad de Interés
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
              <option value="Referido Banca Privada">Referido Banca Privada</option>
              <option value="Family Office Directo">Family Office Directo</option>
              <option value="Broker Aliado Internacional">Broker Aliado Internacional</option>
              <option value="Evento Privado Puerto Cancún">Evento Privado Puerto Cancún</option>
            </select>
          </div>

          <div>
            <label className="block font-outfit text-[11px] font-semibold uppercase text-[#1c1b1a]">
              Notas de Due Diligence
            </label>
            <textarea
              rows={2}
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
              placeholder="Requerimientos de fideicomiso, amarre de yate o esquema de pagos..."
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
              className="bg-[#000000] px-6 py-2 font-outfit text-xs font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#755a34]"
            >
              Inyectar al Pipeline CRM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
