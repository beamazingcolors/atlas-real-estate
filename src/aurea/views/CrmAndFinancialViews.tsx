import React, { useMemo, useState } from "react";
import {
  AiSpecializedAgentKey,
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
    const message = `Estimado/a ${prospect.fullName} (${prospect.titleOrOffice}), le saluda la Dirección Patrimonial de Proyecto Atlas (Real Estate Platform). En seguimiento a su interés en *${prospect.interestedPropertyName}*, hemos preparado el dossier técnico actualizado, corrida de retorno patrimonial y disponibilidad oficial para coordinar su revisión privada. ¿Le resulta conveniente una breve llamada ejecutiva hoy?`;
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
 * MÓDULO 04 · ATLAS AI (AÑO 2 & AÑO 5)
 * - 4 Agentes IA Especializados: Ventas, Inversiones, Legal y Postventa
 * - 9 Funciones Oficiales: Buscar propiedades por lenguaje natural, comparar
 *   desarrollos y zonas, calcular ROI y plusvalía, recomendar inversiones,
 *   crear fichas técnicas y presentaciones, redactar contratos y propuestas,
 *   clasificar leads, resumir conversaciones y asistente para cierres de venta.
 * - Motor de Matching Automático Cliente ↔ Propiedad + IA Predictiva Plusvalía
 * ========================================================================== */

interface CopilotMessage {
  id: string;
  role: "assistant" | "user";
  agentKey?: AiSpecializedAgentKey;
  title?: string;
  text: string;
  timestamp: string;
}

const SPECIALIZED_AI_AGENTS: {
  key: AiSpecializedAgentKey;
  name: string;
  subtitle: string;
  focus: string;
}[] = [
  {
    key: "VENTAS",
    name: "Agente IA de Ventas",
    subtitle: "Clasificación de Leads, Resumen de Chats & Cierre Comercial",
    focus:
      "Clasifica prospectos por intención de compra, resume conversaciones de WhatsApp/correo, rebate objeciones y estructura estrategias de cierre.",
  },
  {
    key: "INVERSIONES",
    name: "Agente IA de Inversiones",
    subtitle: "Búsqueda Natural, Comparativa de Zonas, ROI & Plusvalía Predictiva",
    focus:
      "Busca unidades por lenguaje natural, compara desarrollos y corredores, calcula Cap Rate neto y proyecta plusvalía a 3 y 5 años.",
  },
  {
    key: "LEGAL",
    name: "Agente IA Legal",
    subtitle: "Redacción de Contratos, Propuestas, Fideicomiso SRE & NOM-247",
    focus:
      "Redacta Cartas Oferta (LOI), cláusulas de promesa de compraventa, checklists para extranjeros en Zona Restringida y cálculo de ISAI/ISR.",
  },
  {
    key: "POSTVENTA",
    name: "Agente IA de Postventa",
    subtitle: "Entregas, Garantías, Interiorismo & Administración de Rentas",
    focus:
      "Coordina actas de recepción física, pólizas de vicios ocultos, conexión con interiorismo llave en mano y alta en administración de rentas.",
  },
];

const NINE_ATLAS_AI_FUNCTIONS: {
  id: string;
  number: string;
  label: string;
  agent: AiSpecializedAgentKey;
  prompt: string;
  responseTitle: string;
  responseText: string;
}[] = [
  {
    id: "fn-1",
    number: "01",
    label: "Buscar propiedades por lenguaje natural",
    agent: "INVERSIONES",
    prompt:
      "Buscar propiedades por lenguaje natural: 'Quiero un departamento o villa en Cancún con vista al agua, mínimo 2 recámaras, entrega con alto descuento de preventa y ROI mayor al 12%'",
    responseTitle: "Búsqueda Semántica en Lenguaje Natural · Atlas AI",
    responseText:
      "He analizado las 6 carteras sincronizadas en Google Drive y encontré 3 coincidencias exactas:\n1) **Nautica Residences by Naúma (Unidad T1-806 · Prototipo Medium 3B)**: 152.94 m², 3 recámaras, vista directa a Laguna Nichupté y Zona Hotelera, ROI estimado de 13.8% anual y hasta 10% de descuento en plan 90/10.\n2) **The Villas Collection by Nautica (Villa Elara · V2)**: 272.00 m² en 2 niveles, 3 recámaras + cuarto de servicio, acceso a Naúma Beach Club y ROI de 13.2%.\n3) **Isla Blanca Residences — Losantos Huayacán**: Residencias de 3 recámaras con doble filtro de seguridad, casa club y 10% de descuento en pago de contado.",
  },
  {
    id: "fn-2",
    number: "02",
    label: "Comparar desarrollos y zonas",
    agent: "INVERSIONES",
    prompt:
      "Comparar desarrollos y zonas: Blvd. Colosio / Laguna Nichupté vs. Av. Huayacán vs. Playa del Carmen",
    responseTitle: "Comparativa Multidimensional de Desarrollos y Corredores",
    responseText:
      "• **Corredor Laguna Nichupté / Zona Hotelera (Nautica Residences & The Villas)**: Mayor apreciación patrimonial (+58% a 5 años), vistas garantizadas al agua, +50 amenidades tipo resort y club de playa propio. Ideal para perfil patrimonial y renta vacacional premium.\n• **Corredor Av. Huayacán (Isla Blanca & Hodela Apartments)**: Mayor absorción residencial de largo plazo, ticket de entrada desde $3.85M MXN ($191K USD) y excelente relación precio/m².\n• **Corredor Playa del Carmen Centro-Mar (Prana Towers)**: Enfoque 100% flujo inmediato por renta corta (ocupación >76% anual) con unidades estudio y penthouses llave en mano.",
  },
  {
    id: "fn-3",
    number: "03",
    label: "Calcular ROI y plusvalía",
    agent: "INVERSIONES",
    prompt:
      "Calcular ROI neto, flujo de caja y plusvalía predictiva a 5 años para Nautica Residences",
    responseTitle: "Cálculo de ROI Neto & Modelo Predictivo de Plusvalía (Año 5)",
    responseText:
      "• **Precio Lista Base (Unidad Tipo M3B)**: $9,550,000 MXN (~$473,945 USD).\n• **Con Esquema 50/50 (5% Descuento)**: $9,072,500 MXN (Ahorro inmediato de $477,500 MXN).\n• **Cap Rate Neto Estimado**: 13.8% anual considerando ocupación del 74% y tarifa promedio (ADR) de $385 USD/noche.\n• **IA Predictiva de Plusvalía a 5 Años**: +58.4% impulsada por el Puente Vehicular Nichupté y la consolidación del corredor Colosio-Laguna.",
  },
  {
    id: "fn-4",
    number: "04",
    label: "Recomendar inversiones",
    agent: "INVERSIONES",
    prompt:
      "Recomendar tesis de inversión óptima para un portafolio de $950,000 USD diversificado",
    responseTitle: "Recomendación de Portafolio Inmobiliario Diversificado",
    responseText:
      "Para un capital de $950,000 USD recomendamos una estrategia **Core + Yield**:\n• **Activo 1 (60% del Capital · Plusvalía & Trofeo)**: 1 departamento Prototipo Medium u Ocean View en **Nautica Residences by Naúma** bajo esquema 50/50 con 5% de descuento.\n• **Activo 2 (40% del Capital · Flujo Vacacional Inmediato)**: 2 unidades en **Prana Towers Playa del Carmen** o **Hodela Apartments** para generar flujo de caja líquido desde el primer año mientras madura la plusvalía de preventa.",
  },
  {
    id: "fn-5",
    number: "05",
    label: "Crear fichas técnicas y presentaciones",
    agent: "VENTAS",
    prompt:
      "Crear ficha técnica ejecutiva y resumen de presentación para enviar a un comité familiar",
    responseTitle: "Ficha Técnica Ejecutiva Lista para Presentación",
    responseText:
      "**RESUMEN EJECUTIVO — NAUTICA RESIDENCES BY NAÚMA**\n• **Ubicación**: Blvd. Luis Donaldo Colosio, frente a Laguna Nichupté, Cancún.\n• **Arquitectura**: 2 Torres de 20 niveles con más de 50 amenidades + Naúma Beach Club en Zona Hotelera.\n• **Tipologías**: 1, 2 y 3 Recámaras + Penthouses (71 m² a 261 m²).\n• **Planes de Pago**: 30/70 (Lista), 30/20/50 (-3%), 50/50 (-5%), 70/30 (-7%) y 90/10 (-10%).\n• **Respaldo Documental**: Brochures ES/EN, plantas ambientadas y lista de precios verificada en el Centro Documental Google Drive.",
  },
  {
    id: "fn-6",
    number: "06",
    label: "Redactar contratos y propuestas",
    agent: "LEGAL",
    prompt:
      "Redactar borrador de Carta Oferta (LOI) y cláusulas de reserva bajo NOM-247-SE-2021",
    responseTitle: "Borrador de Carta Oferta & Cláusulas Protectoras NOM-247",
    responseText:
      "**CARTA DE INTENCIÓN DE COMPRA (LOI) — PROYECTO ATLAS**\n1. **Objeto**: Reserva formal de la unidad seleccionada sujeta a congelamiento de precio de lista vigente.\n2. **Esquema de Liquidación**: Depósito de apartado reembolsable por 15 días naturales en cuenta concentradora fiduciaria; firma de Contrato de Promesa conforme a la NOM-247-SE-2021.\n3. **Garantías**: Entrega de planos arquitectónicos acotados, memoria descriptiva de acabados y póliza de vicios ocultos por 5 años en estructura.",
  },
  {
    id: "fn-7",
    number: "07",
    label: "Clasificar leads",
    agent: "VENTAS",
    prompt:
      "Clasificar automáticamente los prospectos actuales del CRM según probabilidad de cierre y capacidad patrimonial",
    responseTitle: "Clasificación Inteligente de Leads (Lead Scoring IA)",
    responseText:
      "• **Prioridad A (Cierre Inminente · Score 94/100)**: *Alejandro Vega (Family Office Monterrey)* — Presupuesto validado, etapa Negociación de Oferta en Nautica Residences, solicita esquema con descuento.\n• **Prioridad A (Recorrido Confirmado · Score 89/100)**: *Marcus Vance (Vance Capital LLC)* — Comprador extranjero en efectivo para The Villas Collection, requiere apertura de Fideicomiso SRE.\n• **Prioridad B (Calificación en Curso · Score 78/100)**: *Sofía Elizondo* — Interesada en Isla Blanca Residences, pendiente envío de comparativa de planes de pago.",
  },
  {
    id: "fn-8",
    number: "08",
    label: "Resumir conversaciones",
    agent: "VENTAS",
    prompt:
      "Resumir el historial de conversación de WhatsApp y correo con el inversionista y extraer siguientes pasos",
    responseTitle: "Resumen Ejecutivo de Conversación Omnicanal",
    responseText:
      "**Síntesis de Hilo (WhatsApp + Correo)**:\n• El cliente confirmó preferencia por piso alto (nivel 11 o superior) con orientación hacia Laguna Nichupté y atardecer.\n• Solicitó comparar el ahorro entre el plan **50/50 (5% desc.)** y **70/30 (7% desc.)**.\n• **Siguientes pasos accionables**: 1) Enviar cotización PDF desde el Dossier de Nautica Residences; 2) Agendar videollamada con Notaría No. 62 del Marketplace; 3) Bloquear unidad T1-1501 por 72 horas.",
  },
  {
    id: "fn-9",
    number: "09",
    label: "Asistente para cierres de venta",
    agent: "POSTVENTA",
    prompt:
      "Dame los argumentos clave de cierre y plan postventa llave en mano para un inversionista indeciso",
    responseTitle: "Estrategia de Cierre Comercial & Plan Postventa Turnkey",
    responseText:
      "**3 Argumentos Definitivos de Cierre + Ruta Postventa**:\n1) **Ganancia de Capital desde la Firma**: Al elegir el esquema 70/30 o 90/10, el inversionista captura entre 7% y 10% de descuento directo antes de la plusvalía constructiva.\n2) **Solución Llave en Mano en el Marketplace**: Conectamos de inmediato con *Casa Naúma Interiorismo* para amueblado turnkey y con *Sovereign Hospitality* para administrar las rentas vacacionales sin que el propietario tenga que operar el inmueble.\n3) **Certeza Jurídica Total**: Expediente de Google Drive 100% auditado y firma electrónica disponible hoy mismo.",
  },
];

const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: "cop-welcome",
    role: "assistant",
    agentKey: "INVERSIONES",
    title: "Atlas AI · Ecosistema de 4 Agentes Especializados & 9 Funciones",
    text: "Bienvenido a **Atlas AI (Módulo 04 · Plan Estratégico Año 2 y Año 5)**. Selecciona uno de los **4 Agentes IA Especializados** (Ventas, Inversiones, Legal o Postventa), ejecuta cualquiera de las **9 funciones oficiales** con un clic o utiliza el **Motor de Matching Automático Cliente ↔ Propiedad**.",
    timestamp: "09:00 HRS",
  },
];

export const AtlasCopilotView: React.FC = () => {
  const [activeAgent, setActiveAgent] =
    useState<AiSpecializedAgentKey>("INVERSIONES");
  const [messages, setMessages] = usePersistentState<CopilotMessage[]>(
    "proyecto_atlas_copilot_history_v3",
    INITIAL_COPILOT_MESSAGES
  );
  const [inputQuery, setInputQuery] = useState("");
  const [selectedInvestorProfile, setSelectedInvestorProfile] = useState<
    "RENDIMIENTO_VACACIONAL" | "PATRIMONIAL_TROFEO" | "PREVENTA_DESCUENTO"
  >("PATRIMONIAL_TROFEO");

  const matchingRecommendations = useMemo(() => {
    if (selectedInvestorProfile === "PATRIMONIAL_TROFEO") {
      return [
        {
          name: "Nautica Residences by Naúma (Torres 1 y 2)",
          matchPct: 98,
          zone: "Cancún · Laguna Nichupté",
          predictedAppreciation5Y: "+58.4%",
          reason:
            "Vista frontal a Laguna Nichupté y Mar Caribe, +50 amenidades, Club de Playa propio y alta liquidez patrimonial.",
        },
        {
          name: "The Villas Collection by Nautica",
          matchPct: 95,
          zone: "Cancún · Blvd. Colosio",
          predictedAppreciation5Y: "+55.0%",
          reason:
            "Baja densidad (solo 18 villas de 246 a 312 m²), privacidad absoluta de 2 niveles y acceso completo al ecosistema Naúma.",
        },
      ];
    }
    if (selectedInvestorProfile === "RENDIMIENTO_VACACIONAL") {
      return [
        {
          name: "Prana Towers — Playa del Carmen",
          matchPct: 97,
          zone: "Playa del Carmen",
          predictedAppreciation5Y: "+49.2%",
          reason:
            "Tipologías estudio y penthouses llave en mano con ocupación vacacional proyectada superior al 76% anual.",
        },
        {
          name: "Nautica Residences (Prototipo Small / Medium)",
          matchPct: 93,
          zone: "Cancún · Laguna Nichupté",
          predictedAppreciation5Y: "+58.4%",
          reason:
            "Alta demanda de estancias ejecutivas y vacacionales por su cercanía a Zona Hotelera y Aeropuerto Internacional.",
        },
      ];
    }
    return [
      {
        name: "Isla Blanca Residences — Losantos Huayacán",
        matchPct: 96,
        zone: "Av. Huayacán · Cancún",
        predictedAppreciation5Y: "+54.8%",
        reason:
          "Hasta 10% de descuento en esquema 90/10 y fuerte crecimiento residencial en el polo Huayacán.",
      },
      {
        name: "Nautica Residences (Esquema 90/10 · -10% Desc.)",
        matchPct: 94,
        zone: "Cancún · Laguna Nichupté",
        predictedAppreciation5Y: "+58.4%",
        reason:
          "Descuento institucional del 10% con 90% de enganche y 10% contra entrega.",
      },
    ];
  }, [selectedInvestorProfile]);

  const handleRunFunction = (fnItem: (typeof NINE_ATLAS_AI_FUNCTIONS)[number]) => {
    setActiveAgent(fnItem.agent);
    const nowLabel = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      agentKey: fnItem.agent,
      text: fnItem.prompt,
      timestamp: `${nowLabel} HRS`,
    };

    const replyMsg: CopilotMessage = {
      id: `ast-${Date.now() + 1}`,
      role: "assistant",
      agentKey: fnItem.agent,
      title: fnItem.responseTitle,
      text: fnItem.responseText,
      timestamp: `${nowLabel} HRS`,
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
  };

  const handleSendCustomQuery = (textToSend: string) => {
    const { clean } = sanitizeSovereignInput(textToSend);
    if (!clean) return;

    const matchedFn = NINE_ATLAS_AI_FUNCTIONS.find((f) =>
      clean.toLowerCase().includes(f.label.split(" ")[0].toLowerCase())
    );

    const nowLabel = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const agentMeta =
      SPECIALIZED_AI_AGENTS.find((a) => a.key === activeAgent) ??
      SPECIALIZED_AI_AGENTS[0];

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      agentKey: activeAgent,
      text: clean,
      timestamp: `${nowLabel} HRS`,
    };

    const replyMsg: CopilotMessage = {
      id: `ast-${Date.now() + 1}`,
      role: "assistant",
      agentKey: activeAgent,
      title: `${agentMeta.name} · Dictamen Atlas AI`,
      text:
        matchedFn?.responseText ??
        `Dictamen de **${agentMeta.name}** para "${clean}":\n1) **Análisis de Cartera**: En Nautica Residences, The Villas Collection, Isla Blanca, Hodela y Prana Towers contamos con disponibilidad verificada en Google Drive y descuentos de preventa del 3% al 10%.\n2) **Estructura Legal & Fiscal**: Operación protegida bajo NOM-247-SE-2021 y Fideicomiso SRE para extranjeros.\n3) **Acción Recomendada**: Generar Dossier con corrida financiera personalizada y conectar con Notaría o Administración de Rentas en el Marketplace.`,
      timestamp: `${nowLabel} HRS`,
    };

    setMessages((prev) => [...prev, userMsg, replyMsg]);
    setInputQuery("");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Cabecera Atlas AI con los 4 Agentes Especializados (Año 5) */}
      <div className="border border-[#091e3a] bg-[#091e3a] p-6 text-white sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-white/15 pb-5 lg:flex-row lg:items-center">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#00b4f5]">
              MÓDULO 04 · ATLAS AI · 4 AGENTES ESPECIALIZADOS &amp; 9 FUNCIONES
            </span>
            <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight sm:text-3xl">
              Atlas AI — Inteligencia Artificial Comercial, Legal y Predictiva
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Selecciona un Agente IA especializado o ejecuta cualquiera de las 9 funciones del Plan Estratégico con un solo clic.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMessages(INITIAL_COPILOT_MESSAGES)}
            className="self-start border border-white/25 bg-white/5 px-3.5 py-2 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#091e3a]"
          >
            Reiniciar Consola IA
          </button>
        </div>

        {/* Selector de los 4 Agentes IA Especializados */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALIZED_AI_AGENTS.map((agent) => {
            const active = activeAgent === agent.key;
            return (
              <button
                key={agent.key}
                type="button"
                onClick={() => setActiveAgent(agent.key)}
                className={`flex flex-col justify-between border p-4 text-left transition ${
                  active
                    ? "border-[#00b4f5] bg-white text-[#091e3a]"
                    : "border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <div>
                  <span
                    className={`font-['Outfit'] text-[9px] font-semibold uppercase tracking-[0.2em] ${
                      active ? "text-[#0077cc]" : "text-[#00b4f5]"
                    }`}
                  >
                    AGENTE ESPECIALIZADO · AÑO 5
                  </span>
                  <h2 className="mt-1 font-['Outfit'] text-sm font-bold">
                    {agent.name}
                  </h2>
                  <p
                    className={`mt-1 text-[11px] leading-relaxed ${
                      active ? "text-neutral-600" : "text-slate-300"
                    }`}
                  >
                    {agent.focus}
                  </p>
                </div>
                <span
                  className={`mt-3 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider ${
                    active ? "text-[#755a34]" : "text-[#faeedd]"
                  }`}
                >
                  {active ? "Agente Activo ✓" : "Seleccionar Agente →"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Las 9 Funciones Oficiales de Atlas AI como Botones Ejecutables */}
      <div className="border border-[#e2e6ec] bg-white p-6">
        <div className="border-b border-[#eaedf0] pb-4">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
            CAPACIDADES OFICIALES DEL PLAN ESTRATÉGICO
          </span>
          <h2 className="mt-1 font-['Outfit'] text-lg font-semibold text-[#091e3a]">
            Las 9 Funciones de Atlas AI (Ejecución en 1 Clic)
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {NINE_ATLAS_AI_FUNCTIONS.map((fn) => (
            <button
              key={fn.id}
              type="button"
              onClick={() => handleRunFunction(fn)}
              className="group flex items-center justify-between border border-[#eaedf0] bg-[#f8f9fa] p-3.5 text-left transition hover:border-[#091e3a] hover:bg-white"
            >
              <div>
                <span className="font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-[#0077cc]">
                  FUNCIÓN {fn.number} · AGENTE {fn.agent}
                </span>
                <div className="mt-0.5 font-['Outfit'] text-xs font-semibold text-[#091e3a]">
                  {fn.label}
                </div>
              </div>
              <span className="font-['Outfit'] text-xs font-bold text-[#755a34] transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Motor de Matching Automático Cliente ↔ Propiedad & IA Predictiva de Plusvalía (Año 5) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="border border-[#e2e6ec] bg-white p-6 lg:col-span-5">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#004044]">
            AÑO 5 · MATCHING AUTOMÁTICO &amp; IA PREDICTIVA
          </span>
          <h3 className="mt-1 font-['Outfit'] text-base font-semibold text-[#091e3a]">
            Emparejamiento Cliente ↔ Propiedad &amp; Plusvalía a 5 Años
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Selecciona el objetivo del cliente para calcular el Match Score automático y la plusvalía predictiva.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            {[
              {
                id: "PATRIMONIAL_TROFEO" as const,
                label: "Perfil 1: Preservación Patrimonial & Vista al Agua",
              },
              {
                id: "RENDIMIENTO_VACACIONAL" as const,
                label: "Perfil 2: Maximización de Flujo por Renta Vacacional",
              },
              {
                id: "PREVENTA_DESCUENTO" as const,
                label: "Perfil 3: Preventa con Alto Descuento de Entrada (10%)",
              },
            ].map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => setSelectedInvestorProfile(prof.id)}
                className={`border px-3.5 py-2.5 text-left font-['Outfit'] text-xs font-semibold transition ${
                  selectedInvestorProfile === prof.id
                    ? "border-[#091e3a] bg-[#091e3a] text-white"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a]"
                }`}
              >
                {prof.label}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {matchingRecommendations.map((rec) => (
              <div
                key={rec.name}
                className="border border-[#eaedf0] bg-[#f8f9fa] p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-[#004044] px-2 py-0.5 font-['Outfit'] text-[10px] font-bold uppercase text-white">
                    Match {rec.matchPct}%
                  </span>
                  <span className="font-['Outfit'] text-xs font-bold text-[#755a34]">
                    Plusvalía 5 Años: {rec.predictedAppreciation5Y}
                  </span>
                </div>
                <h4 className="mt-2 font-['Outfit'] text-sm font-semibold text-[#091e3a]">
                  {rec.name}
                </h4>
                <p className="mt-1 text-xs text-neutral-600">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Consola Conversacional Atlas AI */}
        <div className="border border-[#e2e6ec] bg-white p-6 lg:col-span-7">
          <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-2xl border p-4 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "border-[#091e3a] bg-[#091e3a] text-white"
                      : "border-[#eaedf0] bg-[#f8f9fa] text-neutral-800"
                  }`}
                >
                  {msg.title && (
                    <div className="mb-1.5 flex items-center justify-between border-b border-neutral-200/60 pb-1">
                      <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
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
              handleSendCustomQuery(inputQuery);
            }}
            className="mt-5 flex gap-3 border-t border-[#eaedf0] pt-4"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Escribe en lenguaje natural: buscar propiedad, calcular ROI, redactar contrato, resumir chat..."
              className="flex-1 border border-[#eaedf0] bg-[#f8f9fa] px-4 py-2.5 text-xs text-black focus:border-[#091e3a] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-[#091e3a] px-5 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
            >
              <span>Ejecutar Atlas AI</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
