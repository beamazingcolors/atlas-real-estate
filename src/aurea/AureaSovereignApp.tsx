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
  sanitizeSovereignInput,
  usePersistentState,
} from "./storage/useAureaStorage";
import { AtlasBrandLogo } from "./components/AtlasBrandLogo";
import {
  PhotoCustomizerModal,
  PropertyDossierModal,
  QuickLeadModal,
} from "./components/SovereignModals";
import { AtlasHomeOverviewView } from "./views/AtlasHomeOverviewView";
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
  BASICA: "Nivel Básico",
  PRO: "Nivel Pro",
  AGENCIA_CORPORATIVA: "Agencia Corporativa",
};

/* Error Boundary Institucional para Resiliencia y Manejo de Errores */
interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AtlasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || "Error inesperado en la interfaz.",
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#060b13] p-6 text-white">
          <div className="max-w-md border border-slate-800 bg-[#0c1524] p-8">
            <span className="font-['Outfit'] text-[10px] uppercase tracking-[0.26em] text-[#00b4f5]">
              PROTOCOLO DE RECUPERACIÓN · PROYECTO ATLAS
            </span>
            <h2 className="mt-2 font-['Outfit'] text-xl font-semibold">
              Restableciendo vista operativa
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              {this.state.errorMessage}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, errorMessage: "" });
                window.location.reload();
              }}
              className="mt-6 w-full bg-[#0077cc] px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-widest text-white"
            >
              Restaurar Sesión Segura
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AureaSovereignApp: React.FC = () => {
  // Estados persistentes en localStorage
  const [properties, setProperties] = usePersistentState<AureaProperty[]>(
    "proyecto_atlas_properties_v2",
    INITIAL_PROPERTIES
  );
  const [favorites, setFavorites] = usePersistentState<string[]>(
    "proyecto_atlas_favorites_v2",
    ["prop-villa-canto-agua", "prop-sky-penthouse-lumina"]
  );
  const [comparedIds, setComparedIds] = usePersistentState<string[]>(
    "proyecto_atlas_compared_v2",
    [
      "prop-villa-canto-agua",
      "prop-sky-penthouse-lumina",
      "prop-isla-pok-ta-pok",
    ]
  );
  const [prospects, setProspects] = usePersistentState<CrmProspect[]>(
    "proyecto_atlas_prospects_v2",
    INITIAL_PROSPECTS
  );
  const [clients, setClients] = usePersistentState<PrivateClient[]>(
    "proyecto_atlas_clients_v2",
    INITIAL_CLIENTS
  );
  const [appointments, setAppointments] = usePersistentState<VipAppointment[]>(
    "proyecto_atlas_appointments_v2",
    INITIAL_VIP_APPOINTMENTS
  );
  const [brokers, setBrokers] = usePersistentState<BrokerAgentMember[]>(
    "proyecto_atlas_brokers_v2",
    INITIAL_BROKER_TEAM
  );
  const [roundRobinPointer, setRoundRobinPointer] = usePersistentState<number>(
    "proyecto_atlas_round_robin_ptr_v2",
    0
  );
  const [driveAudits, setDriveAudits] = usePersistentState<DriveAuditItem[]>(
    "proyecto_atlas_drive_audits_v2",
    INITIAL_DRIVE_AUDITS
  );
  const [securityLogs, setSecurityLogs] = usePersistentState<
    SecurityAuditEvent[]
  >("proyecto_atlas_security_logs_v2", INITIAL_SECURITY_LOGS);
  const [currency, setCurrency] = usePersistentState<CurrencyCode>(
    "proyecto_atlas_currency_v2",
    "USD"
  );
  const [membershipTier, setMembershipTier] =
    usePersistentState<MembershipTier>(
      "proyecto_atlas_membership_tier_v2",
      "AGENCIA_CORPORATIVA"
    );
  const [whiteLabel, setWhiteLabel] = usePersistentState<WhiteLabelConfig>(
    "proyecto_atlas_whitelabel_v2",
    {
      agencyName: "PROYECTO ATLAS",
      monogram: "PA",
      subtitle: "REAL ESTATE PLATFORM",
      agencySplitPct: 40,
      brokerSplitPct: 60,
    }
  );
  const [isDarkMode, setIsDarkMode] = usePersistentState<boolean>(
    "proyecto_atlas_dark_mode_v2",
    false
  );

  // Navegación y modales
  const [activeNav, setActiveNav] = useState<NavSectionId>("home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [photoModalProp, setPhotoModalProp] = useState<AureaProperty | null>(
    null
  );
  const [dossierModalProp, setDossierModalProp] =
    useState<AureaProperty | null>(null);
  const [quickLeadModalOpen, setQuickLeadModalOpen] = useState(false);

  // Exit-Intent / Concierge Modal & Validación de Error
  const [exitConciergeOpen, setExitConciergeOpen] = useState(false);
  const [exitDismissedSession, setExitDismissedSession] = useState(false);
  const [conciergeEmail, setConciergeEmail] = useState("");
  const [conciergeError, setConciergeError] = useState<string | null>(null);
  const [conciergeSuccess, setConciergeSuccess] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sincronización del Modo Oscuro con <html>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("atlas-dark", isDarkMode);
    }
  }, [isDarkMode]);

  // Listener pasivo de Scroll para Botón "Volver Arriba" (Optimización de velocidad)
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detección de Exit-Intent cuando el cursor sale por la parte superior
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        e.clientY <= 6 &&
        !exitDismissedSession &&
        !photoModalProp &&
        !dossierModalProp &&
        !quickLeadModalOpen
      ) {
        setExitConciergeOpen(true);
        setExitDismissedSession(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [
    exitDismissedSession,
    photoModalProp,
    dossierModalProp,
    quickLeadModalOpen,
  ]);

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
        setExitConciergeOpen(false);
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
      originIp: "189.203.44.12 (Sesión Proyecto Atlas)",
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
        email: "familyoffice@proyectoatlas.mx",
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

  // Handler de envío en modal Exit-Intent con validación de errores
  const handleConciergeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = sanitizeSovereignInput(conciergeEmail).clean;
    if (!cleaned || !cleaned.includes("@") || !cleaned.includes(".")) {
      setConciergeError(
        "Por favor ingresa un correo electrónico corporativo válido (ej. direccion@familyoffice.com)."
      );
      return;
    }
    setConciergeError(null);
    setConciergeSuccess(true);
    setTimeout(() => {
      setExitConciergeOpen(false);
      setConciergeSuccess(false);
      setConciergeEmail("");
      setDossierModalProp(properties[0]);
    }, 1100);
  };

  // Secciones del Sidebar (sin badges ni dots, solo tipografía y cifras limpias)
  const navGroups: {
    groupTitle: string;
    items: { id: NavSectionId; label: string; icon: string; meta?: string }[];
  }[] = [
    {
      groupTitle: "DIRECCIÓN",
      items: [
        {
          id: "home",
          label: "Inicio · Proyecto Atlas",
          icon: "home_work",
          meta: "I",
        },
      ],
    },
    {
      groupTitle: "OPERACIONES",
      items: [
        {
          id: "executive",
          label: "Tablero Ejecutivo",
          icon: "space_dashboard",
        },
        {
          id: "inventory",
          label: "Inventario Completo",
          icon: "apartment",
          meta: `${properties.length}`,
        },
        {
          id: "crm",
          label: "CRM Pipeline",
          icon: "view_kanban",
          meta: `${prospects.length}`,
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
          meta: `${comparedIds.length}/3`,
        },
        {
          id: "calculator",
          label: "Calculadora Financiera & ROI",
          icon: "calculate",
        },
        {
          id: "copilot",
          label: "Atlas Copilot (IA)",
          icon: "temp_preferences_custom",
        },
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AtlasErrorBoundary>
      <div
        className={`atlas-shell min-h-screen pb-16 lg:pb-0 font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-300 ${
          isDarkMode
            ? "bg-[#060b13] text-slate-100"
            : "bg-[#f8f9fa] text-[#091e3a]"
        }`}
      >
        {/* Overlay móvil para el Sidebar */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/65 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* 1. SIDEBAR LATERAL FIJO (w-72 / 18rem) */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#050c17] text-white transition-transform duration-300 lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Encabezado con Logo Oficial de Proyecto Atlas */}
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleSelectNav("home")}
                className="flex items-center gap-3.5 text-left group"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-[#091e3a] p-1.5 transition group-hover:border-[#00b4f5]">
                  <AtlasBrandLogo
                    variant="icon"
                    theme="dark"
                    className="h-8 w-8"
                  />
                </div>
                <div>
                  <div className="font-['Outfit'] text-sm font-semibold tracking-[0.16em] text-white">
                    {whiteLabel.agencyName}
                  </div>
                  <div className="mt-0.5 font-['Outfit'] text-[9px] font-medium uppercase tracking-[0.24em] text-[#00b4f5]">
                    {whiteLabel.subtitle}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="border border-white/20 p-1 text-neutral-400 hover:text-white lg:hidden"
                aria-label="Cerrar menú lateral"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            {/* Línea de estado editorial limpia (sin dots ni badges) */}
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 font-['Outfit'] text-[10px] uppercase tracking-[0.22em] text-slate-400">
              <span>Malla de Datos</span>
              <span className="text-[#00b4f5]">Activa</span>
            </div>
          </div>

          {/* Navegación Principal Agrupada */}
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            {navGroups.map((group) => (
              <div key={group.groupTitle}>
                <div className="px-2 font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
                  {group.groupTitle}
                </div>
                <nav className="mt-2 space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectNav(item.id)}
                        className={`flex w-full items-center justify-between border-l-2 px-3 py-2.5 text-left font-['Outfit'] text-xs transition-all ${
                          isActive
                            ? "border-[#00b4f5] bg-white/[0.06] font-semibold text-white"
                            : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[16px]">
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </span>
                        {item.meta && (
                          <span className="font-['Outfit'] text-[11px] font-light tabular-nums text-slate-500">
                            {item.meta}
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
              <div className="px-2 font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
                BÓVEDA &amp; DOSSIERS
              </div>
              <div className="mt-2 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleSelectNav("favorites")}
                  className={`flex w-full items-center justify-between border-l-2 px-3 py-2.5 text-left font-['Outfit'] text-xs transition-all ${
                    activeNav === "favorites"
                      ? "border-[#00b4f5] bg-white/[0.06] font-semibold text-white"
                      : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[16px]">
                      bookmark
                    </span>
                    <span>Favoritos en Cartera</span>
                  </span>
                  <span className="font-['Outfit'] text-[11px] tabular-nums text-slate-400">
                    {favorites.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectNav("security")}
                  className={`flex w-full items-center justify-between border-l-2 px-3 py-2.5 text-left font-['Outfit'] text-xs transition-all ${
                    activeNav === "security"
                      ? "border-[#00b4f5] bg-white/[0.06] font-semibold text-white"
                      : "border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[16px]">
                      encrypted
                    </span>
                    <span>Bóveda de Seguridad</span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDossierModalProp(properties[0]);
                    setMobileSidebarOpen(false);
                  }}
                  className="mt-2 flex w-full items-center justify-between border border-white/15 bg-[#091e3a] px-3.5 py-2.5 text-left font-['Outfit'] text-xs font-medium uppercase tracking-wider text-white transition hover:border-[#00b4f5]"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[16px] text-[#00b4f5]">
                      description
                    </span>
                    <span>Generar Dossier PDF</span>
                  </span>
                  <span className="material-symbols-outlined text-[14px]">
                    north_east
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Tarjeta Editorial del CEO al Pie del Sidebar (Andre Fraga) */}
          <div className="border-t border-white/10 bg-[#091322] p-4">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleSelectNav("home")}
                className="flex items-center gap-3 text-left"
              >
                <img
                  src="/andre-fraga-ceo.jpg"
                  alt="Andre Fraga — CEO"
                  className="h-9 w-9 border border-white/20 object-cover object-top"
                />
                <div className="min-w-0">
                  <div className="truncate font-['Outfit'] text-xs font-semibold text-white">
                    Andre Fraga
                  </div>
                  <div className="truncate font-['Outfit'] text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    CEO · {MEMBERSHIP_LABELS[membershipTier]}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectNav("security")}
                title="Configuración de Perfil y Bóveda"
                className="border border-white/15 p-1.5 text-slate-400 hover:border-white hover:text-white"
              >
                <span className="material-symbols-outlined text-[16px]">
                  tune
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* CONTENEDOR PRINCIPAL A LA DERECHA DEL SIDEBAR */}
        <div className="lg:pl-72">
          {/* 2. HEADER SUPERIOR FLOTANTE (h-20) */}
          <header
            className={`sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b px-4 backdrop-blur-md transition-colors sm:px-8 ${
              isDarkMode
                ? "border-[#1e2f48] bg-[#060b13]/90 text-white"
                : "border-[#e2e6ec] bg-white/95 text-[#091e3a]"
            }`}
          >
            {/* Izquierda: Botón Hamburguesa (Móvil) + Identidad + Búsqueda Predictiva Ctrl+K */}
            <div className="flex flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className={`inline-flex h-10 w-10 items-center justify-center border lg:hidden ${
                  isDarkMode
                    ? "border-slate-700 bg-[#0c1524] text-white"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-black"
                }`}
                aria-label="Abrir menú"
              >
                <span className="material-symbols-outlined text-[20px]">
                  menu
                </span>
              </button>

              {/* Marca clicable en el Header */}
              <button
                type="button"
                onClick={() => handleSelectNav("home")}
                className={`hidden items-center gap-2.5 border px-3 py-1.5 transition sm:inline-flex ${
                  isDarkMode
                    ? "border-slate-800 bg-[#0c1524] text-white hover:border-[#00b4f5]"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a]"
                }`}
                title="Ir a la Página de Inicio de Proyecto Atlas"
              >
                <AtlasBrandLogo
                  variant="icon"
                  theme={isDarkMode ? "dark" : "light"}
                  className="h-5 w-5"
                />
                <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em]">
                  PROYECTO ATLAS
                </span>
              </button>

              <div className="relative w-full max-w-md">
                <div
                  className={`flex items-center border px-3 py-2 ${
                    isDarkMode
                      ? "border-slate-800 bg-[#0c1524] text-white"
                      : "border-[#eaedf0] bg-[#f2f4f6] text-black"
                  }`}
                >
                  <span className="material-symbols-outlined mr-2 text-[17px] text-neutral-400">
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
                    placeholder="Buscar propiedad, zona o código (Ctrl + K)..."
                    className="w-full bg-transparent text-xs focus:outline-none"
                  />
                  <kbd className="hidden border border-neutral-400/30 px-1.5 py-0.5 font-['Outfit'] text-[10px] text-neutral-400 sm:inline-block">
                    Ctrl + K
                  </kbd>
                </div>

                {/* Resultados predictivos */}
                {searchDropdownOpen && predictiveResults.length > 0 && (
                  <div
                    className={`absolute left-0 right-0 top-12 z-50 border p-2 shadow-2xl ${
                      isDarkMode
                        ? "border-slate-700 bg-[#0c1524] text-white"
                        : "border-[#091e3a] bg-white text-black"
                    }`}
                  >
                    <div className="px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0077cc]">
                      Resultados en Proyecto Atlas
                    </div>
                    {predictiveResults.map((prop) => (
                      <button
                        key={prop.id}
                        type="button"
                        onClick={() => {
                          setDossierModalProp(prop);
                          setSearchDropdownOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-2.5 py-2 text-left text-xs hover:bg-[#0077cc]/10"
                      >
                        <div>
                          <div className="font-['Outfit'] font-semibold">
                            {prop.name}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {prop.zone} · {prop.code}
                          </div>
                        </div>
                        <span className="font-['Outfit'] text-xs font-semibold text-[#0077cc]">
                          {formatSovereignCurrency(
                            prop.priceUsd,
                            currency,
                            true
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Derecha: Divisas, Modo Oscuro, Registrar Prospecto y Perfil CEO */}
            <div className="flex items-center gap-2">
              {/* Selector de Divisas USD / MXN / EUR */}
              <div
                className={`flex items-center border p-0.5 ${
                  isDarkMode
                    ? "border-slate-800 bg-[#0c1524]"
                    : "border-[#eaedf0] bg-[#f2f4f6]"
                }`}
                role="group"
                aria-label="Selector de divisa"
              >
                {(["USD", "MXN", "EUR"] as CurrencyCode[]).map((code) => {
                  const active = currency === code;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setCurrency(code)}
                      className={`px-2.5 py-1 font-['Outfit'] text-[11px] font-semibold tracking-wider transition ${
                        active
                          ? "bg-[#091e3a] text-white"
                          : "text-neutral-500 hover:text-current"
                      }`}
                    >
                      {code}
                    </button>
                  );
                })}
              </div>

              {/* Botón para Modo Oscuro / Claro */}
              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className={`atlas-btn-secondary inline-flex h-9 items-center gap-1.5 border px-3 font-['Outfit'] text-[11px] font-medium uppercase tracking-wider ${
                  isDarkMode
                    ? "border-slate-700 bg-[#0c1524] text-[#00b4f5] hover:border-[#00b4f5]"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a]"
                }`}
                title={
                  isDarkMode ? "Cambiar a Modo Claro" : "Activar Modo Oscuro"
                }
                aria-label="Alternar modo oscuro"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isDarkMode ? "light_mode" : "dark_mode"}
                </span>
                <span className="hidden md:inline">
                  {isDarkMode ? "Claro" : "Oscuro"}
                </span>
              </button>

              {/* Botón Registrar Prospecto */}
              <button
                type="button"
                onClick={() => setQuickLeadModalOpen(true)}
                className="atlas-btn-primary hidden items-center gap-1.5 bg-[#091e3a] px-3.5 py-2 font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.16em] text-white md:inline-flex"
              >
                <span className="material-symbols-outlined text-[15px] text-[#00b4f5]">
                  person_add
                </span>
                <span>Registrar Prospecto</span>
              </button>

              {/* Menú de Perfil Rápido (CEO Andre Fraga) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className={`flex h-9 items-center gap-2 border px-2.5 text-xs font-medium ${
                    isDarkMode
                      ? "border-slate-700 bg-[#0c1524] text-white"
                      : "border-[#eaedf0] bg-white text-[#091e3a]"
                  }`}
                >
                  <img
                    src="/andre-fraga-ceo.jpg"
                    alt="Andre Fraga"
                    className="h-6 w-6 object-cover object-top"
                  />
                  <span className="hidden font-['Outfit'] text-xs font-semibold sm:inline">
                    Andre Fraga
                  </span>
                  <span className="material-symbols-outlined text-[15px]">
                    expand_more
                  </span>
                </button>

                {profileMenuOpen && (
                  <div
                    className={`absolute right-0 top-11 z-50 w-60 border p-2 shadow-xl ${
                      isDarkMode
                        ? "border-slate-700 bg-[#0c1524] text-white"
                        : "border-[#091e3a] bg-white text-black"
                    }`}
                  >
                    <div className="border-b border-[#eaedf0]/30 px-3 py-2.5">
                      <div className="font-['Outfit'] text-xs font-semibold">
                        Andre Fraga
                      </div>
                      <div className="font-['Outfit'] text-[10px] uppercase tracking-wider text-[#0077cc]">
                        CEO &amp; Founder · {MEMBERSHIP_LABELS[membershipTier]}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectNav("home");
                        setProfileMenuOpen(false);
                      }}
                      className="mt-1 flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-[#0077cc]/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        home_work
                      </span>
                      Inicio · Resumen Proyecto Atlas
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectNav("security");
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-[#0077cc]/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        shield_lock
                      </span>
                      Bóveda de Seguridad &amp; Plan
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProperties(INITIAL_PROPERTIES);
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-[#0077cc]/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        restart_alt
                      </span>
                      Restaurar Fotos Originales
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* 3. ÁREA PRINCIPAL DINÁMICA CON TRANSICIÓN SUAVE */}
          <main
            key={activeNav}
            className="animate-view-transition mx-auto max-w-[1440px] p-4 sm:p-8"
          >
            {activeNav === "home" && (
              <AtlasHomeOverviewView
                properties={properties}
                currency={currency}
                isDarkMode={isDarkMode}
                onNavigate={(sec) => handleSelectNav(sec)}
                onOpenDossier={(prop) => setDossierModalProp(prop)}
                onOpenExitConcierge={() => setExitConciergeOpen(true)}
              />
            )}

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
                onNavigateSection={(sec) => handleSelectNav(sec)}
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
                    `Nivel de membresía actualizado a ${MEMBERSHIP_LABELS[tier]}.`
                  );
                }}
                securityLogs={securityLogs}
                onRecordSecurityEvent={recordSecurityEvent}
              />
            )}
          </main>
        </div>

        {/* BARRA DE NAVEGACIÓN MÓVIL FIJA INFERIOR (Mobile Responsiveness) */}
        <nav
          aria-label="Navegación móvil rápida"
          className={`fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t lg:hidden ${
            isDarkMode
              ? "border-slate-800 bg-[#060b13]/95 text-slate-300"
              : "border-[#e2e6ec] bg-white/95 text-neutral-600"
          } backdrop-blur-md`}
        >
          {(
            [
              { id: "home", label: "Inicio", icon: "home_work" },
              { id: "executive", label: "Mando", icon: "space_dashboard" },
              { id: "inventory", label: "Activos", icon: "apartment" },
              { id: "crm", label: "CRM", icon: "view_kanban" },
              { id: "copilot", label: "Copilot", icon: "temp_preferences_custom" },
            ] as { id: NavSectionId; label: string; icon: string }[]
          ).map((tab) => {
            const active = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelectNav(tab.id)}
                className={`flex flex-col items-center justify-center py-2.5 font-['Outfit'] text-[10px] uppercase tracking-wider transition ${
                  active
                    ? "font-semibold text-[#0077cc]"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {tab.icon}
                </span>
                <span className="mt-1">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* BOTÓN FLOTANTE PARA VOLVER ARRIBA (Back to Top) */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Volver arriba"
          className={`fixed bottom-20 right-5 z-40 flex h-11 w-11 items-center justify-center border bg-[#091e3a] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#0077cc] lg:bottom-7 lg:right-7 ${
            showBackToTop
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          } border-white/15`}
        >
          <span className="material-symbols-outlined text-[18px]">
            north
          </span>
        </button>

        {/* MODAL DE EXIT-INTENT & SOLICITUD DE DOSSIER CON VALIDACIÓN DE ERROR */}
        {exitConciergeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div
              className={`w-full max-w-lg border p-8 shadow-2xl ${
                isDarkMode
                  ? "border-slate-700 bg-[#0c1524] text-white"
                  : "border-[#091e3a] bg-white text-[#091e3a]"
              }`}
            >
              <div className="flex items-start justify-between border-b border-[#eaedf0]/40 pb-4">
                <div>
                  <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0077cc]">
                    DIRECCIÓN PATRIMONIAL · PROYECTO ATLAS
                  </span>
                  <h3 className="mt-1 font-['Outfit'] text-xl font-semibold">
                    Descargar Resumen Ejecutivo &amp; Dossier
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setExitConciergeOpen(false)}
                  className="border border-current/20 px-2.5 py-1 font-['Outfit'] text-xs"
                >
                  Cerrar
                </button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-neutral-500">
                Antes de retirarte, recibe el Dossier Institucional de{" "}
                <strong>Proyecto Atlas</strong> firmado por la oficina de{" "}
                <strong>Andre Fraga (CEO)</strong> con las corridas de Cap Rate y disponibilidad actualizada.
              </p>

              <form onSubmit={handleConciergeSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em]">
                    Correo Corporativo o Patrimonial
                  </label>
                  <input
                    type="text"
                    value={conciergeEmail}
                    onChange={(e) => {
                      setConciergeEmail(e.target.value);
                      if (conciergeError) setConciergeError(null);
                    }}
                    placeholder="direccion@familyoffice.com"
                    className={`mt-1.5 w-full border px-3.5 py-2.5 text-xs focus:outline-none ${
                      isDarkMode
                        ? "border-slate-700 bg-[#091322] text-white"
                        : "border-[#d8dee6] bg-[#f8f9fa] text-black"
                    }`}
                  />
                  {conciergeError && (
                    <p className="mt-2 border-l-2 border-rose-600 pl-2.5 text-[11px] text-rose-500">
                      {conciergeError}
                    </p>
                  )}
                  {conciergeSuccess && (
                    <p className="mt-2 border-l-2 border-emerald-500 pl-2.5 text-[11px] text-emerald-500">
                      Solicitud validada. Abriendo el Dossier Ejecutivo...
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setExitConciergeOpen(false)}
                    className="border border-current/20 px-4 py-2.5 font-['Outfit'] text-xs uppercase tracking-wider"
                  >
                    Continuar Explorando
                  </button>
                  <button
                    type="submit"
                    className="atlas-btn-primary bg-[#091e3a] px-5 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white"
                  >
                    Abrir Dossier Oficial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODALES GLOBALES */}
        {photoModalProp && (
          <PhotoCustomizerModal
            property={
              properties.find((p) => p.id === photoModalProp.id) ??
              photoModalProp
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
    </AtlasErrorBoundary>
  );
};
export default AureaSovereignApp;
