import React, { useMemo, useState } from "react";
import {
  AureaProperty,
  ClientSegmentTag,
  CrmProspect,
  CrmStageKey,
  CurrencyCode,
  PrivateClient,
} from "../types";
import {
  formatSovereignCurrency,
  sanitizeSovereignInput,
  usePersistentState,
} from "../storage/useAureaStorage";

const CRM_STAGE_META: {
  key: CrmStageKey;
  label: string;
  stepNumber: string;
  accent: string;
}[] = [
  {
    key: "CONTACTO_INICIAL",
    label: "Contacto Inicial",
    stepNumber: "01",
    accent: "border-[#eaedf0] bg-[#f8f9fa]",
  },
  {
    key: "CALIFICACION_PATRIMONIAL",
    label: "Calificación Patrimonial",
    stepNumber: "02",
    accent: "border-[#faeedd] bg-[#faeedd]/35",
  },
  {
    key: "ENVIO_PORTAFOLIO",
    label: "Envío de Portafolio",
    stepNumber: "03",
    accent: "border-[#eaedf0] bg-[#f8f9fa]",
  },
  {
    key: "RECORRIDO_PRESENCIAL",
    label: "Recorrido Presencial",
    stepNumber: "04",
    accent: "border-[#755a34]/30 bg-[#faeedd]/45",
  },
  {
    key: "NEGOCIACION_OFERTA",
    label: "Negociación de Oferta",
    stepNumber: "05",
    accent: "border-[#004044]/30 bg-[#004044]/5",
  },
  {
    key: "FIRMA_NOTARIAL",
    label: "Firma Notarial",
    stepNumber: "06",
    accent: "border-[#000000] bg-[#1c1b1a]/[0.03]",
  },
];

interface CrmPipelineViewProps {
  prospects: CrmProspect[];
  currency: CurrencyCode;
  onUpdateStage: (prospectId: string, newStage: CrmStageKey) => void;
  onUpdateNotes: (prospectId: string, notes: string) => void;
  onOpenNewLeadModal: () => void;
}

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  prospects,
  currency,
  onUpdateStage,
  onUpdateNotes,
  onOpenNewLeadModal,
}) => {
  const [stageFilter, setStageFilter] = useState<CrmStageKey | "TODOS">("TODOS");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>("");

  const totalPipelineUsd = useMemo(
    () => prospects.reduce((acc, p) => acc + p.budgetUsd, 0),
    [prospects]
  );

  const buildWhatsAppLink = (prospect: CrmProspect) => {
    const cleanDigits = prospect.phone.replace(/[^\d]/g, "");
    const message = `Estimado/a ${prospect.fullName} (${prospect.titleOrOffice}), le saluda la Dirección Patrimonial de AUREA Sovereign Architecture. En seguimiento a su interés en *${prospect.interestedPropertyName}*, hemos preparado el dossier técnico actualizado, corrida de retorno patrimonial y disponibilidad oficial para coordinar su revisión privada. ¿Le resulta conveniente una breve llamada ejecutiva hoy?`;
    return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
  };

  const visibleStages =
    stageFilter === "TODOS"
      ? CRM_STAGE_META
      : CRM_STAGE_META.filter((s) => s.key === stageFilter);

  return (
    <div className="space-y-6">
      {/* Header del CRM */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            MÓDULO D · PRIVATE WEALTH DEALFLOW
          </span>
          <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-black">
            CRM Inmobiliario & Pipeline de 6 Fases
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Seguimiento integral de inversionistas UHNWI, notas confidenciales y enlace directo con protocolo WhatsApp institucional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-4 py-2">
            <span className="block font-['Outfit'] text-[10px] uppercase tracking-wider text-neutral-500">
              Valor Total en Pipeline
            </span>
            <span className="font-['Outfit'] text-base font-semibold text-black">
              {formatSovereignCurrency(totalPipelineUsd, currency, true)}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenNewLeadModal}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1c1b1a]"
          >
            <span className="material-symbols-outlined text-[16px] text-[#faeedd]">
              person_add
            </span>
            Nuevo Prospecto VIP
          </button>
        </div>
      </div>

      {/* Selector de etapa rápido */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStageFilter("TODOS")}
          className={`rounded-lg border px-3 py-1.5 font-['Outfit'] text-xs font-medium transition ${
            stageFilter === "TODOS"
              ? "border-black bg-black text-white"
              : "border-[#eaedf0] bg-white text-neutral-700 hover:border-neutral-300"
          }`}
        >
          Todas las Etapas ({prospects.length})
        </button>
        {CRM_STAGE_META.map((stage) => {
          const count = prospects.filter((p) => p.stage === stage.key).length;
          return (
            <button
              key={stage.key}
              type="button"
              onClick={() => setStageFilter(stage.key)}
              className={`rounded-lg border px-3 py-1.5 font-['Outfit'] text-xs font-medium transition ${
                stageFilter === stage.key
                  ? "border-[#755a34] bg-[#755a34] text-white"
                  : "border-[#eaedf0] bg-white text-neutral-700 hover:border-neutral-300"
              }`}
            >
              {stage.stepNumber}. {stage.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Kanban de 6 columnas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleStages.map((stage) => {
          const stageItems = prospects.filter((p) => p.stage === stage.key);
          const stageSumUsd = stageItems.reduce((acc, p) => acc + p.budgetUsd, 0);

          return (
            <div
              key={stage.key}
              className={`flex flex-col rounded-xl border p-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)] ${stage.accent}`}
            >
              <div className="mb-4 flex items-center justify-between border-b border-[#eaedf0] pb-3">
                <div>
                  <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#755a34]">
                    FASE {stage.stepNumber}
                  </span>
                  <h3 className="font-['Outfit'] text-sm font-semibold text-black">
                    {stage.label}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-full bg-black px-2.5 py-0.5 font-['Outfit'] text-[11px] font-semibold text-white">
                    {stageItems.length}
                  </span>
                  <span className="mt-0.5 block font-['Outfit'] text-[11px] text-neutral-600">
                    {formatSovereignCurrency(stageSumUsd, currency, true)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {stageItems.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-6 text-center text-xs text-neutral-400">
                    Sin expedientes activos en esta fase
                  </div>
                ) : (
                  stageItems.map((prospect) => {
                    const isEditing = editingNoteId === prospect.id;
                    return (
                      <div
                        key={prospect.id}
                        className="rounded-xl border border-[#eaedf0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#755a34]/50"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-['Outfit'] text-sm font-semibold text-black">
                              {prospect.fullName}
                            </h4>
                            <p className="text-[11px] font-medium text-[#755a34]">
                              {prospect.titleOrOffice}
                            </p>
                          </div>
                          <span className="rounded-md bg-[#faeedd] px-2 py-0.5 font-['Outfit'] text-[11px] font-semibold text-[#755a34]">
                            {formatSovereignCurrency(
                              prospect.budgetUsd,
                              currency,
                              true
                            )}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 border-t border-[#eaedf0] pt-2.5 text-xs text-neutral-600">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Activo:</span>
                            <span className="font-medium text-black">
                              {prospect.interestedPropertyName}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Origen Lead:</span>
                            <span>{prospect.source}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-400">Advisor:</span>
                            <span>{prospect.assignedBrokerName}</span>
                          </div>
                        </div>

                        {/* Notas privadas */}
                        <div className="mt-3 rounded-lg bg-[#f8f9fa] p-2.5">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                              Notas Privadas
                            </span>
                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(prospect.id);
                                  setNoteDraft(prospect.privateNotes);
                                }}
                                className="text-[11px] font-medium text-[#755a34] hover:underline"
                              >
                                Editar
                              </button>
                            )}
                          </div>
                          {isEditing ? (
                            <div className="space-y-2">
                              <textarea
                                rows={2}
                                value={noteDraft}
                                onChange={(e) => setNoteDraft(e.target.value)}
                                className="w-full rounded border border-neutral-300 bg-white p-1.5 text-xs text-black focus:border-black focus:outline-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(null)}
                                  className="rounded px-2 py-1 text-[11px] text-neutral-500 hover:bg-neutral-200"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const { clean } = sanitizeSovereignInput(noteDraft);
                                    onUpdateNotes(prospect.id, clean);
                                    setEditingNoteId(null);
                                  }}
                                  className="rounded bg-black px-2.5 py-1 text-[11px] font-medium text-white"
                                >
                                  Guardar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs leading-relaxed text-neutral-700">
                              {prospect.privateNotes}
                            </p>
                          )}
                        </div>

                        {/* Controles de Fase + WhatsApp */}
                        <div className="mt-3 flex flex-col gap-2 pt-1">
                          <select
                            aria-label={`Cambiar fase para ${prospect.fullName}`}
                            value={prospect.stage}
                            onChange={(e) =>
                              onUpdateStage(
                                prospect.id,
                                e.target.value as CrmStageKey
                              )
                            }
                            className="w-full rounded-lg border border-[#eaedf0] bg-[#f2f4f6] px-2.5 py-1.5 font-['Outfit'] text-xs font-medium text-black focus:border-black focus:outline-none"
                          >
                            {CRM_STAGE_META.map((opt) => (
                              <option key={opt.key} value={opt.key}>
                                Mover a: {opt.stepNumber}. {opt.label}
                              </option>
                            ))}
                          </select>

                          <a
                            href={buildWhatsAppLink(prospect)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#004044] px-3 py-2 font-['Outfit'] text-xs font-semibold text-white transition hover:bg-[#002f32]"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              chat
                            </span>
                            WhatsApp Pre-Redactado VIP
                          </a>
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
  );
};

/* ============================================================================
 * E. GESTOR DE CLIENTES & SELECCIONES PRIVADAS
 * ========================================================================== */

interface ClientManagerViewProps {
  clients: PrivateClient[];
  properties: AureaProperty[];
  currency: CurrencyCode;
  onUpdateClientTag: (clientId: string, tag: ClientSegmentTag) => void;
  onToggleClientProperty: (clientId: string, propertyId: string) => void;
  onOpenDossier: (property: AureaProperty) => void;
}

const CLIENT_TAGS: ClientSegmentTag[] = [
  "Family Office",
  "Inversionista Fondo",
  "Segunda Residencia",
  "Comprador Final",
];

export const ClientManagerView: React.FC<ClientManagerViewProps> = ({
  clients,
  properties,
  currency,
  onUpdateClientTag,
  onToggleClientProperty,
  onOpenDossier,
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<
    ClientSegmentTag | "TODOS"
  >("TODOS");
  const [activeClientId, setActiveClientId] = useState<string>(
    clients[0]?.id ?? ""
  );
  const [copiedClientLink, setCopiedClientLink] = useState<string | null>(null);

  const filteredClients = useMemo(
    () =>
      selectedTagFilter === "TODOS"
        ? clients
        : clients.filter((c) => c.tag === selectedTagFilter),
    [clients, selectedTagFilter]
  );

  const activeClient =
    clients.find((c) => c.id === activeClientId) ?? filteredClients[0];

  const handleCopyShareLink = (client: PrivateClient) => {
    const slug = client.entityName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const shareUrl = `${window.location.origin}/?vault=${slug}&assets=${client.curatedPropertyIds.length}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).catch(() => {});
    }
    setCopiedClientLink(shareUrl);
    setTimeout(() => setCopiedClientLink(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            MÓDULO E · CLIENTES PATRIMONIALES & FAMILY OFFICES
          </span>
          <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-black">
            Gestor de Clientes & Selecciones Privadas
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Segmentación institucional y curaduría de portafolios a medida ("Selección Exclusiva para el Cliente").
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTagFilter("TODOS")}
            className={`rounded-lg border px-3 py-1.5 font-['Outfit'] text-xs font-medium transition ${
              selectedTagFilter === "TODOS"
                ? "border-black bg-black text-white"
                : "border-[#eaedf0] bg-[#f8f9fa] text-neutral-700"
            }`}
          >
            Todos ({clients.length})
          </button>
          {CLIENT_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTagFilter(tag)}
              className={`rounded-lg border px-3 py-1.5 font-['Outfit'] text-xs font-medium transition ${
                selectedTagFilter === tag
                  ? "border-[#755a34] bg-[#755a34] text-white"
                  : "border-[#eaedf0] bg-[#f8f9fa] text-neutral-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Lista de clientes a la izquierda */}
        <div className="space-y-3 lg:col-span-5">
          {filteredClients.map((client) => {
            const isSelected = activeClient?.id === client.id;
            return (
              <div
                key={client.id}
                onClick={() => setActiveClientId(client.id)}
                className={`cursor-pointer rounded-xl border p-5 transition ${
                  isSelected
                    ? "border-black bg-[#1c1b1a] text-white shadow-md"
                    : "border-[#eaedf0] bg-white text-black hover:border-[#755a34]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider ${
                        isSelected
                          ? "bg-[#755a34] text-[#faeedd]"
                          : "bg-[#faeedd] text-[#755a34]"
                      }`}
                    >
                      {client.tag}
                    </span>
                    <h3 className="mt-2 font-['Outfit'] text-base font-semibold">
                      {client.name}
                    </h3>
                    <p
                      className={`text-xs ${
                        isSelected ? "text-neutral-300" : "text-neutral-500"
                      }`}
                    >
                      {client.entityName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`block font-['Outfit'] text-[10px] uppercase ${
                        isSelected ? "text-neutral-400" : "text-neutral-400"
                      }`}
                    >
                      Capital Asignado
                    </span>
                    <span className="font-['Outfit'] text-sm font-semibold text-[#d9b88c]">
                      {formatSovereignCurrency(
                        client.aumAllocatedUsd,
                        currency,
                        true
                      )}
                    </span>
                  </div>
                </div>

                <p
                  className={`mt-3 text-xs leading-relaxed ${
                    isSelected ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {client.advisorNotes}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px]">
                  <span>
                    Activos en Selección:{" "}
                    <strong>{client.curatedPropertyIds.length}</strong>
                  </span>
                  <span>Último contacto: {client.lastContactDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Panel de Selección Exclusiva del Cliente a la derecha */}
        <div className="lg:col-span-7">
          {activeClient ? (
            <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col gap-4 border-b border-[#eaedf0] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                    COLECCIÓN PRIVADA CURADA
                  </span>
                  <h2 className="mt-1 font-['Outfit'] text-xl font-semibold text-black">
                    Selección Exclusiva para {activeClient.name}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {activeClient.entityName} · {activeClient.email}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Cambiar etiqueta del cliente"
                    value={activeClient.tag}
                    onChange={(e) =>
                      onUpdateClientTag(
                        activeClient.id,
                        e.target.value as ClientSegmentTag
                      )
                    }
                    className="rounded-lg border border-[#eaedf0] bg-[#f2f4f6] px-3 py-2 font-['Outfit'] text-xs font-medium text-black"
                  >
                    {CLIENT_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        Etiqueta: {tag}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleCopyShareLink(activeClient)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 font-['Outfit'] text-xs font-semibold text-white transition hover:bg-[#755a34]"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      share
                    </span>
                    Compartir Enlace Privado
                  </button>
                </div>
              </div>

              {copiedClientLink && (
                <div className="mt-4 flex items-center justify-between rounded-lg border border-[#004044]/30 bg-[#004044]/5 px-4 py-2.5 text-xs text-[#004044]">
                  <span>
                    Enlace de bóveda copiado al portapapeles:{" "}
                    <code className="font-mono font-semibold">
                      {copiedClientLink}
                    </code>
                  </span>
                  <span className="font-['Outfit'] font-semibold uppercase">
                    Cifrado Activo
                  </span>
                </div>
              )}

              {/* Activos actualmente incluidos en la selección del cliente */}
              <div className="mt-5">
                <h3 className="font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Activos Asignados a la Propuesta ({activeClient.curatedPropertyIds.length})
                </h3>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {properties.map((prop) => {
                    const isIncluded = activeClient.curatedPropertyIds.includes(
                      prop.id
                    );
                    const displayImg = prop.customImageUrl || prop.defaultImageUrl;

                    return (
                      <div
                        key={prop.id}
                        className={`flex flex-col justify-between rounded-xl border p-3.5 transition ${
                          isIncluded
                            ? "border-[#755a34] bg-[#faeedd]/25"
                            : "border-[#eaedf0] bg-[#f8f9fa] opacity-80"
                        }`}
                      >
                        <div className="flex gap-3">
                          <img
                            src={displayImg}
                            alt={prop.name}
                            className="h-16 w-20 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
                              {prop.zone}
                            </span>
                            <h4 className="truncate font-['Outfit'] text-sm font-semibold text-black">
                              {prop.name}
                            </h4>
                            <p className="font-['Outfit'] text-xs font-medium text-neutral-700">
                              {formatSovereignCurrency(
                                prop.priceUsd,
                                currency,
                                true
                              )}{" "}
                              · ROI {prop.roiAnnualPct}%
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-[#eaedf0] pt-2.5">
                          <button
                            type="button"
                            onClick={() => onOpenDossier(prop)}
                            className="font-['Outfit'] text-[11px] font-medium text-neutral-600 hover:text-black hover:underline"
                          >
                            Exportar Propuesta
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onToggleClientProperty(activeClient.id, prop.id)
                            }
                            className={`rounded-md px-2.5 py-1 font-['Outfit'] text-[11px] font-semibold transition ${
                              isIncluded
                                ? "bg-black text-white hover:bg-neutral-800"
                                : "border border-neutral-300 bg-white text-black hover:border-black"
                            }`}
                          >
                            {isIncluded ? "En Selección ✓" : "+ Incluir Activo"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * F. CALCULADORA FINANCIERA DE INVERSIÓN INMOBILIARIA & ROI
 * ========================================================================== */

interface FinancialCalculatorViewProps {
  properties: AureaProperty[];
  currency: CurrencyCode;
}

export const FinancialCalculatorView: React.FC<FinancialCalculatorViewProps> = ({
  properties,
  currency,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties[0]?.id ?? ""
  );
  const [acquisitionPriceUsd, setAcquisitionPriceUsd] = useState<number>(
    properties[0]?.priceUsd ?? 4920000
  );
  const [downPaymentPct, setDownPaymentPct] = useState<number>(30);
  const [occupancyPct, setOccupancyPct] = useState<number>(74);
  const [adrUsd, setAdrUsd] = useState<number>(2450);
  const [managementFeePct, setManagementFeePct] = useState<number>(18);
  const [monthlyMaintenanceUsd, setMonthlyMaintenanceUsd] = useState<number>(
    properties[0]?.maintenanceMonthlyUsd ?? 1420
  );

  const handleSelectPresetProperty = (propId: string) => {
    setSelectedPropertyId(propId);
    const found = properties.find((p) => p.id === propId);
    if (found) {
      setAcquisitionPriceUsd(found.priceUsd);
      setMonthlyMaintenanceUsd(found.maintenanceMonthlyUsd);
      setAdrUsd(Math.round((found.priceUsd * (found.roiAnnualPct / 100)) / 240));
    }
  };

  const metrics = useMemo(() => {
    const downPaymentUsd = acquisitionPriceUsd * (downPaymentPct / 100);
    const financedBalanceUsd = acquisitionPriceUsd - downPaymentUsd;
    const occupiedNightsYear = Math.round(365 * (occupancyPct / 100));
    const grossAnnualRentalUsd = occupiedNightsYear * adrUsd;
    const managementCostAnnualUsd =
      grossAnnualRentalUsd * (managementFeePct / 100);
    const annualMaintenanceUsd = monthlyMaintenanceUsd * 12;
    const netAnnualCashFlowUsd =
      grossAnnualRentalUsd - managementCostAnnualUsd - annualMaintenanceUsd;
    const netCapRatePct =
      acquisitionPriceUsd > 0
        ? (netAnnualCashFlowUsd / acquisitionPriceUsd) * 100
        : 0;
    const paybackYears =
      netAnnualCashFlowUsd > 0
        ? acquisitionPriceUsd / netAnnualCashFlowUsd
        : 0;
    const appreciation5YUsd = acquisitionPriceUsd * 1.52;

    return {
      downPaymentUsd,
      financedBalanceUsd,
      occupiedNightsYear,
      grossAnnualRentalUsd,
      managementCostAnnualUsd,
      annualMaintenanceUsd,
      netAnnualCashFlowUsd,
      netCapRatePct,
      paybackYears,
      appreciation5YUsd,
    };
  }, [
    acquisitionPriceUsd,
    downPaymentPct,
    occupancyPct,
    adrUsd,
    managementFeePct,
    monthlyMaintenanceUsd,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            MÓDULO F · UNDERWRITING PATRIMONIAL & CAP RATE
          </span>
          <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-black">
            Calculadora Financiera de Inversión Inmobiliaria
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Simulación dinámica de flujo de caja anual, ADR vacacional, costos operativos y recuperación de capital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-['Outfit'] text-xs text-neutral-500">
            Cargar activo base:
          </span>
          <select
            value={selectedPropertyId}
            onChange={(e) => handleSelectPresetProperty(e.target.value)}
            className="rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-['Outfit'] text-xs font-semibold text-black"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatSovereignCurrency(p.priceUsd, currency, true)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Controles deslizantes */}
        <div className="space-y-5 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:col-span-6">
          <h2 className="font-['Outfit'] text-sm font-semibold uppercase tracking-wider text-black">
            Parámetros de Adquisición y Operación
          </h2>

          {/* Precio de Adquisición */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-neutral-600">
                Precio de Adquisición
              </span>
              <span className="font-['Outfit'] font-semibold text-black">
                {formatSovereignCurrency(acquisitionPriceUsd, currency)}
              </span>
            </div>
            <input
              type="range"
              min={800000}
              max={12000000}
              step={50000}
              value={acquisitionPriceUsd}
              onChange={(e) => setAcquisitionPriceUsd(Number(e.target.value))}
              className="mt-2 w-full accent-black"
            />
          </div>

          {/* Esquema de Enganche */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-neutral-600">
                Esquema de Enganche ({downPaymentPct}%)
              </span>
              <span className="font-['Outfit'] font-semibold text-[#755a34]">
                {formatSovereignCurrency(metrics.downPaymentUsd, currency)}
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={90}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="mt-2 w-full accent-[#755a34]"
            />
          </div>

          {/* Ocupación Anual Estimada */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-neutral-600">
                Ocupación Estimada Anual
              </span>
              <span className="font-['Outfit'] font-semibold text-black">
                {occupancyPct}% ({metrics.occupiedNightsYear} noches/año)
              </span>
            </div>
            <input
              type="range"
              min={35}
              max={95}
              step={1}
              value={occupancyPct}
              onChange={(e) => setOccupancyPct(Number(e.target.value))}
              className="mt-2 w-full accent-black"
            />
          </div>

          {/* Tarifa Promedio por Noche (ADR) */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-neutral-600">
                Tarifa Promedio por Noche (ADR Luxury)
              </span>
              <span className="font-['Outfit'] font-semibold text-black">
                {formatSovereignCurrency(adrUsd, currency)} / noche
              </span>
            </div>
            <input
              type="range"
              min={450}
              max={6500}
              step={50}
              value={adrUsd}
              onChange={(e) => setAdrUsd(Number(e.target.value))}
              className="mt-2 w-full accent-black"
            />
          </div>

          {/* Costo de Administración Vacacional */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-neutral-600">
                Administración de Rentas Vacacionales (Hospitality Fee)
              </span>
              <span className="font-['Outfit'] font-semibold text-black">
                {managementFeePct}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={35}
              step={1}
              value={managementFeePct}
              onChange={(e) => setManagementFeePct(Number(e.target.value))}
              className="mt-2 w-full accent-[#755a34]"
            />
          </div>

          {/* Mantenimiento HOA Mensual */}
          <div>
            <div className="flex justify-between text-xs">
              <span className="font-medium text-neutral-600">
                Mantenimiento & Concierge Mensual (HOA)
              </span>
              <span className="font-['Outfit'] font-semibold text-black">
                {formatSovereignCurrency(monthlyMaintenanceUsd, currency)} / mes
              </span>
            </div>
            <input
              type="range"
              min={400}
              max={4500}
              step={50}
              value={monthlyMaintenanceUsd}
              onChange={(e) => setMonthlyMaintenanceUsd(Number(e.target.value))}
              className="mt-2 w-full accent-black"
            />
          </div>
        </div>

        {/* Resultados Financieros */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-xl bg-[#1c1b1a] p-6 text-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d9b88c]">
              DICTAMEN DE RENDIMIENTO PATRIMONIAL
            </span>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <span className="block font-['Outfit'] text-[11px] uppercase text-neutral-400">
                  Cap Rate Neto Anual
                </span>
                <span className="mt-1 block font-['Outfit'] text-2xl font-bold text-[#faeedd]">
                  {metrics.netCapRatePct.toFixed(2)}%
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <span className="block font-['Outfit'] text-[11px] uppercase text-neutral-400">
                  Flujo de Caja Neto / Año
                </span>
                <span className="mt-1 block font-['Outfit'] text-xl font-bold text-emerald-400">
                  {formatSovereignCurrency(
                    metrics.netAnnualCashFlowUsd,
                    currency,
                    true
                  )}
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-black/40 p-4">
                <span className="block font-['Outfit'] text-[11px] uppercase text-neutral-400">
                  Recuperación (Payback)
                </span>
                <span className="mt-1 block font-['Outfit'] text-2xl font-bold text-white">
                  {metrics.paybackYears > 0
                    ? `${metrics.paybackYears.toFixed(1)} años`
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 border-t border-white/10 pt-4 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">
                  Ingreso Bruto Anual ({metrics.occupiedNightsYear} noches):
                </span>
                <span className="font-['Outfit'] font-semibold text-white">
                  {formatSovereignCurrency(
                    metrics.grossAnnualRentalUsd,
                    currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">
                  (-) Fee Operador Hotelero ({managementFeePct}%):
                </span>
                <span className="font-['Outfit'] text-rose-300">
                  -
                  {formatSovereignCurrency(
                    metrics.managementCostAnnualUsd,
                    currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">
                  (-) Cuota Mantenimiento Anualizada:
                </span>
                <span className="font-['Outfit'] text-rose-300">
                  -
                  {formatSovereignCurrency(
                    metrics.annualMaintenanceUsd,
                    currency
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                <span className="font-['Outfit'] font-semibold text-[#faeedd]">
                  Valor Proyectado del Inmueble a 5 Años (+52%):
                </span>
                <span className="font-['Outfit'] font-bold text-[#faeedd]">
                  {formatSovereignCurrency(metrics.appreciation5YUsd, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Desglose de Estructura de Capital */}
          <div className="rounded-xl border border-[#eaedf0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
            <h3 className="font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-black">
              Estructura de Liquidación & Fideicomiso
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg bg-[#f8f9fa] p-3">
                <span className="text-neutral-500">
                  Aportación Inicial ({downPaymentPct}%)
                </span>
                <p className="mt-1 font-['Outfit'] text-base font-semibold text-black">
                  {formatSovereignCurrency(metrics.downPaymentUsd, currency)}
                </p>
              </div>
              <div className="rounded-lg bg-[#f8f9fa] p-3">
                <span className="text-neutral-500">
                  Saldo Contra Avance / Escritura
                </span>
                <p className="mt-1 font-['Outfit'] text-base font-semibold text-black">
                  {formatSovereignCurrency(
                    metrics.financedBalanceUsd,
                    currency
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * G. ATLAS COPILOT (IA COMERCIAL INMOBILIARIA)
 * ========================================================================== */

interface CopilotMessage {
  id: string;
  role: "assistant" | "user";
  title?: string;
  text: string;
  timestamp: string;
}

const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: "cop-welcome",
    role: "assistant",
    title: "Atlas Copilot · Private Wealth Legal & Fiscal Intelligence",
    text: "Bienvenido al motor jurídico-comercial de AUREA Sovereign Architecture. Estoy entrenado en estructuración de Fideicomisos en Zona Restringida (Art. 27 Constitucional), cálculo de gastos de escrituración en Quintana Roo, normativas fiscales (ISR, IVA, retenciones a residentes en el extranjero) y argumentos de cierre para los 14 desarrollos en cartera.",
    timestamp: "09:00 HRS",
  },
];

const KNOWLEDGE_TOPICS = [
  {
    id: "fideicomiso",
    label: "Fideicomiso Zona Restringida (Extranjeros)",
    question:
      "¿Cómo funciona el Fideicomiso Bancario en Zona Restringida para un comprador extranjero en Cancún?",
    answer:
      "Conforme al Artículo 27 Constitucional y la Ley de Inversión Extranjera, la franja de 50 km de playa ('Zona Restringida') se adquiere mediante un **Fideicomiso Traslativo de Dominio** con vigencia de 50 años renovables. El banco fiduciario (ej. Actinver, Monex, Banorte) detenta la titularidad registral mientras el inversionista extranjero (Fideicomisario) conserva el 100% de los derechos de uso, goce, arrendamiento, herencia libre de juicio sucesorio y venta con plusvalía. El permiso SRE y apertura tienen un costo promedio de $2,200 a $2,800 USD y una anualidad fiduciaria de ~$550 USD.",
  },
  {
    id: "escrituracion",
    label: "Costos de Escrituración y Cierre Notarial",
    question:
      "¿Cuál es el desglose de gastos de escrituración e ISAI en Cancún y Riviera Maya?",
    answer:
      "En el municipio de Benito Juárez (Cancún) y Solidaridad (Playa del Carmen), los costos de cierre notarial oscilan entre el **5.5% y el 7.0%** del valor de operación: incluye el Impuesto Sobre Adquisición de Inmuebles (ISAI ~3%), derechos de Registro Público de la Propiedad (~0.8%), certificados de libertad de gravamen y no adeudo predial, más honorarios de Notario Público y avalúo catastral.",
  },
  {
    id: "fiscal",
    label: "Normativa Fiscal (ISR, IVA y Retenciones)",
    question:
      "¿Qué impuestos aplican sobre rentas vacacionales y enajenación (ISR / IVA / Retenciones)?",
    answer:
      "1) **Adquisición Habitacional**: La compraventa de casa habitación está exenta de IVA (Art. 9 LIVA). Si es penthouse con componente comercial/hotelero amueblado, puede desglosarse el equipamiento.\n2) **Ingresos por Arrendamiento**: Para residentes en el extranjero sin establecimiento permanente en México, la retención definitiva de ISR es del **25% sobre el ingreso bruto**, o bien pueden optar por constituir una SAPI de CV mexicana o fideicomiso empresarial para tributar sobre utilidad neta (deduciendo mantenimiento, predial, depreciación del 5% anual y comisión de administración).\n3) **ISR por Enajenación (Venta futura)**: 35% sobre la ganancia neta (con derecho a deducir costo comprobado de adquisición actualizado por inflación, mejoras y gastos notariales) o 25% sobre el valor total sin deducciones.",
  },
  {
    id: "contratos",
    label: "Blindaje de Contratos de Preventa (NOM-247)",
    question:
      "¿Qué cláusulas protegen al inversionista en contratos de preventa bajo la NOM-247-SE-2021?",
    answer:
      "Todos los desarrollos auditados en AUREA cumplen con la **NOM-247-SE-2021**: cuentan con Licencia de Construcción vigente, Fideicomiso Maestro de Administración, póliza de garantía por vicios ocultos (5 años en estructura, 3 años en impermeabilización) y cláusula de penalización simétrica en caso de demora en la fecha de entrega física.",
  },
];

export const AtlasCopilotView: React.FC = () => {
  const [messages, setMessages] = usePersistentState<CopilotMessage[]>(
    "aurea_copilot_history_v1",
    INITIAL_COPILOT_MESSAGES
  );
  const [inputQuery, setInputQuery] = useState("");

  const generateAdvisorResponse = (queryText: string) => {
    const q = queryText.toLowerCase();
    if (q.includes("fideicomiso") || q.includes("extranjero") || q.includes("sre")) {
      return KNOWLEDGE_TOPICS[0].answer;
    }
    if (q.includes("escritura") || q.includes("notari") || q.includes("isai")) {
      return KNOWLEDGE_TOPICS[1].answer;
    }
    if (q.includes("isr") || q.includes("iva") || q.includes("impuesto") || q.includes("retenci")) {
      return KNOWLEDGE_TOPICS[2].answer;
    }
    if (q.includes("contrato") || q.includes("preventa") || q.includes("nom")) {
      return KNOWLEDGE_TOPICS[3].answer;
    }
    return `Dictamen Ejecutivo AUREA para "${queryText}": Para operaciones en Puerto Cancún y Zona Hotelera recomendamos estructurar la oferta mediante Carta de Intención (LOI) con depósito en cuenta concentradora fiduciaria (Escrow), asegurando bloqueo de unidad por 10 días hábiles mientras nuestro comité legal valida el expediente KYC/AML, régimen de condominio y corrida de ISR/IVA aplicable al perfil del comprador.`;
  };

  const handleSendQuestion = (textToSend: string) => {
    const { clean } = sanitizeSovereignInput(textToSend);
    if (!clean) return;

    const nowLabel = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: clean,
      timestamp: `${nowLabel} HRS`,
    };

    const replyMsg: CopilotMessage = {
      id: `ast-${Date.now() + 1}`,
      role: "assistant",
      title: "Dictamen Jurídico-Patrimonial AUREA",
      text: generateAdvisorResponse(clean),
      timestamp: `${nowLabel} HRS`,
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setInputQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            MÓDULO G · INTELIGENCIA COMERCIAL & LEGAL
          </span>
          <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-black">
            Atlas Copilot (IA Comercial)
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Asistente especializado en Fideicomisos en Zona Restringida, escrituración notarial, ISR/IVA y amenidades de ultra lujo.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMessages(INITIAL_COPILOT_MESSAGES)}
          className="self-start rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-['Outfit'] text-xs font-medium text-neutral-600 hover:border-black hover:text-black"
        >
          Reiniciar Sesión IA
        </button>
      </div>

      {/* Botones de consulta rápida */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KNOWLEDGE_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => handleSendQuestion(topic.question)}
            className="flex flex-col justify-between rounded-xl border border-[#eaedf0] bg-white p-4 text-left shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#755a34]"
          >
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
              CONSULTA FRECUENTE
            </span>
            <span className="mt-1 font-['Outfit'] text-xs font-semibold text-black">
              {topic.label}
            </span>
          </button>
        ))}
      </div>

      {/* Consola de conversación */}
      <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-xl p-4 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-black text-white"
                    : "border border-[#eaedf0] bg-[#f8f9fa] text-neutral-800"
                }`}
              >
                {msg.title && (
                  <div className="mb-1.5 flex items-center justify-between border-b border-neutral-200/60 pb-1">
                    <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#755a34]">
                      {msg.title}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {msg.timestamp}
                    </span>
                  </div>
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuestion(inputQuery);
          }}
          className="mt-5 flex gap-3 border-t border-[#eaedf0] pt-4"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Pregunta sobre fideicomisos, retenciones ISR para extranjeros, contratos de preventa o amenidades..."
            className="flex-1 rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-4 py-2.5 text-xs text-black focus:border-black focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-5 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#755a34]"
          >
            <span className="material-symbols-outlined text-[16px]">
              auto_awesome
            </span>
            Consultar Copilot
          </button>
        </form>
      </div>
    </div>
  );
};
