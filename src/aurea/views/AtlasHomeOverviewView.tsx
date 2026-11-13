import React, { useEffect, useRef, useState } from "react";
import {
  AureaProperty,
  CurrencyCode,
  InteractiveOptionDetail,
  NavSectionId,
} from "../types";
import { formatSovereignCurrency } from "../storage/useAureaStorage";
import { AtlasBrandLogo } from "../components/AtlasBrandLogo";
import { DossierTabKey } from "../components/SovereignModals";
import { RealInteractiveMap } from "../components/RealInteractiveMap";
import {
  STRATEGIC_5Y_ROADMAP,
  TEN_CORE_MODULES,
} from "../data/strategicPlanData";

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

const ScrollRevealSection: React.FC<ScrollRevealProps> = ({
  children,
  delayMs = 0,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

type OnboardingStepId = 1 | 2 | 3 | 4 | 5;
type NewUserRoleKey = "BROKER" | "INVERSIONISTA" | "DESARROLLADOR";

interface AtlasHomeOverviewViewProps {
  properties: AureaProperty[];
  currency: CurrencyCode;
  isDarkMode?: boolean;
  onNavigate: (section: NavSectionId) => void;
  onOpenDossier: (property: AureaProperty, initialTab?: DossierTabKey) => void;
  onOpenOptionDetail: (detail: InteractiveOptionDetail) => void;
  onOpenExitConcierge?: () => void;
}

export const AtlasHomeOverviewView: React.FC<AtlasHomeOverviewViewProps> = ({
  properties,
  currency,
  isDarkMode = false,
  onNavigate,
  onOpenDossier,
  onOpenOptionDetail,
  onOpenExitConcierge,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStepId>(1);
  const [viewMode, setViewMode] = useState<"GUIDED_STEPS" | "FULL_OVERVIEW">(
    "GUIDED_STEPS"
  );
  const [selectedUserRole, setSelectedUserRole] =
    useState<NewUserRoleKey>("BROKER");
  const [selectedMapProperty, setSelectedMapProperty] =
    useState<AureaProperty>(properties[0]);

  const stepAnchorRef = useRef<HTMLDivElement | null>(null);

  const totalUnitsAvailable = properties.reduce(
    (acc, p) => acc + p.availableUnits,
    0
  );

  const handleSelectStep = (step: OnboardingStepId) => {
    setViewMode("GUIDED_STEPS");
    setCurrentStep(step);
    stepAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const STEPS_META: {
    id: OnboardingStepId;
    shortTitle: string;
    fullTitle: string;
    subtitle: string;
    outcomeLabel: string;
  }[] = [
    {
      id: 1,
      shortTitle: "Bienvenida y Perfil",
      fullTitle: "Paso 1 · Conoce Proyecto Atlas y Elige tu Perfil",
      subtitle:
        "Entiende en 1 minuto qué resuelve la plataforma, quién la dirige y qué módulos usar primero según tu rol.",
      outcomeLabel: "Claridad inicial y ruta recomendada",
    },
    {
      id: 2,
      shortTitle: "Desarrollos y Drive",
      fullTitle: "Paso 2 · Explora los Desarrollos y su Carpeta Google Drive",
      subtitle:
        "Cada desarrollo ya tiene sus fotos, brochures, inventario de precios, planes de pago y fichas técnicas listos para abrir.",
      outcomeLabel: "Toda la información comercial en mano",
    },
    {
      id: 3,
      shortTitle: "Mapa, ROI e IA",
      fullTitle: "Paso 3 · Ubica en Mapa Real, Calcula ROI y Consulta Atlas AI",
      subtitle:
        "Valida ubicaciones reales por satélite, compara desarrollos lado a lado y simula la rentabilidad financiera.",
      outcomeLabel: "Análisis patrimonial respaldado por datos",
    },
    {
      id: 4,
      shortTitle: "CRM y Marketplace",
      fullTitle: "Paso 4 · Gestiona Clientes y Cierra con Aliados Certificados",
      subtitle:
        "Lleva el seguimiento de cada prospecto en el CRM Kanban y contrata notarías, hipotecas, seguros o interiorismo.",
      outcomeLabel: "Operación y cierre profesional de punta a punta",
    },
    {
      id: 5,
      shortTitle: "Visión 5 Años",
      fullTitle: "Paso 5 · Descubre el Plan Estratégico a 5 Años y los 10 Módulos",
      subtitle:
        "Visualiza la hoja de ruta completa (Año 1 a Año 5), los KPIs de crecimiento y el Portal para Desarrolladores.",
      outcomeLabel: "Visión completa del ecosistema Atlas",
    },
  ];

  const ROLE_RECOMMENDATIONS: Record<
    NewUserRoleKey,
    {
      label: string;
      headline: string;
      description: string;
      recommendedActions: {
        title: string;
        detail: string;
        nav: NavSectionId;
        cta: string;
      }[];
    }
  > = {
    BROKER: {
      label: "Soy Asesor o Broker",
      headline: "Vende más rápido con inventario verificado y seguimiento automatizado",
      description:
        "Accede a listas de precios actualizadas de Google Drive, genera dossieres en un clic, organiza a tus clientes en el CRM Kanban y gana comisiones por referencia en el Marketplace.",
      recommendedActions: [
        {
          title: "1. Consultar Inventario y Drive",
          detail:
            "Abre fotos, brochures ES/EN y cotizador de descuentos para tus clientes.",
          nav: "inventory",
          cta: "Ir a Inventario",
        },
        {
          title: "2. Registrar Prospectos en CRM",
          detail:
            "Controla tus 6 etapas de venta con seguimiento directo por WhatsApp.",
          nav: "crm",
          cta: "Abrir CRM",
        },
        {
          title: "3. Apoyarte en Atlas AI",
          detail:
            "Redacta propuestas, resuelve dudas de fideicomisos y resume conversaciones.",
          nav: "copilot",
          cta: "Usar Atlas AI",
        },
      ],
    },
    INVERSIONISTA: {
      label: "Soy Inversionista o Comprador",
      headline: "Evalúa ubicaciones reales, descuentos de preventa y retorno neto",
      description:
        "Compara desarrollos frente a Laguna Nichupté, Huayacán y Playa del Carmen, calcula el Cap Rate real y valida toda la certeza jurídica bajo normativa NOM-247.",
      recommendedActions: [
        {
          title: "1. Comparar hasta 3 Desarrollos",
          detail:
            "Revisa precio por m², mantenimiento, ROI anual y plusvalía a 5 años.",
          nav: "comparator",
          cta: "Abrir Comparador",
        },
        {
          title: "2. Simular tu Flujo de Caja",
          detail:
            "Ajusta enganche, ocupación y tarifa por noche (ADR) en USD, MXN o EUR.",
          nav: "calculator",
          cta: "Abrir Calculadora",
        },
        {
          title: "3. Contratar Aliados Certificados",
          detail:
            "Conecta con notarías, brokers hipotecarios, interiorismo y administración de rentas.",
          nav: "directory",
          cta: "Ver Marketplace",
        },
      ],
    },
    DESARROLLADOR: {
      label: "Soy Desarrollador o Agencia",
      headline: "Publica inventario en tiempo real y conecta tu CRM o ERP por API",
      description:
        "Centraliza tus carpetas comerciales, actualiza unidades disponibles al instante, gestiona firma electrónica y coordina tu fuerza de ventas con asignación Round-Robin.",
      recommendedActions: [
        {
          title: "1. Portal de Desarrolladores & API",
          detail:
            "Edita unidades disponibles, precios y conecta HubSpot, Salesforce o SAP.",
          nav: "developers",
          cta: "Abrir Portal Dev",
        },
        {
          title: "2. Auditoría Semanal de Drives",
          detail:
            "Verifica que todas las listas de precios y planos estén vigentes para los brokers.",
          nav: "drives",
          cta: "Ver Auditoría",
        },
        {
          title: "3. Suite Agencia Multi-Broker",
          detail:
            "Configura marca blanca, reparto de leads Round-Robin y split de comisiones.",
          nav: "agency",
          cta: "Abrir Suite Agencia",
        },
      ],
    },
  };

  const HERO_KPI_DETAILS: {
    label: string;
    value: string;
    accentClass: string;
    detail: InteractiveOptionDetail;
  }[] = [
    {
      label: "Volumen en Cartera",
      value: formatSovereignCurrency(48500000, currency, true),
      accentClass: isDarkMode ? "text-white" : "text-[#091e3a]",
      detail: {
        id: "kpi-volumen",
        kicker: "MÉTRICA PATRIMONIAL · PROYECTO ATLAS",
        title: "Volumen Total en Cartera Gestionada ($48.5M USD)",
        subtitle:
          "Inventario Auditado en Cancún, Huayacán y Playa del Carmen",
        executiveSummary:
          "Representa el valor agregado del inventario activo sincronizado desde las carpetas oficiales de Google Drive de cada desarrollador (Nautica Residences Torres A y B, The Villas Collection, Isla Blanca Residences, Hodela Apartments, Prana Towers y Real Amalfi / Arrecifes del Caribe).",
        keyMetrics: [
          {
            label: "Valor Cartera Activa",
            value: formatSovereignCurrency(48500000, currency, true),
          },
          {
            label: "Unidades Disponibles",
            value: `${totalUnitsAvailable} Unidades`,
          },
          { label: "Comisión Media", value: "5.0% a 6.0%" },
        ],
        bulletPoints: [
          "Precios oficiales verificados directamente de listas de precios vigentes en Pesos Mexicanos (MXN) con conversión dinámica a USD y EUR.",
          "Incluye departamentos desde 71.25 m² hasta Villas de 275.58 m² y Penthouses de 261.40 m².",
          "Acceso inmediato a Cartas Oferta, cuentas bancarias fiduciarias y checklists de compraventa.",
        ],
        deliverables: [
          "Listas de Precios Vigentes",
          "Inventario por Torre y Nivel",
          "Simulador de Planes de Pago",
        ],
        actionLabel: "Explorar Inventario Completo",
        targetNav: "inventory",
      },
    },
    {
      label: "Unidades en Drive",
      value: `${totalUnitsAvailable} Unidades`,
      accentClass: "text-[#0077cc]",
      detail: {
        id: "kpi-unidades",
        kicker: "AUDITORÍA GOOGLE DRIVE · PROYECTO ATLAS",
        title: "Unidades Auditadas en Tiempo Real",
        subtitle: "Sincronización Documental con Desarrolladores",
        executiveSummary:
          "Cada desarrollo integrado en Proyecto Atlas cuenta con su expediente completo de Google Drive analizado y estructurado: Renders HD, Brochures en Español e Inglés, Inventario por nivel, Planes de Pago con descuentos autorizados y Fichas Técnicas con plantas ambientadas.",
        keyMetrics: [
          { label: "Nautica Torres A & B", value: "42 Unidades" },
          { label: "The Villas Collection", value: "11 Villas" },
          { label: "Isla Blanca / Hodela / Prana", value: "34 Unidades" },
        ],
        bulletPoints: [
          "Nautica Residences by Naúma: Torres A y B de 17 niveles (77m) frente a Laguna Nichupté.",
          "The Villas Collection: Villas Aelora, Elara, Calypso, Solandra, Marova y Navia de 2 niveles.",
          "Isla Blanca Residences (Artigas Arquitectos), Hodela Apartments (Grupo Logar) y Prana Towers (Almaré).",
        ],
        deliverables: [
          "Brochures ES / EN",
          "Plantas Ambientadas",
          "Vistas Dron por Nivel",
        ],
        actionLabel: "Ver Auditoría de Drives",
        targetNav: "drives",
      },
    },
    {
      label: "Rendimiento Anual",
      value: "11.9% — 14.2%",
      accentClass: isDarkMode ? "text-emerald-400" : "text-[#004044]",
      detail: {
        id: "kpi-roi",
        kicker: "INGENIERÍA FINANCIERA · PROYECTO ATLAS",
        title: "Retorno Anual Proyectado (Cap Rate & Plusvalía)",
        subtitle: "Modelado de Rentas Vacacionales y Descuentos de Preventa",
        executiveSummary:
          "El rendimiento combinado integra el flujo neto por operación vacacional (ADR y ocupación) más el descuento directo de entrada en esquemas de preventa (hasta 8% en Nautica Residences y 10% en Isla Blanca Residences).",
        keyMetrics: [
          { label: "Cap Rate Neto Estimado", value: "11.9% a 14.2%" },
          { label: "Descuento Preventa", value: "Hasta 8% — 10%" },
          { label: "Plusvalía a 5 Años", value: "+48% a +62%" },
        ],
        bulletPoints: [
          "Nautica Residences: 4% de descuento en esquema 30/40/30, 5% en 50/30/20 y 8% en 80/20.",
          "Isla Blanca Residences: 3% de descuento en 30/20/50, 7% en 50/20/30 y 10% en 90/0/10.",
          "Prana Towers: 2% en 50/40/10, 3% en 70/20/10 y 4% en 90/10 con 85%+ de avance de obra.",
        ],
        deliverables: [
          "Calculadora Financiera Interactiva",
          "Comparador Multidimensional",
          "Corridas en USD / MXN / EUR",
        ],
        actionLabel: "Abrir Calculadora Financiera",
        targetNav: "calculator",
      },
    },
    {
      label: "Ecosistema Integral",
      value: "10 Módulos",
      accentClass: "text-[#755a34]",
      detail: {
        id: "kpi-modulos",
        kicker: "PLAN ESTRATÉGICO 5 AÑOS · PROYECTO ATLAS",
        title: "10 Módulos Principales & Marketplace de 8 Categorías",
        subtitle: "Todo el Ciclo Inmobiliario en un Solo Sistema Operativo",
        executiveSummary:
          "Desde la captación e inventario en Google Drive hasta la firma electrónica, Atlas AI y los servicios complementarios postventa.",
        keyMetrics: [
          { label: "Módulos Core", value: "10 Módulos" },
          { label: "Agentes IA", value: "4 Especialistas" },
          { label: "Marketplace", value: "8 Verticales" },
        ],
        bulletPoints: [
          "CRM Inmobiliario, Inventario, Marketplace, Atlas AI y Comparador Inteligente.",
          "Analítica, Gestión Documental, Automatización, Portal Clientes y Portal Desarrolladores.",
        ],
        deliverables: [
          "Roadmap Año 1 a Año 5",
          "Simulador de Ingresos MRR",
          "Portal Desarrolladores & API",
        ],
        actionLabel: "Ver Plan Estratégico 5 Años",
        targetNav: "masterplan",
      },
    },
  ];

  const TRUST_CERTIFICATES: {
    code: string;
    authority: string;
    title: string;
    detail: string;
    modalDetail: InteractiveOptionDetail;
  }[] = [
    {
      code: "NOM-247-SE-2021",
      authority: "NORMATIVA FEDERAL MÉXICO",
      title: "Cumplimiento en Contratos de Preventa",
      detail:
        "Expedientes técnicos validados con licencias de construcción, planos ejecutivos y protección jurídica del adquirente.",
      modalDetail: {
        id: "cert-nom247",
        kicker: "CUMPLIMIENTO REGULATORIO · NOM-247-SE-2021",
        title: "Norma Oficial Mexicana en Comercialización Inmobiliaria",
        subtitle: "Certeza Documental en Preventas y Contratos de Promesa",
        executiveSummary:
          "Verifica que cada desarrollo comercializado en Proyecto Atlas cuente con información veraz, planos arquitectónicos acotados, especificaciones de acabados, plazos de entrega claros y condiciones transparentes de apartado y reembolso.",
        keyMetrics: [
          { label: "Normativa", value: "NOM-247-SE-2021" },
          { label: "Estatus en Cartera", value: "100% Verificado" },
          { label: "Protección", value: "Adquirente & Inversionista" },
        ],
        bulletPoints: [
          "Cartas Oferta oficiales en Español e Inglés disponibles en Google Drive.",
          "Especificaciones de acabados y equipamiento integradas en cada ficha técnica.",
          "Políticas claras de apartado y reserva reembolsable.",
        ],
        deliverables: [
          "Carta Oferta Oficial ES/EN",
          "Memoria Descriptiva de Acabados",
          "Reglamento de Condominio",
        ],
        actionLabel: "Revisar Auditoría de Drives",
        targetNav: "drives",
      },
    },
    {
      code: "SRE · ARTÍCULO 27",
      authority: "CERTEZA FIDUCIARIA BANCARIA",
      title: "Fideicomisos en Zona Restringida",
      detail:
        "Checklists oficiales para compradores extranjeros y cuentas bancarias habilitadas en USD, EUR y MXN.",
      modalDetail: {
        id: "cert-sre",
        kicker: "ESTRUCTURA FIDUCIARIA · ARTÍCULO 27 CONSTITUCIONAL",
        title: "Adquisición Segura para Extranjeros en Zona Costera",
        subtitle: "Checklists Nacional y Foreign + Cuentas en USD, EUR y MXN",
        executiveSummary:
          "Incluye checklists específicos para compradores extranjeros y nacionales, además de instrucciones de cuentas bancarias en tres divisas.",
        keyMetrics: [
          { label: "Vigencia Fideicomiso", value: "50 Años Renovables" },
          { label: "Cuentas Habilitadas", value: "USD · EUR · MXN" },
          { label: "Checklists KYC", value: "Nacional & Foreign" },
        ],
        bulletPoints: [
          "Derechos fiduciarios plenos para usar, rentar, remodelar, heredar o vender el inmueble.",
          "Asesoría paso a paso mediante Atlas AI.",
        ],
        deliverables: [
          "Checklist Comprador Extranjero PDF",
          "Checklist Comprador Nacional PDF",
          "Cuentas Bancarias USD / EUR / MXN",
        ],
        actionLabel: "Consultar en Atlas AI",
        targetNav: "copilot",
      },
    },
    {
      code: "ISO/IEC 27001 · LFPDPPP",
      authority: "SEGURIDAD DE LA INFORMACIÓN",
      title: "Bóveda Cifrada & Protección de Datos",
      detail:
        "Resguardo de información patrimonial, sanitización contra inyecciones de código y registro de auditoría.",
      modalDetail: {
        id: "cert-iso",
        kicker: "CIBERSEGURIDAD · BÓVEDA PROYECTO ATLAS",
        title: "Escudo de Seguridad & Protección de Datos Patrimoniales",
        subtitle: "Sanitización XSS, Trampa Honeypot y Registro de Auditoría",
        executiveSummary:
          "Protege la identidad y los datos financieros de los clientes y family offices mediante validación estricta de entradas, bloqueo de bots automatizados y persistencia local segura.",
        keyMetrics: [
          { label: "Defensa Anti-Bot", value: "Honeypot Activo" },
          { label: "Filtro de Entrada", value: "Sanitización XSS/SQL" },
          { label: "Normativa Privacidad", value: "LFPDPPP México" },
        ],
        bulletPoints: [
          "Monitoreo en tiempo real de eventos de seguridad en Bóveda de Seguridad.",
          "Control de acceso por nivel de membresía (Básica, Pro y Agencia Corporativa).",
        ],
        deliverables: [
          "Audit Log en Vivo",
          "Simulador de Escudo",
          "Control de Membresías",
        ],
        actionLabel: "Abrir Bóveda de Seguridad",
        targetNav: "security",
      },
    },
    {
      code: "ESTÁNDAR RICS / AMPI",
      authority: "VALUACIÓN & DUE DILIGENCE",
      title: "Auditoría Semanal de Inventario Oficial",
      detail:
        "Sincronización directa con carpetas de Google Drive para validar disponibilidad real y vigencia de listas de precios.",
      modalDetail: {
        id: "cert-rics",
        kicker: "DUE DILIGENCE TÉCNICO · AUDITORÍA DE DRIVES",
        title: "Verificación de Inventario, Planos y Precios en Google Drive",
        subtitle:
          "Trazabilidad Directa con NAÚMA, GMB, ABRE, Grupo Logar y Almaré",
        executiveSummary:
          "Garantiza que las cotizaciones presentadas a los inversionistas correspondan exactamente con la disponibilidad actual de cada torre y desarrollo.",
        keyMetrics: [
          { label: "Desarrollos Sincronizados", value: "6 Carpetas Maestras" },
          { label: "Planos Ejecutivos", value: "100% Completos" },
          { label: "Listas de Precios", value: "Vigentes 2026" },
        ],
        bulletPoints: [
          "Acceso con un clic a la carpeta original de Google Drive de cada desarrollo.",
          "Vistas reales de dron por nivel de altura.",
        ],
        deliverables: [
          "Enlace Directo a Google Drive",
          "CV Desarrolladores & Arquitectos",
          "Vistas Reales con Dron",
        ],
        actionLabel: "Ir a Auditoría de Drives",
        targetNav: "drives",
      },
    },
  ];

  const activeStepMeta =
    STEPS_META.find((s) => s.id === currentStep) ?? STEPS_META[0];
  const activeRoleGuide = ROLE_RECOMMENDATIONS[selectedUserRole];

  const cardSurface = isDarkMode
    ? "border-[#1e2f48] bg-[#0c1524] text-white"
    : "border-[#e2e6ec] bg-white text-[#091e3a]";
  const innerSurface = isDarkMode
    ? "border-slate-800 bg-[#091322] text-white"
    : "border-[#eaedf0] bg-[#f8f9fa] text-[#091e3a]";

  const renderStep1WelcomeAndProfile = () => (
    <section className={`border p-7 sm:p-10 ${cardSurface}`}>
      <div className="border-b border-[#eaedf0]/60 pb-5">
        <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0077cc]">
          PASO 1 DE 5 · BIENVENIDA &amp; ORIENTACIÓN RÁPIDA
        </span>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight">
          ¿Qué es Proyecto Atlas y por dónde empezar?
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Elige tu perfil para recibir una ruta recomendada de 3 acciones simples dentro de la plataforma.
        </p>
      </div>

      {/* Selector de Perfil del Nuevo Usuario */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(["BROKER", "INVERSIONISTA", "DESARROLLADOR"] as NewUserRoleKey[]).map(
              (roleKey) => {
                const isSelected = selectedUserRole === roleKey;
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => setSelectedUserRole(roleKey)}
                    className={`border px-4 py-3 text-left font-['Outfit'] text-xs font-semibold uppercase tracking-wider transition ${
                      isSelected
                        ? "border-[#091e3a] bg-[#091e3a] text-white shadow-sm"
                        : isDarkMode
                        ? "border-slate-700 bg-[#091322] text-slate-300 hover:border-[#00b4f5]"
                        : "border-[#eaedf0] bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a]"
                    }`}
                  >
                    {ROLE_RECOMMENDATIONS[roleKey].label}
                  </button>
                );
              }
            )}
          </div>

          <div className={`border p-6 ${innerSurface}`}>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
              TU RUTA RECOMENDADA ({activeRoleGuide.label})
            </span>
            <h3 className="mt-1.5 font-['Outfit'] text-lg font-semibold">
              {activeRoleGuide.headline}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              {activeRoleGuide.description}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {activeRoleGuide.recommendedActions.map((act) => (
                <button
                  key={act.title}
                  type="button"
                  onClick={() => onNavigate(act.nav)}
                  className={`group flex flex-col justify-between border p-4 text-left transition hover:-translate-y-0.5 ${
                    isDarkMode
                      ? "border-slate-700 bg-[#0c1524] hover:border-[#00b4f5]"
                      : "border-[#eaedf0] bg-white hover:border-[#091e3a]"
                  }`}
                >
                  <div>
                    <div
                      className={`font-['Outfit'] text-xs font-bold ${
                        isDarkMode ? "text-white" : "text-[#091e3a]"
                      }`}
                    >
                      {act.title}
                    </div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">
                      {act.detail}
                    </p>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#0077cc] group-hover:underline">
                    <span>{act.cta}</span>
                    <span>→</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjeta Compacta de Liderazgo — Andre Fraga */}
        <div
          className={`flex flex-col justify-between border p-6 lg:col-span-4 ${innerSurface}`}
        >
          <div className="flex items-center gap-4">
            <div className="h-20 w-16 shrink-0 overflow-hidden border border-[#d8dee6]">
              <img
                src="/andre-fraga-ceo.jpg"
                alt="Andre Fraga — CEO de Proyecto Atlas"
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <span className="font-['Outfit'] text-[9px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
                DIRECCIÓN EJECUTIVA
              </span>
              <h3 className="mt-0.5 font-['Outfit'] text-base font-semibold">
                Andre Fraga
              </h3>
              <p className="font-['Outfit'] text-[10px] uppercase tracking-wider text-[#0077cc]">
                CEO &amp; Founder · Proyecto Atlas
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            “Centralizamos todo el proceso inmobiliario —inventario real de Google Drive, análisis financiero, CRM, inteligencia artificial y aliados certificados— para que cualquier nuevo usuario opere con claridad desde el primer día.”
          </p>

          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#eaedf0]/50 pt-4">
            <button
              type="button"
              onClick={() =>
                onOpenOptionDetail({
                  id: "ceo-mandate",
                  kicker: "DIRECCIÓN EJECUTIVA · ANDRE FRAGA",
                  title: "Tesis Patrimonial & Estándar de Proyecto Atlas",
                  subtitle: "Transparencia Documental en Cancún & Riviera Maya",
                  executiveSummary:
                    "La oficina de Andre Fraga garantiza que cada desarrollo presente su expediente oficial completo: brochures, inventario auditado, descuentos autorizados y certeza fiduciaria.",
                  keyMetrics: [
                    { label: "CEO & Founder", value: "Andre Fraga" },
                    { label: "Desarrollos", value: `${properties.length} Carteras` },
                    { label: "Unidades", value: `${totalUnitsAvailable} Activas` },
                  ],
                  bulletPoints: [
                    "Acceso directo en mano al Google Drive oficial de Nautica Residences by Naúma.",
                    "Simulador de planes de pago (30/70, 50/50, 80/20, 90/10).",
                    "Acompañamiento integral hasta escritura pública o fideicomiso.",
                  ],
                  deliverables: [
                    "Dossier Institucional",
                    "Recorridos VIP",
                    "Mesa Jurídica",
                  ],
                  actionLabel: "Ir al Tablero Ejecutivo",
                  targetNav: "executive",
                })
              }
              className="border border-[#091e3a] bg-[#091e3a] px-3 py-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
            >
              Ver Tesis de Dirección →
            </button>
            {onOpenExitConcierge && (
              <button
                type="button"
                onClick={onOpenExitConcierge}
                className="border border-[#755a34] px-3 py-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34] transition hover:bg-[#755a34] hover:text-white"
              >
                Solicitar Presentación
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Respaldo Regulatorio: 4 Sellos en Fila Limpia */}
      <div className="mt-6 grid grid-cols-1 gap-3 border-t border-[#eaedf0]/60 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_CERTIFICATES.map((cert) => (
          <button
            key={cert.code}
            type="button"
            onClick={() => onOpenOptionDetail(cert.modalDetail)}
            className={`group border p-4 text-left transition hover:border-[#091e3a] ${innerSurface}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-bold uppercase tracking-wider text-[#755a34]">
                {cert.code}
              </span>
              <span className="text-xs text-[#0077cc] transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </div>
            <div className="mt-1 font-['Outfit'] text-xs font-semibold">
              {cert.title}
            </div>
            <p className="mt-1 text-[11px] text-neutral-500">{cert.detail}</p>
          </button>
        ))}
      </div>
    </section>
  );

  const renderStep2DevelopmentsAndDrive = () => (
    <section className={`border p-7 sm:p-10 ${cardSurface}`}>
      <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0]/60 pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#755a34]">
            PASO 2 DE 5 · EXPEDIENTES GOOGLE DRIVE EN MANO
          </span>
          <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight">
            Desarrollos Verificados — Elige un Proyecto y Abre lo que Necesites
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Cada tarjeta incluye 5 botones directos para consultar Fotos, Brochure, Inventario, Planes de Pago y Fichas Técnicas sin salir de Proyecto Atlas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("inventory")}
          className="self-start bg-[#091e3a] px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
        >
          Ver Inventario con Filtros ({properties.length}) →
        </button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((prop) => {
          const imgUrl = prop.customImageUrl ?? prop.defaultImageUrl;
          return (
            <article
              key={prop.id}
              className={`group flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 ${innerSurface}`}
            >
              <div>
                <div
                  onClick={() => onOpenDossier(prop, "GALLERY")}
                  className="relative h-52 cursor-pointer overflow-hidden bg-neutral-900"
                >
                  <img
                    src={imgUrl}
                    alt={prop.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="bg-[#091e3a]/90 px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white">
                      {prop.zone}
                    </span>
                    <span className="bg-[#004044] px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white">
                      ROI {prop.roiAnnualPct}%
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="font-['Outfit'] text-[10px] uppercase tracking-[0.2em] text-[#00b4f5]">
                      {prop.code} · {prop.availableUnits} UNIDADES DISPONIBLES
                    </span>
                    <h4 className="font-['Outfit'] text-lg font-bold leading-snug">
                      {prop.name}
                    </h4>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-['Outfit'] text-[10px] uppercase tracking-wider text-neutral-400">
                      Precio Desde
                    </span>
                    <span className="font-['Outfit'] text-base font-bold">
                      {formatSovereignCurrency(prop.priceUsd, currency)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                    {prop.subtitle}
                  </p>

                  {/* 5 Botones Directos al Google Drive */}
                  <div className="mt-4 border-t border-[#eaedf0]/60 pt-3">
                    <span className="block font-['Outfit'] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                      DOCUMENTACIÓN EN MANO:
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                      <button
                        type="button"
                        onClick={() => onOpenDossier(prop, "GALLERY")}
                        className="border border-[#091e3a]/20 bg-white px-2 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
                      >
                        Fotos ({prop.galleryImages?.length ?? 1})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossier(prop, "BROCHURES")}
                        className="border border-[#091e3a]/20 bg-white px-2 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
                      >
                        Brochure ({prop.brochures?.length ?? 1})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossier(prop, "INVENTORY")}
                        className="border border-[#091e3a]/20 bg-white px-2 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
                      >
                        Inventario ({prop.inventoryUnits?.length ?? prop.availableUnits})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossier(prop, "PAYMENT_PLANS")}
                        className="border border-[#755a34]/40 bg-[#faeedd]/50 px-2 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34] transition hover:bg-[#755a34] hover:text-white"
                      >
                        Planes Pago ({prop.paymentPlans?.length ?? 1})
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDossier(prop, "TECH_SPECS")}
                        className="col-span-2 border border-[#0077cc]/30 bg-[#0077cc]/5 px-2 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#0077cc] transition hover:bg-[#0077cc] hover:text-white sm:col-span-1"
                      >
                        Fichas Técnicas
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#eaedf0]/60 px-5 py-3">
                <a
                  href={prop.driveFolderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#0077cc]"
                >
                  Google Drive ↗
                </a>
                <button
                  type="button"
                  onClick={() => onOpenDossier(prop, "INVENTORY")}
                  className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#0077cc] hover:text-[#755a34]"
                >
                  Abrir Expediente Completo →
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );

  const renderStep3MapAndAnalysis = () => (
    <section className="space-y-6">
      <div className="border border-[#091e3a] bg-[#091e3a] p-7 text-white sm:p-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#00b4f5]">
              PASO 3 DE 5 · UBICACIÓN SATELITAL REAL &amp; ANÁLISIS FINANCIERO
            </span>
            <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-white">
              Mapa Satelital Real — Cancún, Huayacán y Playa del Carmen
            </h2>
            <p className="mt-1 text-xs text-slate-300">
              Selecciona cualquier desarrollo para acercarte a su ubicación real por satélite y abrir su ficha financiera.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {properties.map((p) => {
              const active = selectedMapProperty?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedMapProperty(p)}
                  className={`px-3 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider transition ${
                    active
                      ? "bg-[#755a34] text-white"
                      : "border border-white/20 bg-white/5 text-slate-300 hover:bg-white/15"
                  }`}
                >
                  {p.name.split("—")[0].split("(")[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        <RealInteractiveMap
          properties={properties}
          selectedProperty={selectedMapProperty}
          currency={currency}
          onSelectProperty={(p) => setSelectedMapProperty(p)}
          onOpenDossier={(p) => onOpenDossier(p, "GALLERY")}
        />
      </div>

      {/* 3 Herramientas de Análisis Listas para Usar */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            kicker: "HERRAMIENTA 01 · COMPARATIVA",
            title: "Comparador Inteligente (Hasta 3x)",
            desc: "Compara lado a lado precio por m², mantenimiento mensual, Cap Rate y plusvalía a 5 años.",
            cta: "Abrir Comparador",
            nav: "comparator" as NavSectionId,
          },
          {
            kicker: "HERRAMIENTA 02 · SIMULADOR FINANCIERO",
            title: "Calculadora de ROI y Flujo de Caja",
            desc: "Simula tarifa por noche (ADR), ocupación anual, enganche y tiempo de recuperación.",
            cta: "Abrir Calculadora",
            nav: "calculator" as NavSectionId,
          },
          {
            kicker: "HERRAMIENTA 03 · INTELIGENCIA ARTIFICIAL",
            title: "Atlas AI (4 Agentes & 9 Funciones)",
            desc: "Busca por lenguaje natural, calcula plusvalía, redacta propuestas y resuelve dudas de fideicomiso.",
            cta: "Consultar Atlas AI",
            nav: "copilot" as NavSectionId,
          },
        ].map((tool) => (
          <button
            key={tool.title}
            type="button"
            onClick={() => onNavigate(tool.nav)}
            className={`group flex flex-col justify-between border p-6 text-left transition hover:-translate-y-1 ${cardSurface}`}
          >
            <div>
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                {tool.kicker}
              </span>
              <h3 className="mt-1.5 font-['Outfit'] text-lg font-semibold">
                {tool.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                {tool.desc}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-[#0077cc] group-hover:underline">
              <span>{tool.cta}</span>
              <span>→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );

  const renderStep4OperationsAndMarketplace = () => (
    <section className={`border p-7 sm:p-10 ${cardSurface}`}>
      <div className="border-b border-[#eaedf0]/60 pb-5">
        <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0077cc]">
          PASO 4 DE 5 · OPERACIÓN COMERCIAL, CLIENTES Y MARKETPLACE DE SERVICIOS
        </span>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight">
          Del Primer Contacto al Cierre Notarial y Postventa en 4 Pasos Simples
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Aquí es donde conviertes las propiedades en operaciones cerradas y conectas con proveedores certificados.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            step: "A",
            title: "CRM Inmobiliario (6 Etapas)",
            desc: "Registra prospectos, califica presupuesto y envía mensajes pre-redactados por WhatsApp en un clic.",
            nav: "crm" as NavSectionId,
            cta: "Abrir CRM Pipeline",
          },
          {
            step: "B",
            title: "Portal para Clientes VIP",
            desc: "Arma una Selección Exclusiva de propiedades para cada inversionista y compártela por enlace.",
            nav: "clients" as NavSectionId,
            cta: "Abrir Portal Clientes",
          },
          {
            step: "C",
            title: "Marketplace (8 Categorías)",
            desc: "Contrata Notarías, Hipotecas, Seguros, Avalúos, Arquitectos, Interiorismo, Mudanzas y Rentas.",
            nav: "directory" as NavSectionId,
            cta: "Explorar Marketplace",
          },
          {
            step: "D",
            title: "Portal Desarrolladores & Firma",
            desc: "Actualiza unidades en tiempo real, conecta CRMs/ERPs por API y firma Cartas Oferta digitales.",
            nav: "developers" as NavSectionId,
            cta: "Abrir Portal & Firma",
          },
        ].map((card) => (
          <button
            key={card.step}
            type="button"
            onClick={() => onNavigate(card.nav)}
            className={`group flex flex-col justify-between border p-5 text-left transition hover:-translate-y-1 ${innerSurface}`}
          >
            <div>
              <span className="inline-block bg-[#091e3a] px-2.5 py-0.5 font-['Outfit'] text-[10px] font-bold uppercase tracking-wider text-white">
                Módulo {card.step}
              </span>
              <h3 className="mt-3 font-['Outfit'] text-base font-semibold">
                {card.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                {card.desc}
              </p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#755a34] group-hover:underline">
              <span>{card.cta}</span>
              <span>→</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );

  const renderStep5MasterplanAndModules = () => (
    <section className={`border p-7 sm:p-10 ${cardSurface}`}>
      <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0]/60 pb-6 lg:flex-row lg:items-end">
        <div>
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#755a34]">
            PASO 5 DE 5 · PLAN ESTRATÉGICO (PRIMEROS 5 AÑOS) &amp; 10 MÓDULOS
          </span>
          <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight">
            Roadmap de Evolución (Año 1 a Año 5) y Acceso Directo a los 10 Módulos
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-neutral-500">
            Consulta cómo escala Atlas Real Estate desde el MVP operativo hasta consolidarse como la plataforma inmobiliaria integral líder en México.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("masterplan")}
          className="self-start bg-[#091e3a] px-5 py-3 font-['Outfit'] text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#0077cc]"
        >
          Abrir Simulador MRR &amp; Plan 5 Años →
        </button>
      </div>

      {/* Los 5 Años del Roadmap como Botones Interactivos */}
      <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-5">
        {STRATEGIC_5Y_ROADMAP.map((yr) => (
          <button
            key={yr.key}
            type="button"
            onClick={() =>
              onOpenOptionDetail({
                id: `home-roadmap-${yr.key}`,
                kicker: `ROADMAP ESTRATÉGICO · ${yr.label}`,
                title: `${yr.label}: ${yr.phaseTitle}`,
                subtitle: yr.subtitle,
                executiveSummary: yr.executiveThesis,
                keyMetrics: [
                  { label: "Usuarios Meta", value: yr.kpis.registeredUsers },
                  {
                    label: "Desarrollos",
                    value: yr.kpis.publishedDevelopments,
                  },
                  {
                    label: "MRR Proyectado",
                    value: formatSovereignCurrency(yr.kpis.mrrUsd, currency),
                  },
                ],
                bulletPoints: yr.deliverables.map(
                  (d) => `${d.title}: ${d.detail}`
                ),
                deliverables: yr.deliverables.map((d) => d.title),
                actionLabel: yr.actionButtonLabel,
                targetNav: yr.targetNav,
              })
            }
            className={`group flex flex-col justify-between border p-5 text-left transition hover:-translate-y-1 ${innerSurface}`}
          >
            <div>
              <span className="font-['Outfit'] text-[10px] font-bold uppercase tracking-[0.2em] text-[#0077cc]">
                {yr.label}
              </span>
              <h3 className="mt-1.5 font-['Outfit'] text-sm font-semibold">
                {yr.phaseTitle}
              </h3>
              <ul className="mt-3 space-y-1 text-[11px] text-neutral-500">
                {yr.deliverables.map((deliv) => (
                  <li key={deliv.title} className="flex items-start gap-1">
                    <span className="text-[#755a34]">▪</span>
                    <span>{deliv.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <span className="mt-4 inline-flex items-center gap-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34] group-hover:underline">
              <span>Ver KPIs del Año</span>
              <span>→</span>
            </span>
          </button>
        ))}
      </div>

      {/* Acceso Rápido a los 10 Módulos */}
      <div className="mt-7 border-t border-[#eaedf0]/60 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
            LOS 10 MÓDULOS PRINCIPALES (CLIC PARA ENTRAR)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {TEN_CORE_MODULES.map((mod) => (
            <button
              key={mod.number}
              type="button"
              onClick={() => onNavigate(mod.targetNav)}
              className={`flex flex-col justify-between border p-3.5 text-left transition hover:border-[#091e3a] ${innerSurface}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-['Outfit'] text-xs font-bold text-[#755a34]">
                  {mod.number}
                </span>
                <span className="font-['Outfit'] text-[9px] uppercase tracking-wider text-neutral-400">
                  {mod.yearIntroduced}
                </span>
              </div>
              <div className="mt-1.5 font-['Outfit'] text-xs font-semibold">
                {mod.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="space-y-10 pb-16">
      {/* =====================================================================
          1. HERO EDITORIAL CLARO Y PRESENTABLE
      ====================================================================== */}
      <section
        className={`relative overflow-hidden border transition-colors duration-500 ${cardSurface}`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12">
          <div className="flex flex-col justify-between p-7 sm:p-11 lg:col-span-7 lg:p-12">
            <div>
              <div className="animate-hero-rise-1 flex items-center gap-4">
                <span className="animate-hero-line inline-block h-[1px] w-10 bg-[#0077cc]" />
                <span className="font-['Outfit'] text-[11px] font-medium uppercase tracking-[0.28em] text-[#0077cc]">
                  PROYECTO ATLAS — REAL ESTATE PLATFORM
                </span>
              </div>

              <h1 className="animate-hero-rise-2 mt-5 font-['Outfit'] text-3xl font-light leading-[1.12] tracking-tight sm:text-5xl">
                Todo el Proceso Inmobiliario,{" "}
                <span className="font-semibold">
                  Organizado Paso a Paso
                </span>
              </h1>

              <p className="animate-hero-rise-3 mt-5 max-w-2xl text-sm leading-[1.8] text-neutral-500 sm:text-base">
                <strong>Proyecto Atlas</strong> reúne en un solo lugar el inventario oficial de desarrollos (fotos, brochures, precios, planes de pago y fichas técnicas de Google Drive), análisis de ROI, mapa satelital real, CRM, Atlas AI y un Marketplace de servicios certificados.
              </p>

              {/* Acciones Claras para Nuevo Usuario */}
              <div className="animate-hero-rise-3 mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectStep(1)}
                  className="atlas-btn-primary group inline-flex items-center justify-center gap-2.5 bg-[#091e3a] px-6 py-3.5 font-['Outfit'] text-xs font-semibold uppercase tracking-[0.18em] text-white"
                >
                  <span>Iniciar Recorrido Paso a Paso</span>
                  <span className="material-symbols-outlined text-[16px] text-[#00b4f5] transition-transform duration-300 group-hover:translate-x-1">
                    east
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDossier(properties[0], "GALLERY")}
                  className={`atlas-btn-secondary inline-flex items-center justify-center gap-2.5 border px-5 py-3.5 font-['Outfit'] text-xs font-medium uppercase tracking-[0.16em] ${innerSurface}`}
                >
                  <span>Ver Expediente Nautica Drive</span>
                  <span className="material-symbols-outlined text-[16px]">
                    folder_open
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("executive")}
                  className="border border-[#755a34] px-5 py-3.5 font-['Outfit'] text-xs font-semibold uppercase tracking-[0.16em] text-[#755a34] transition hover:bg-[#755a34] hover:text-white"
                >
                  Ir Directo al Tablero
                </button>
              </div>
            </div>

            {/* 4 KPIs Interactivos Compactos */}
            <div className="mt-10 grid grid-cols-2 gap-3 border-t border-[#eaedf0]/60 pt-7 sm:grid-cols-4">
              {HERO_KPI_DETAILS.map((kpi) => (
                <button
                  key={kpi.label}
                  type="button"
                  onClick={() => onOpenOptionDetail(kpi.detail)}
                  className={`group border p-3 text-left transition-all hover:-translate-y-0.5 ${innerSurface}`}
                >
                  <span className="block font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                    {kpi.label}
                  </span>
                  <span
                    className={`mt-1 block font-['Outfit'] text-base font-semibold tabular-nums sm:text-lg ${kpi.accentClass}`}
                  >
                    {kpi.value}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1 font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-[#0077cc]">
                    <span>Ver detalle</span>
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Showcase Limpio de Project Atlas */}
          <div
            className={`relative flex flex-col items-center justify-center border-t p-8 lg:col-span-5 lg:border-l lg:border-t-0 ${
              isDarkMode
                ? "border-slate-800 bg-gradient-to-b from-[#0c182b] to-[#070e1a]"
                : "border-[#eaedf0] bg-gradient-to-b from-[#f8f9fa] via-white to-[#f2f5f9]"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                onOpenOptionDetail({
                  id: "atlas-architecture-overview",
                  kicker: "IDENTIDAD INSTITUCIONAL · PROYECTO ATLAS",
                  title: "Proyecto Atlas — Sistema Operativo Inmobiliario",
                  subtitle:
                    "Banca Privada Inmobiliaria & Sincronización Google Drive",
                  executiveSummary:
                    "Diseñado bajo la dirección de Andre Fraga para centralizar la comercialización de desarrollos de alto patrimonio en México con acceso inmediato a documentación, ROI, CRM y Marketplace.",
                  keyMetrics: [
                    { label: "Dirección General", value: "Andre Fraga (CEO)" },
                    {
                      label: "Desarrollos Activos",
                      value: `${properties.length} Carteras`,
                    },
                    {
                      label: "Unidades Verificadas",
                      value: `${totalUnitsAvailable} Unidades`,
                    },
                  ],
                  bulletPoints: [
                    "Recorrido guiado en 5 pasos para nuevos usuarios.",
                    "Integración completa de Google Drive para Nautica Residences, The Villas, Isla Blanca, Hodela y Prana.",
                    "Mapa interactivo real con coordenadas GPS y capas satelitales.",
                  ],
                  deliverables: [
                    "Guía Paso a Paso",
                    "Centro Documental 5 Pestañas",
                    "Mapa Satelital Real",
                  ],
                  actionLabel: "Ir al Tablero Ejecutivo",
                  targetNav: "executive",
                })
              }
              className={`animate-atlas-float group relative flex flex-col items-center border p-9 text-center transition-all duration-500 ${
                isDarkMode
                  ? "border-slate-800 bg-white/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                  : "border-[#e5e8ec] bg-white shadow-[0_20px_50px_rgba(9,30,58,0.06)] hover:border-[#091e3a]"
              }`}
            >
              <AtlasBrandLogo
                variant="full"
                theme="light"
                className="h-40 w-auto sm:h-48"
              />
              <span className="mt-4 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0077cc] group-hover:underline">
                Clic para ver Ficha del Sistema →
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. NAVEGADOR POR PASOS PARA NUEVOS USUARIOS (INTERACTIVO Y LIMPIO)
      ====================================================================== */}
      <div ref={stepAnchorRef} className={`border p-6 sm:p-8 ${cardSurface}`}>
        <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0]/60 pb-5 lg:flex-row lg:items-center">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0077cc]">
              RECORRIDO GUIADO PARA NUEVOS USUARIOS · 5 PASOS
            </span>
            <h2 className="mt-1 font-['Outfit'] text-xl font-semibold sm:text-2xl">
              {viewMode === "GUIDED_STEPS"
                ? activeStepMeta.fullTitle
                : "Vista Completa — Los 5 Pasos de Proyecto Atlas"}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {viewMode === "GUIDED_STEPS"
                ? activeStepMeta.subtitle
                : "Visualizando todos los pasos en secuencia vertical. Puedes volver al modo paso a paso en cualquier momento."}
            </p>
          </div>

          {/* Toggle entre Modo Paso a Paso (Recomendado) y Vista Completa */}
          <div className="flex shrink-0 items-center gap-1.5 border border-[#eaedf0] p-1">
            <button
              type="button"
              onClick={() => setViewMode("GUIDED_STEPS")}
              className={`px-3 py-1.5 font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider transition ${
                viewMode === "GUIDED_STEPS"
                  ? "bg-[#091e3a] text-white"
                  : "text-neutral-500 hover:text-current"
              }`}
            >
              Paso a Paso (Recomendado)
            </button>
            <button
              type="button"
              onClick={() => setViewMode("FULL_OVERVIEW")}
              className={`px-3 py-1.5 font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider transition ${
                viewMode === "FULL_OVERVIEW"
                  ? "bg-[#091e3a] text-white"
                  : "text-neutral-500 hover:text-current"
              }`}
            >
              Ver Todo
            </button>
          </div>
        </div>

        {/* Barra de los 5 Pasos */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-5">
          {STEPS_META.map((step) => {
            const isActive =
              viewMode === "GUIDED_STEPS" && currentStep === step.id;
            const isCompleted =
              viewMode === "GUIDED_STEPS" && currentStep > step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setViewMode("GUIDED_STEPS");
                  setCurrentStep(step.id);
                }}
                className={`flex flex-col justify-between border p-3.5 text-left transition ${
                  isActive
                    ? "border-[#091e3a] bg-[#091e3a] text-white shadow-md"
                    : isCompleted
                    ? "border-emerald-600/40 bg-emerald-50/40 text-[#091e3a]"
                    : isDarkMode
                    ? "border-slate-800 bg-[#091322] text-slate-300 hover:border-[#00b4f5]"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-['Outfit'] text-[10px] font-bold uppercase tracking-widest ${
                      isActive ? "text-[#00b4f5]" : "text-[#755a34]"
                    }`}
                  >
                    Paso 0{step.id}
                  </span>
                  {isCompleted && (
                    <span className="font-['Outfit'] text-[10px] font-bold text-emerald-700">
                      ✓
                    </span>
                  )}
                </div>
                <div className="mt-1.5 font-['Outfit'] text-xs font-semibold">
                  {step.shortTitle}
                </div>
                <div
                  className={`mt-1 text-[10px] ${
                    isActive ? "text-slate-300" : "text-neutral-400"
                  }`}
                >
                  {step.outcomeLabel}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          3. CONTENIDO DEL PASO ACTUAL (O VISTA COMPLETA SI EL USUARIO LO ELIGE)
      ====================================================================== */}
      {viewMode === "GUIDED_STEPS" ? (
        <div className="space-y-6">
          {currentStep === 1 && renderStep1WelcomeAndProfile()}
          {currentStep === 2 && renderStep2DevelopmentsAndDrive()}
          {currentStep === 3 && renderStep3MapAndAnalysis()}
          {currentStep === 4 && renderStep4OperationsAndMarketplace()}
          {currentStep === 5 && renderStep5MasterplanAndModules()}

          {/* Controles Inferiores Anterior / Siguiente Paso */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 border p-5 ${cardSurface}`}
          >
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() =>
                handleSelectStep(
                  Math.max(1, currentStep - 1) as OnboardingStepId
                )
              }
              className="border border-[#eaedf0] px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#091e3a]"
            >
              ← Paso Anterior
            </button>

            <span className="font-['Outfit'] text-xs font-medium text-neutral-500">
              Paso {currentStep} de 5 · {activeStepMeta.shortTitle}
            </span>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() =>
                  handleSelectStep(
                    Math.min(5, currentStep + 1) as OnboardingStepId
                  )
                }
                className="bg-[#091e3a] px-5 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
              >
                Continuar al Paso {currentStep + 1} →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate("executive")}
                className="bg-[#004044] px-5 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#091e3a]"
              >
                Finalizar Guía e Ir al Tablero Ejecutivo →
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          <ScrollRevealSection delayMs={40}>
            {renderStep1WelcomeAndProfile()}
          </ScrollRevealSection>
          <ScrollRevealSection delayMs={60}>
            {renderStep2DevelopmentsAndDrive()}
          </ScrollRevealSection>
          <ScrollRevealSection delayMs={80}>
            {renderStep3MapAndAnalysis()}
          </ScrollRevealSection>
          <ScrollRevealSection delayMs={100}>
            {renderStep4OperationsAndMarketplace()}
          </ScrollRevealSection>
          <ScrollRevealSection delayMs={120}>
            {renderStep5MasterplanAndModules()}
          </ScrollRevealSection>
        </div>
      )}
    </div>
  );
};
