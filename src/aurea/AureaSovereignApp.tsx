import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AureaProperty,
  BrokerAgentMember,
  ClientSegmentTag,
  CrmProspect,
  CrmStageKey,
  CurrencyCode,
  DriveAuditItem,
  MembershipTier,
  NavSectionId,
  PrivateClient,
  SecurityAuditEvent,
  VipAppointment,
  WhiteLabelConfig,
} from "./types";
import {
  INITIAL_BROKER_TEAM,
  INITIAL_CLIENTS,
  INITIAL_DRIVE_AUDITS,
  INITIAL_PROPERTIES,
  INITIAL_PROSPECTS,
  INITIAL_SECURITY_LOGS,
  INITIAL_VIP_APPOINTMENTS,
} from "./data/initialData";
import {
  formatSovereignCurrency,
  usePersistentState,
} from "./storage/useAureaStorage";
import {
  PhotoCustomizerModal,
  PropertyDossierModal,
  QuickLeadModal,
} from "./components/SovereignModals";
import {
  ComparatorView,
  ExecutiveDashboardView,
  MasterInventoryView,
} from "./views/ExecutiveAndInventoryViews";
import {
  AtlasCopilotView,
  ClientManagerView,
  CrmPipelineView,
  FinancialCalculatorView,
} from "./views/CrmAndFinancialViews";
import {
  AgencySuiteView,
  CookiePrivacyBanner,
  DirectoryView,
  DriveAuditView,
  SecurityVaultView,
} from "./views/CorporateAndSecurityViews";

const MEMBERSHIP_LABELS: Record<MembershipTier, string> = {
  BASICA: "Membresía Básica",
  PRO: "Membresía Pro",
  AGENCIA_CORPORATIVA: "Agencia Corporativa",
};

export const AureaSovereignApp: React.FC = () => {
  // Estados persistentes en localStorage
  const [properties, setProperties] = usePersistentState<AureaProperty[]>(
    "aurea_properties_v1",
    INITIAL_PROPERTIES
  );
  const [favorites, setFavorites] = usePersistentState<string[]>(
    "aurea_favorites_v1",
    ["prop-villa-canto-agua", "prop-sky-penthouse-lumina"]
  );
  const [comparedIds, setComparedIds] = usePersistentState<string[]>(
    "aurea_compared_v1",
    [
      "prop-villa-canto-agua",
      "prop-sky-penthouse-lumina",
      "prop-ateliers-pok-ta-pok",
    ]
  );
  const [prospects, setProspects] = usePersistentState<CrmProspect[]>(
    "aurea_prospects_v1",
    INITIAL_PROSPECTS
  );
  const [clients, setClients] = usePersistentState<PrivateClient[]>(
    "aurea_clients_v1",
    INITIAL_CLIENTS
  );
  const [appointments, setAppointments] = usePersistentState<VipAppointment[]>(
    "aurea_appointments_v1",
    INITIAL_VIP_APPOINTMENTS
  );
  const [brokers, setBrokers] = usePersistentState<BrokerAgentMember[]>(
    "aurea_brokers_v1",
    INITIAL_BROKER_TEAM
  );
  const [roundRobinPointer, setRoundRobinPointer] = usePersistentState<number>(
    "aurea_round_robin_ptr_v1",
    0
  );
  const [driveAudits, setDriveAudits] = usePersistentState<DriveAuditItem[]>(
    "aurea_drive_audits_v1",
    INITIAL_DRIVE_AUDITS
  );
  const [securityLogs, setSecurityLogs] = usePersistentState<
    SecurityAuditEvent[]
  >("aurea_security_logs_v1", INITIAL_SECURITY_LOGS);
  const [currency, setCurrency] = usePersistentState<CurrencyCode>(
    "aurea_currency_v1",
    "USD"
  );
  const [membershipTier, setMembershipTier] =
    usePersistentState<MembershipTier>(
      "aurea_membership_tier_v1",
      "AGENCIA_CORPORATIVA"
    );
  const [whiteLabel, setWhiteLabel] = usePersistentState<WhiteLabelConfig>(
    "aurea_whitelabel_v1",
    {
      agencyName: "AUREA",
      monogram: "AU",
      subtitle: "SOVEREIGN ASSETS",
      agencySplitPct: 40,
      brokerSplitPct: 60,
    }
  );

  // Navegación y modales
  const [activeNav, setActiveNav] = useState<NavSectionId>("executive");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [photoModalProp, setPhotoModalProp] = useState<AureaProperty | null>(
    null
  );
  const [dossierModalProp, setDossierModalProp] =
    useState<AureaProperty | null>(null);
  const [quickLeadModalOpen, setQuickLeadModalOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Atajo de teclado Ctrl + K / Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchDropdownOpen(true);
      }
      if (e.key === "Escape") {
        setSearchDropdownOpen(false);
        setProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Resultados predictivos de búsqueda
  const predictiveResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return properties
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.zone.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.typologies.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [properties, searchQuery]);

  // Helper para registrar eventos en el Audit Log
  const recordSecurityEvent = (
    category: SecurityAuditEvent["category"],
    severity: SecurityAuditEvent["severity"],
    description: string
  ) => {
    const nowIso = new Date().toISOString().replace("T", " ").slice(0, 19);
    const nextEvent: SecurityAuditEvent = {
      id: `sec-${Date.now()}`,
      timestampIso: nowIso,
      category,
      severity,
      description,
      originIp: "189.203.44.12 (Sesión Soberana)",
    };
    setSecurityLogs((prev) => [nextEvent, ...prev.slice(0, 24)]);
  };

  // Handlers de propiedades y fotos
  const handleSaveCustomPhoto = (
    propertyId: string,
    newUrl: string | undefined
  ) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === propertyId ? { ...prop, customImageUrl: newUrl } : prop
      )
    );
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleToggleCompare = (propertyId: string) => {
    setComparedIds((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), propertyId];
      }
      return [...prev, propertyId];
    });
  };

  // Handlers de CRM y Clientes
  const handleUpdateProspectStage = (
    prospectId: string,
    newStage: CrmStageKey
  ) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === prospectId ? { ...p, stage: newStage } : p))
    );
  };

  const handleUpdateProspectNotes = (prospectId: string, notes: string) => {
    setProspects((prev) =>
      prev.map((p) =>
        p.id === prospectId ? { ...p, privateNotes: notes } : p
      )
    );
  };

  const handleAddProspect = (
    prospect: CrmProspect,
    hadSecurityAlert: boolean
  ) => {
    setProspects((prev) => [prospect, ...prev]);
    if (hadSecurityAlert) {
      recordSecurityEvent(
        "SANITIZACION_XSS",
        "PREVENTIVO",
        `Intento de código malicioso neutralizado al registrar prospecto ${prospect.fullName}.`
      );
    }
  };

  const handleUpdateClientTag = (clientId: string, tag: ClientSegmentTag) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, tag } : c))
    );
  };

  const handleToggleClientProperty = (clientId: string, propertyId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id !== clientId) return c;
        const exists = c.curatedPropertyIds.includes(propertyId);
        return {
          ...c,
          curatedPropertyIds: exists
            ? c.curatedPropertyIds.filter((id) => id !== propertyId)
            : [...c.curatedPropertyIds, propertyId],
        };
      })
    );
  };

  // Handler de Round-Robin en Agencia
  const handleAssignRoundRobinLead = () => {
    const targetIndex = roundRobinPointer % brokers.length;
    const assignedBroker = brokers[targetIndex];
    setBrokers((prev) =>
      prev.map((b, idx) =>
        idx === targetIndex
          ? { ...b, activeLeadsCount: b.activeLeadsCount + 1 }
          : b
      )
    );
    setRoundRobinPointer((prev) => prev + 1);
    if (assignedBroker) {
      const sampleProp =
        properties[(roundRobinPointer + 1) % properties.length] ??
        properties[0];
      const autoLead: CrmProspect = {
        id: `rr-${Date.now()}`,
        fullName: `Inversionista Patrimonial #${104 + roundRobinPointer}`,
        titleOrOffice: "Family Office Internacional",
        phone: "+529984109920",
        email: "familyoffice@sovereigncapital.ch",
        budgetUsd: sampleProp.priceUsd,
        source: "Round-Robin Desk",
        interestedPropertyId: sampleProp.id,
        interestedPropertyName: sampleProp.name,
        stage: "CONTACTO_INICIAL",
        privateNotes: `Asignado automáticamente por algoritmo Round-Robin a ${assignedBroker.name}.`,
        assignedBrokerName: assignedBroker.name,
        createdAtIso: new Date().toISOString().slice(0, 10),
      };
      setProspects((prev) => [autoLead, ...prev]);
    }
  };

  // Handler de Auditoría de Drives
  const handleRunDriveSync = () => {
    const stamp = new Date().toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setDriveAudits((prev) =>
      prev.map((d) => ({
        ...d,
        lastVerifiedIso: `Hoy ${stamp} HRS`,
        priceListStatus: "Vigente",
      }))
    );
  };

  // Secciones del Sidebar
  const navGroups: {
    groupTitle: string;
    items: { id: NavSectionId; label: string; icon: string; badge?: string }[];
  }[] = [
    {
      groupTitle: "OPERACIONES",
      items: [
        { id: "executive", label: "Tablero Ejecutivo", icon: "space_dashboard" },
        {
          id: "inventory",
          label: "Inventario Completo",
          icon: "apartment",
          badge: `${properties.length}`,
        },
        {
          id: "crm",
          label: "CRM Pipeline",
          icon: "view_kanban",
          badge: `${prospects.length}`,
        },
        { id: "clients", label: "Gestor de Clientes", icon: "groups" },
      ],
    },
    {
      groupTitle: "HERRAMIENTAS DE ANÁLISIS",
      items: [
        {
          id: "comparator",
          label: "Comparador Multidimensional",
          icon: "compare_arrows",
          badge: `${comparedIds.length}/3`,
        },
        {
          id: "calculator",
          label: "Calculadora Financiera & ROI",
          icon: "calculate",
        },
        { id: "copilot", label: "Atlas Copilot (IA)", icon: "temp_preferences_custom" },
      ],
    },
    {
      groupTitle: "CORPORATIVO & AGENCIA",
      items: [
        {
          id: "agency",
          label: "Suite de Agencia Multi-Broker",
          icon: "corporate_fare",
        },
        {
          id: "directory",
          label: "Directorio Inmobiliario",
          icon: "menu_book",
        },
        {
          id: "drives",
          label: "Auditoría Semanal de Drives",
          icon: "folder_managed",
        },
      ],
    },
  ];

  const handleSelectNav = (id: NavSectionId) => {
    setActiveNav(id);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Plus_Jakarta_Sans',sans-serif] text-[#000000]">
      {/* Overlay móvil para el Sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR LATERAL FIJO SOBERANO (w-72 / 18rem) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#1c1b1a] bg-[#000000] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Encabezado con Monograma AUREA y subtítulo SOVEREIGN ASSETS */}
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-[#755a34] bg-[#1c1b1a] font-['Outfit'] text-sm font-bold tracking-widest text-[#faeedd]">
                {whiteLabel.monogram}
              </div>
              <div>
                <div className="font-['Outfit'] text-lg font-bold tracking-[0.18em] text-white">
                  {whiteLabel.agencyName}
                </div>
                <div className="font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.24em] text-[#755a34]">
                  {whiteLabel.subtitle}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded border border-white/20 p-1 text-neutral-400 hover:text-white lg:hidden"
              aria-label="Cerrar menú lateral"
            >
              <span className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
          </div>

          {/* Indicador de estado de conexión institucional en vivo */}
          <div className="mt-4 flex items-center gap-2 rounded-md border border-white/10 bg-[#1c1b1a] px-3 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-['Outfit'] text-[11px] font-medium tracking-wider text-neutral-300">
              Malla de Datos Activa
            </span>
          </div>
        </div>

        {/* Navegación Principal Agrupada */}
        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {navGroups.map((group) => (
            <div key={group.groupTitle}>
              <div className="px-2.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {group.groupTitle}
              </div>
              <nav className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectNav(item.id)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-['Outfit'] text-xs font-medium transition ${
                        isActive
                          ? "bg-[#755a34] text-white shadow-xs"
                          : "text-neutral-300 hover:bg-[#1c1b1a] hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-[17px]">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            isActive
                              ? "bg-black/30 text-[#faeedd]"
                              : "bg-white/10 text-neutral-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Acceso Rápido: Favoritos, Bóveda de Seguridad y Generador de Dossier */}
          <div>
            <div className="px-2.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d9b88c]">
              ACCESO RÁPIDO PATRIMONIAL
            </div>
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => handleSelectNav("favorites")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-['Outfit'] text-xs font-medium transition ${
                  activeNav === "favorites"
                    ? "bg-[#755a34] text-white"
                    : "text-neutral-300 hover:bg-[#1c1b1a] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[17px] text-[#faeedd]">
                    bookmark_star
                  </span>
                  <span>Favoritos en Cartera</span>
                </span>
                <span className="rounded-full bg-[#755a34] px-2 py-0.5 font-['Outfit'] text-[10px] font-bold text-[#faeedd]">
                  {favorites.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectNav("security")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-['Outfit'] text-xs font-medium transition ${
                  activeNav === "security"
                    ? "bg-[#755a34] text-white"
                    : "text-neutral-300 hover:bg-[#1c1b1a] hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[17px] text-emerald-400">
                    encrypted
                  </span>
                  <span>Bóveda de Seguridad & Cifrado</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDossierModalProp(properties[0]);
                  setMobileSidebarOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-[#755a34]/50 bg-[#1c1b1a] px-3 py-2 text-left font-['Outfit'] text-xs font-semibold text-[#faeedd] transition hover:bg-[#755a34] hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[17px]">
                    description
                  </span>
                  <span>Generador de Dossier PDF</span>
                </span>
                <span className="text-[11px]">↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de Usuario/Broker Autenticado al Pie */}
        <div className="border-t border-white/10 bg-[#1c1b1a] p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#755a34] bg-black font-['Outfit'] text-xs font-bold text-[#faeedd]">
                AG
              </div>
              <div className="min-w-0">
                <div className="truncate font-['Outfit'] text-xs font-semibold text-white">
                  Alexis Garzón
                </div>
                <div className="truncate font-['Outfit'] text-[10px] uppercase tracking-wider text-[#d9b88c]">
                  {MEMBERSHIP_LABELS[membershipTier]}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSelectNav("security")}
              title="Configuración de Perfil y Bóveda"
              className="rounded-md border border-white/15 p-1.5 text-neutral-300 hover:bg-black hover:text-white"
            >
              <span className="material-symbols-outlined text-[16px]">
                manage_accounts
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL A LA DERECHA DEL SIDEBAR */}
      <div className="lg:pl-72">
        {/* 2. HEADER SUPERIOR FLOTANTE (h-20) */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-[#eaedf0] bg-white/95 px-4 backdrop-blur-md sm:px-8">
          {/* Izquierda: Botón Hamburguesa (Móvil) + Barra de Búsqueda Predictiva Ctrl+K */}
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#eaedf0] bg-[#f8f9fa] text-black lg:hidden"
              aria-label="Abrir menú"
            >
              <span className="material-symbols-outlined text-[20px]">
                menu
              </span>
            </button>

            <div className="relative w-full max-w-md">
              <div className="flex items-center rounded-lg border border-[#eaedf0] bg-[#f2f4f6] px-3 py-2 focus-within:border-black focus-within:bg-white">
                <span className="material-symbols-outlined mr-2 text-[18px] text-neutral-500">
                  search
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchDropdownOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchDropdownOpen(true);
                  }}
                  placeholder="Buscar activo, zona o código (Ctrl + K)..."
                  className="w-full bg-transparent text-xs text-black placeholder-neutral-500 focus:outline-none"
                />
                <kbd className="hidden rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-['Outfit'] text-[10px] font-semibold text-neutral-500 sm:inline-block">
                  Ctrl + K
                </kbd>
              </div>

              {/* Resultados predictivos */}
              {searchDropdownOpen && predictiveResults.length > 0 && (
                <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-[#1c1b1a] bg-white p-2 shadow-2xl">
                  <div className="px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
                    Resultados en Cartera Soberana
                  </div>
                  {predictiveResults.map((prop) => (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => {
                        setDossierModalProp(prop);
                        setSearchDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs hover:bg-[#f2f4f6]"
                    >
                      <div>
                        <div className="font-['Outfit'] font-semibold text-black">
                          {prop.name}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {prop.zone} · {prop.code}
                        </div>
                      </div>
                      <span className="font-['Outfit'] text-xs font-bold text-[#755a34]">
                        {formatSovereignCurrency(prop.priceUsd, currency, true)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Derecha: Selector de Divisas, Registrar Prospecto, Píldora Membresía y Perfil */}
          <div className="flex items-center gap-2.5">
            {/* Selector de Divisas USD / MXN / EUR */}
            <div
              className="flex items-center rounded-lg border border-[#eaedf0] bg-[#f2f4f6] p-1"
              role="group"
              aria-label="Selector de divisa"
            >
              {(["USD", "MXN", "EUR"] as CurrencyCode[]).map((code) => {
                const active = currency === code;
                const sym = code === "EUR" ? "€" : "$";
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrency(code)}
                    className={`rounded-md px-2.5 py-1 font-['Outfit'] text-xs font-semibold transition ${
                      active
                        ? "bg-black text-[#faeedd] shadow-xs"
                        : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    {code} ({sym})
                  </button>
                );
              })}
            </div>

            {/* Botón Registrar Prospecto */}
            <button
              type="button"
              onClick={() => setQuickLeadModalOpen(true)}
              className="hidden items-center gap-1.5 rounded-lg bg-black px-3.5 py-2 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#755a34] md:inline-flex"
            >
              <span className="material-symbols-outlined text-[16px] text-[#faeedd]">
                person_add
              </span>
              Registrar Prospecto
            </button>

            {/* Píldora de Estado de Membresía del Asesor */}
            <button
              type="button"
              onClick={() => setActiveNav("security")}
              className="hidden items-center gap-1.5 rounded-full border border-[#755a34]/40 bg-[#faeedd] px-3 py-1.5 font-['Outfit'] text-[11px] font-semibold text-[#755a34] xl:inline-flex"
            >
              <span className="material-symbols-outlined text-[14px]">
                verified
              </span>
              {MEMBERSHIP_LABELS[membershipTier]}
            </button>

            {/* Menú de Perfil Rápido */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-lg border border-[#eaedf0] bg-white px-2.5 text-xs font-medium text-black hover:border-black"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black font-['Outfit'] text-[10px] font-bold text-[#faeedd]">
                  AG
                </span>
                <span className="material-symbols-outlined text-[16px]">
                  expand_more
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-[#1c1b1a] bg-white p-2 shadow-xl">
                  <div className="border-b border-[#eaedf0] px-3 py-2">
                    <div className="font-['Outfit'] text-xs font-semibold text-black">
                      Alexis Garzón · Managing Partner
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      {MEMBERSHIP_LABELS[membershipTier]}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("security");
                      setProfileMenuOpen(false);
                    }}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-neutral-700 hover:bg-[#f2f4f6]"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      shield_lock
                    </span>
                    Bóveda de Seguridad & Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProperties(INITIAL_PROPERTIES);
                      setProfileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-neutral-700 hover:bg-[#f2f4f6]"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      restart_alt
                    </span>
                    Restaurar Fotos de Fábrica
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 3. ÁREA PRINCIPAL DINÁMICA */}
        <main className="mx-auto max-w-[1440px] p-4 sm:p-8">
          {activeNav === "executive" && (
            <ExecutiveDashboardView
              properties={properties}
              prospects={prospects}
              appointments={appointments}
              favorites={favorites}
              currency={currency}
              onToggleFavorite={handleToggleFavorite}
              onOpenPhotoModal={(prop) => setPhotoModalProp(prop)}
              onOpenDossierModal={(prop) => setDossierModalProp(prop)}
              onAddAppointment={(appt) =>
                setAppointments((prev) => [appt, ...prev])
              }
              onNavigateSection={(sec) => setActiveNav(sec)}
            />
          )}

          {activeNav === "inventory" && (
            <MasterInventoryView
              properties={properties}
              favorites={favorites}
              comparedIds={comparedIds}
              currency={currency}
              searchQuery={searchQuery}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onOpenPhotoModal={(prop) => setPhotoModalProp(prop)}
              onOpenDossierModal={(prop) => setDossierModalProp(prop)}
            />
          )}

          {activeNav === "favorites" && (
            <MasterInventoryView
              properties={properties}
              favorites={favorites}
              comparedIds={comparedIds}
              currency={currency}
              onlyFavoritesMode={true}
              searchQuery={searchQuery}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onOpenPhotoModal={(prop) => setPhotoModalProp(prop)}
              onOpenDossierModal={(prop) => setDossierModalProp(prop)}
            />
          )}

          {activeNav === "comparator" && (
            <ComparatorView
              properties={properties}
              comparedIds={comparedIds}
              currency={currency}
              onToggleCompare={handleToggleCompare}
              onOpenDossierModal={(prop) => setDossierModalProp(prop)}
            />
          )}

          {activeNav === "crm" && (
            <CrmPipelineView
              prospects={prospects}
              currency={currency}
              onUpdateStage={handleUpdateProspectStage}
              onUpdateNotes={handleUpdateProspectNotes}
              onOpenNewLeadModal={() => setQuickLeadModalOpen(true)}
            />
          )}

          {activeNav === "clients" && (
            <ClientManagerView
              clients={clients}
              properties={properties}
              currency={currency}
              onUpdateClientTag={handleUpdateClientTag}
              onToggleClientProperty={handleToggleClientProperty}
              onOpenDossier={(prop) => setDossierModalProp(prop)}
            />
          )}

          {activeNav === "calculator" && (
            <FinancialCalculatorView
              properties={properties}
              currency={currency}
            />
          )}

          {activeNav === "copilot" && <AtlasCopilotView />}

          {activeNav === "agency" && (
            <AgencySuiteView
              brokers={brokers}
              currency={currency}
              whiteLabel={whiteLabel}
              onUpdateWhiteLabel={setWhiteLabel}
              onAssignRoundRobinLead={handleAssignRoundRobinLead}
              roundRobinPointer={roundRobinPointer}
            />
          )}

          {activeNav === "directory" && <DirectoryView />}

          {activeNav === "drives" && (
            <DriveAuditView
              audits={driveAudits}
              onRunDriveSync={handleRunDriveSync}
            />
          )}

          {activeNav === "security" && (
            <SecurityVaultView
              membershipTier={membershipTier}
              onChangeMembershipTier={(tier) => {
                setMembershipTier(tier);
                recordSecurityEvent(
                  "CAMBIO_MEMBRESIA",
                  "INFO",
                  `Nivel de membresía del asesor actualizado a ${MEMBERSHIP_LABELS[tier]}.`
                );
              }}
              securityLogs={securityLogs}
              onRecordSecurityEvent={recordSecurityEvent}
            />
          )}
        </main>
      </div>

      {/* MODALES GLOBALES */}
      {photoModalProp && (
        <PhotoCustomizerModal
          property={
            properties.find((p) => p.id === photoModalProp.id) ?? photoModalProp
          }
          onClose={() => setPhotoModalProp(null)}
          onSavePhoto={handleSaveCustomPhoto}
        />
      )}

      {dossierModalProp && (
        <PropertyDossierModal
          property={
            properties.find((p) => p.id === dossierModalProp.id) ??
            dossierModalProp
          }
          currency={currency}
          whiteLabel={whiteLabel}
          onClose={() => setDossierModalProp(null)}
          onScheduleVisit={() => {
            setQuickLeadModalOpen(true);
          }}
        />
      )}

      {quickLeadModalOpen && (
        <QuickLeadModal
          properties={properties}
          onClose={() => setQuickLeadModalOpen(false)}
          onAddProspect={handleAddProspect}
          onHoneypotTriggered={() =>
            recordSecurityEvent(
              "HONEYPOT_SHIELD",
              "BLOQUEADO",
              "Intento de bot automatizado interceptado en el modal de registro de prospectos."
            )
          }
        />
      )}

      {/* Banner de Consentimiento de Cookies y Privacidad */}
      <CookiePrivacyBanner />
    </div>
  );
};
export default AureaSovereignApp;
