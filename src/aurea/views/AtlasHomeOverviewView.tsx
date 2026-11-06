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
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[transform,opacity] ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

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
  const [selectedMapProperty, setSelectedMapProperty] =
    useState<AureaProperty>(properties[0]);

  const totalUnitsAvailable = properties.reduce(
    (acc, p) => acc + p.availableUnits,
    0
  );

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
        subtitle: "Inventario Auditado en Cancún, Huayacán y Playa del Carmen",
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
      label: "Corredores Activos",
      value: "5 Zonas Prime",
      accentClass: "text-[#755a34]",
      detail: {
        id: "kpi-corredores",
        kicker: "CARTOGRAFÍA INTERACTIVA · PROYECTO ATLAS",
        title: "Cobertura Geoespacial en el Caribe Mexicano",
        subtitle: "Cancún Zona Hotelera · Laguna Nichupté · Huayacán · Playa del Carmen",
        executiveSummary:
          "Mapa interactivo real con coordenadas GPS verificadas para evaluar conectividad, vistas a Laguna Nichupté y Mar Caribe, cercanía a aeropuertos, marinas y clubes de playa.",
        keyMetrics: [
          { label: "Polo Náutico", value: "Laguna Nichupté / Zona Hotelera" },
          { label: "Polo Residencial", value: "Av. Huayacán / Puerto Cancún" },
          { label: "Polo Vacacional", value: "Playa del Carmen / Riviera Maya" },
        ],
        bulletPoints: [
          "Visualización satelital de alta resolución (Esri World Imagery) y capas editoriales.",
          "Marcadores interactivos con apertura directa del expediente Google Drive de cada desarrollo.",
          "Videos de dron por altura (17m, 27.5m, 42m, 56.5m, 71m y 77m) en Nautica Residences.",
        ],
        deliverables: [
          "Mapa Satelital Interactivo",
          "Coordenadas GPS Reales",
          "Dossier por Ubicación",
        ],
        actionLabel: "Abrir Tablero y Cartografía",
        targetNav: "executive",
      },
    },
  ];

  const PLATFORM_DISCIPLINES: {
    numeral: string;
    category: string;
    title: string;
    description: string;
    actionLabel: string;
    target: NavSectionId;
    detail: InteractiveOptionDetail;
  }[] = [
    {
      numeral: "I",
      category: "AUDITORÍA & ACTIVOS GOOGLE DRIVE",
      title: "Inventario Maestro & Expediente Documental Completo",
      description:
        "Concentra cada desarrollo con sus fotos reales, brochures en español e inglés, listas de precios por unidad, planes de pago con descuentos y fichas técnicas extraídas directamente de Google Drive.",
      actionLabel: "Ver Detalle & Abrir Inventario",
      target: "inventory",
      detail: {
        id: "disc-1",
        kicker: "DISCIPLINA I · AUDITORÍA & ACTIVOS",
        title: "Inventario Maestro & Expediente Documental Google Drive",
        subtitle: "Fotos, Brochures, Inventario, Planes de Pago y Fichas Técnicas en Mano",
        executiveSummary:
          "Elimina la búsqueda manual entre decenas de carpetas. Cada desarrollo cuenta con un Centro Documental de 5 pestañas interactivas donde el broker y el inversionista consultan al instante renders oficiales, brochures PDF, unidades disponibles, simulador de descuentos y planos arquitectónicos.",
        keyMetrics: [
          { label: "Pestañas por Activo", value: "5 Módulos Documentales" },
          { label: "Carpeta Principal", value: "Nautica & Desarrollos Aliados" },
          { label: "Sincronización", value: "100% En Mano" },
        ],
        bulletPoints: [
          "Pestaña 1 (Fotos & Renders): Fachadas, interiores, áreas comunes, showroom y enlaces a subcarpetas.",
          "Pestaña 2 (Brochures Oficiales): Descarga directa de brochures en Español, Inglés, Villas y versión sin logos.",
          "Pestaña 3 (Inventario & Precios): Tabla filtrable unidad por unidad con m², orientación y precio en MXN/USD/EUR.",
          "Pestaña 4 (Planes de Pago): Cotizador automático con los descuentos autorizados (0%, 3%, 4%, 5%, 7%, 8%, 10%).",
          "Pestaña 5 (Fichas Técnicas): Desglose de prototipos (Small, Ocean Front, Medium, Large, Ocean View, Villas y PH).",
        ],
        deliverables: [
          "Renders Oficiales HD",
          "Brochures PDF Directos",
          "Tabla de Inventario Real",
          "Cotizador de Planes de Pago",
        ],
        actionLabel: "Ir al Inventario Maestro",
        targetNav: "inventory",
      },
    },
    {
      numeral: "II",
      category: "INGENIERÍA FINANCIERA",
      title: "Modelado de Cap Rate, Planes de Pago & Comparador",
      description:
        "Calcula con rigor institucional el retorno neto anual, flujo de efectivo por rentas vacacionales (ADR y ocupación), descuentos por enganche y compara hasta tres desarrollos lado a lado.",
      actionLabel: "Ver Detalle & Simulador ROI",
      target: "calculator",
      detail: {
        id: "disc-2",
        kicker: "DISCIPLINA II · INGENIERÍA FINANCIERA",
        title: "Simulador de Rentabilidad & Comparador Multidimensional",
        subtitle: "Análisis Patrimonial en USD, MXN y EUR",
        executiveSummary:
          "Permite modelar en tiempo real escenarios de inversión ajustando precio de adquisición, porcentaje de enganche, tarifa promedio por noche (ADR), ocupación anual y costos de mantenimiento para proyectar el Cap Rate neto y el retorno a 5 años.",
        keyMetrics: [
          { label: "Divisas Soportadas", value: "USD · MXN · EUR" },
          { label: "Comparativa Simultánea", value: "Hasta 3 Desarrollos" },
          { label: "Horizonte de Plusvalía", value: "Proyección a 5 Años" },
        ],
        bulletPoints: [
          "Cálculo instantáneo de precio por metro cuadrado y flujo de caja neto anual.",
          "Integración con los esquemas de descuento de preventa de cada desarrollador.",
          "Matriz comparativa lado a lado para presentar opciones claras al comité familiar o inversionista.",
        ],
        deliverables: [
          "Simulador de Cap Rate Neto",
          "Matriz Comparativa 3x",
          "Conversión Multidivisa en Vivo",
        ],
        actionLabel: "Abrir Calculadora Financiera",
        targetNav: "calculator",
      },
    },
    {
      numeral: "III",
      category: "DEALFLOW PATRIMONIAL",
      title: "CRM Pipeline de 6 Fases & Selecciones para Clientes",
      description:
        "Gestiona cada operación desde el contacto inicial y calificación patrimonial hasta la firma de Carta Oferta y escrituración, con envío directo por WhatsApp y colecciones privadas.",
      actionLabel: "Ver Detalle & Abrir CRM",
      target: "crm",
      detail: {
        id: "disc-3",
        kicker: "DISCIPLINA III · DEALFLOW PATRIMONIAL",
        title: "CRM Inmobiliario de 6 Fases & Gestor de Clientes VIP",
        subtitle: "Trazabilidad Comercial desde el Primer Contacto hasta Notaría",
        executiveSummary:
          "Estructura el embudo comercial en 6 etapas ejecutivas (Contacto Inicial, Calificación Patrimonial, Envío de Portafolio, Recorrido Presencial, Negociación de Oferta y Firma Notarial) con notas de due diligence y contacto inmediato.",
        keyMetrics: [
          { label: "Etapas del Pipeline", value: "6 Fases Kanban" },
          { label: "Segmentación", value: "Family Office / Fondo / Final" },
          { label: "Persistencia", value: "LocalStorage Cifrado" },
        ],
        bulletPoints: [
          "Fichas de prospectos con presupuesto, desarrollo de interés, fuente del lead y notas privadas.",
          "Generador de mensajes ejecutivos pre-redactados para seguimiento directo por WhatsApp.",
          "Curaduría de colecciones personalizadas para cada cliente patrimonial.",
        ],
        deliverables: [
          "Tablero Kanban de 6 Fases",
          "Directorio de Clientes VIP",
          "Protocolo de Visitas Privadas",
        ],
        actionLabel: "Abrir Pipeline CRM",
        targetNav: "crm",
      },
    },
    {
      numeral: "IV",
      category: "INTELIGENCIA JURÍDICA & AGENCIA",
      title: "Atlas Copilot IA & Gobernanza Multi-Broker",
      description:
        "Resuelve al instante consultas sobre Fideicomisos en Zona Restringida, checklists para extranjeros, cuentas bancarias USD/EUR/MXN y coordina equipos con asignación Round-Robin.",
      actionLabel: "Ver Detalle & Consultar Copilot",
      target: "copilot",
      detail: {
        id: "disc-4",
        kicker: "DISCIPLINA IV · INTELIGENCIA JURÍDICA & AGENCIA",
        title: "Atlas Copilot IA & Suite Corporativa Multi-Broker",
        subtitle: "Asesoría Fiduciaria, Fiscal y Asignación Inteligente de Leads",
        executiveSummary:
          "Combina un asistente especializado en derecho inmobiliario mexicano (Fideicomisos en Zona Restringida, ISR, IVA, NOM-247, checklists de compraventa nacional y extranjero) con una consola de agencia para administrar brokers y comisiones.",
        keyMetrics: [
          { label: "Cobertura Legal", value: "Fideicomisos & NOM-247" },
          { label: "Distribución de Leads", value: "Algoritmo Round-Robin" },
          { label: "Personalización", value: "Marca Blanca Activa" },
        ],
        bulletPoints: [
          "Respuestas inmediatas sobre costos de escrituración, retenciones fiscales y estructura fiduciaria.",
          "Reparto automatizado de prospectos entre asesores de la agencia mediante Round-Robin.",
          "Configuración de split de comisiones entre agencia y broker.",
        ],
        deliverables: [
          "Asistente Atlas Copilot IA",
          "Consola Multi-Broker",
          "Bóveda de Seguridad & Escudo XSS",
        ],
        actionLabel: "Consultar Atlas Copilot IA",
        targetNav: "copilot",
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
          "Cartas Oferta oficiales en Español e Inglés disponibles en carpeta 7 de Google Drive.",
          "Especificaciones de acabados y equipamiento integradas en cada ficha técnica.",
          "Políticas claras de apartado (ej. 15 días naturales de reserva reembolsable en Isla Blanca).",
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
          "En el expediente de Google Drive de Nautica Residences y desarrollos aliados se incluyen los checklists específicos para compradores extranjeros (NAUTICA RESIDENCES - CHECK LIST - FOREIGN.pdf) y nacionales, así como cuentas bancarias en tres divisas.",
        keyMetrics: [
          { label: "Vigencia Fideicomiso", value: "50 Años Renovables" },
          { label: "Cuentas Habilitadas", value: "USD · EUR · MXN" },
          { label: "Checklists KYC", value: "Nacional & Foreign" },
        ],
        bulletPoints: [
          "Derechos fiduciarios plenos para usar, rentar, remodelar, heredar o vender el inmueble.",
          "Instrucciones bancarias verificadas en carpeta 4. CUENTA BANCARIA (USD, Euros y Pesos).",
          "Asesoría paso a paso mediante Atlas Copilot IA.",
        ],
        deliverables: [
          "Checklist Comprador Extranjero PDF",
          "Checklist Comprador Nacional PDF",
          "Cuentas Bancarias USD / EUR / MXN",
        ],
        actionLabel: "Consultar en Atlas Copilot",
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
          "Monitoreo en tiempo real de eventos de seguridad en el módulo Bóveda de Seguridad.",
          "Control de acceso por nivel de membresía (Básica, Pro y Agencia Corporativa).",
          "Cumplimiento de aviso de privacidad y consentimiento de datos.",
        ],
        deliverables: [
          "Audit Log en Vivo",
          "Simulador de Ataques / Escudo",
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
        "Sincronización directa con las carpetas de Google Drive para validar disponibilidad real y vigencia de listas de precios.",
      modalDetail: {
        id: "cert-rics",
        kicker: "DUE DILIGENCE TÉCNICO · AUDITORÍA DE DRIVES",
        title: "Verificación de Inventario, Planos y Precios en Google Drive",
        subtitle: "Trazabilidad Directa con NAÚMA, GMB, ABRE, Grupo Logar y Almaré",
        executiveSummary:
          "Garantiza que las cotizaciones presentadas a los inversionistas correspondan exactamente con la disponibilidad actual de Torre A, Torre B, The Villas Collection, Isla Blanca, Hodela y Prana Towers.",
        keyMetrics: [
          { label: "Desarrollos Sincronizados", value: "6 Carpetas Maestras" },
          { label: "Planos Ejecutivos", value: "100% Completos" },
          { label: "Listas de Precios", value: "Vigentes 2026" },
        ],
        bulletPoints: [
          "Acceso con un clic a la carpeta original de Google Drive de cada desarrollo.",
          "Verificación de currículum vitae de desarrolladores y arquitectos (Niz+Chauvet, Artigas, GMB, NAÚMA).",
          "Videos reales de dron por nivel de altura para confirmar vistas antes de comprar.",
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

  return (
    <div className="space-y-14 pb-16">
      {/* =====================================================================
          1. HERO ARQUITECTÓNICO CON BOTONES INTERACTIVOS DE DETALLE
      ====================================================================== */}
      <section
        className={`relative overflow-hidden border transition-colors duration-500 ${
          isDarkMode
            ? "border-[#1e2f48] bg-[#091322] text-white"
            : "border-[#e2e6ec] bg-white text-[#091e3a]"
        }`}
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
          {/* Columna Editorial Izquierda */}
          <div className="flex flex-col justify-between p-7 sm:p-12 lg:col-span-7 lg:p-14">
            <div>
              <div className="animate-hero-rise-1 flex items-center gap-4">
                <span className="animate-hero-line inline-block h-[1px] w-10 bg-[#0077cc]" />
                <span className="font-['Outfit'] text-[11px] font-medium uppercase tracking-[0.28em] text-[#0077cc]">
                  PROYECTO ATLAS — REAL ESTATE PLATFORM
                </span>
              </div>

              <h1
                className={`animate-hero-rise-2 mt-6 font-['Outfit'] text-3xl font-light leading-[1.12] tracking-tight sm:text-5xl ${
                  isDarkMode ? "text-white" : "text-[#091e3a]"
                }`}
              >
                Arquitectura de Inversión y{" "}
                <span className="font-semibold">
                  Dirección Patrimonial Inmobiliaria
                </span>
              </h1>

              <p
                className={`animate-hero-rise-3 mt-6 max-w-2xl text-sm leading-[1.8] sm:text-base ${
                  isDarkMode ? "text-slate-300" : "text-neutral-600"
                }`}
              >
                <strong>Proyecto Atlas</strong> centraliza toda la documentación oficial de Google Drive de cada desarrollo —<strong>fotos y renders reales, brochures en español e inglés, inventario unidad por unidad, planes de pago con descuentos y fichas técnicas</strong>— dentro de una plataforma de banca privada dirigida por <strong>Andre Fraga</strong>.
              </p>

              {/* Microinteracciones en Botones Principales */}
              <div className="animate-hero-rise-3 mt-9 flex flex-col gap-3.5 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={() => onNavigate("executive")}
                  className="atlas-btn-primary group inline-flex items-center justify-center gap-3 bg-[#091e3a] px-7 py-4 font-['Outfit'] text-xs font-medium uppercase tracking-[0.2em] text-white"
                >
                  <span>Ingresar al Tablero Ejecutivo</span>
                  <span className="material-symbols-outlined text-[16px] text-[#00b4f5] transition-transform duration-300 group-hover:translate-x-1">
                    east
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenDossier(properties[0], "GALLERY")}
                  className={`atlas-btn-secondary group inline-flex items-center justify-center gap-3 border px-6 py-4 font-['Outfit'] text-xs font-medium uppercase tracking-[0.2em] ${
                    isDarkMode
                      ? "border-slate-700 bg-transparent text-slate-200 hover:border-[#00b4f5] hover:text-white"
                      : "border-[#091e3a]/25 bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a] hover:bg-white"
                  }`}
                >
                  <span>Abrir Expediente Nautica Drive</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                    folder_open
                  </span>
                </button>
              </div>
            </div>

            {/* 4 KPIs Interactivos como Botones que abren información detallada */}
            <div
              className={`mt-12 grid grid-cols-2 gap-3 border-t pt-8 sm:grid-cols-4 ${
                isDarkMode ? "border-slate-800" : "border-[#eaedf0]"
              }`}
            >
              {HERO_KPI_DETAILS.map((kpi) => (
                <button
                  key={kpi.label}
                  type="button"
                  onClick={() => onOpenOptionDetail(kpi.detail)}
                  className={`group border p-3.5 text-left transition-all hover:-translate-y-0.5 ${
                    isDarkMode
                      ? "border-slate-800 bg-[#0c1524] hover:border-[#00b4f5]"
                      : "border-[#eaedf0] bg-[#f8f9fa] hover:border-[#091e3a] hover:bg-white"
                  }`}
                >
                  <span className="block font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                    {kpi.label}
                  </span>
                  <span
                    className={`mt-1 block font-['Outfit'] text-lg font-semibold tabular-nums sm:text-xl ${kpi.accentClass}`}
                  >
                    {kpi.value}
                  </span>
                  <span className="mt-1.5 inline-flex items-center gap-1 font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-[#0077cc]">
                    <span>Ver desglose</span>
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Showcase Escultórico del Emblema Project Atlas */}
          <div
            className={`relative flex flex-col items-center justify-center border-t p-10 lg:col-span-5 lg:border-l lg:border-t-0 ${
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
                  subtitle: "Banca Privada Inmobiliaria & Sincronización Google Drive",
                  executiveSummary:
                    "Diseñado bajo la dirección de Andre Fraga para centralizar la comercialización de desarrollos de alto patrimonio en Cancún y la Riviera Maya con acceso inmediato a toda la documentación técnica, comercial y fiduciaria.",
                  keyMetrics: [
                    { label: "Dirección General", value: "Andre Fraga (CEO)" },
                    { label: "Desarrollos Activos", value: `${properties.length} Carteras` },
                    { label: "Unidades Verificadas", value: `${totalUnitsAvailable} Unidades` },
                  ],
                  bulletPoints: [
                    "Integración completa del expediente Google Drive de Nautica Residences by Naúma y The Villas Collection.",
                    "Integración de Isla Blanca Residences (Artigas Arquitectos), Hodela Apartments y Prana Towers.",
                    "Mapa interactivo real con coordenadas GPS y capas satelitales.",
                  ],
                  deliverables: [
                    "Tablero Ejecutivo",
                    "Centro Documental 5 Pestañas",
                    "Mapa Satelital Real",
                  ],
                  actionLabel: "Ir al Tablero Ejecutivo",
                  targetNav: "executive",
                })
              }
              className={`animate-atlas-float group relative flex flex-col items-center border p-10 text-center transition-all duration-500 ${
                isDarkMode
                  ? "border-slate-800 bg-white/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                  : "border-[#e5e8ec] bg-white shadow-[0_20px_50px_rgba(9,30,58,0.06)] hover:border-[#091e3a]"
              }`}
            >
              <span className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-[#091e3a]/30" />
              <span className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r border-t border-[#091e3a]/30" />
              <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-[#091e3a]/30" />
              <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-[#091e3a]/30" />

              <AtlasBrandLogo
                variant="full"
                theme="light"
                className="h-44 w-auto sm:h-52"
              />
              <span className="mt-4 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0077cc] group-hover:underline">
                Clic para ver Ficha Institucional del Sistema →
              </span>
            </button>

            <div className="mt-6 text-center">
              <p className="font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
                SISTEMA OPERATIVO INMOBILIARIO · MÉXICO
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CARTA EDITORIAL & LIDERAZGO — ANDRE FRAGA (CON BOTONES DE DETALLE)
      ====================================================================== */}
      <ScrollRevealSection delayMs={60}>
        <section
          className={`border p-7 sm:p-12 lg:p-14 ${
            isDarkMode
              ? "border-[#1e2f48] bg-[#0c1524] text-white"
              : "border-[#e2e6ec] bg-white text-[#091e3a]"
          }`}
        >
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Retrato Editorial Compacto */}
            <div className="flex flex-col items-center lg:col-span-4 lg:items-start">
              <div className="flex flex-col items-center lg:items-start">
                <div
                  className={`border p-2.5 transition-all duration-500 ${
                    isDarkMode
                      ? "border-slate-700 bg-[#091322]"
                      : "border-[#d8dee6] bg-[#f8f9fa]"
                  }`}
                >
                  <div className="h-56 w-44 overflow-hidden sm:h-64 sm:w-52">
                    <img
                      src="/andre-fraga-ceo.jpg"
                      alt="Andre Fraga — CEO de Proyecto Atlas"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="mt-4 text-center lg:text-left">
                  <div className="font-['Outfit'] text-base font-semibold tracking-wide">
                    Andre Fraga
                  </div>
                  <div className="mt-0.5 font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.24em] text-[#0077cc]">
                    CEO &amp; Founder · Proyecto Atlas
                  </div>
                  <div className="mx-auto mt-2 h-[1px] w-12 bg-[#755a34] lg:mx-0" />
                </div>
              </div>
            </div>

            {/* Columna Editorial de Visión y Botones de Tesis */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#755a34]" />
                <span className="font-['Outfit'] text-[11px] font-medium uppercase tracking-[0.26em] text-[#755a34]">
                  DIRECCIÓN EJECUTIVA &amp; TESIS DE LA PLATAFORMA
                </span>
              </div>

              <h2 className="mt-4 font-['Outfit'] text-2xl font-light leading-snug tracking-tight sm:text-3xl">
                “Toda la información crítica de cada desarrollo —{" "}
                <span className="font-semibold">
                  renders, brochures, inventario, planes de pago y fichas técnicas
                </span>
                — disponible en un solo clic.”
              </h2>

              <div
                className={`mt-5 grid grid-cols-1 gap-6 text-xs leading-[1.85] sm:grid-cols-2 sm:text-sm ${
                  isDarkMode ? "text-slate-300" : "text-neutral-600"
                }`}
              >
                <p>
                  Bajo la dirección de <strong>Andre Fraga</strong>,{" "}
                  <strong>Proyecto Atlas</strong> integra directamente los expedientes de Google Drive de desarrollos insignia como{" "}
                  <strong>Nautica Residences by Naúma</strong>,{" "}
                  <strong>The Villas Collection</strong>,{" "}
                  <strong>Isla Blanca Residences</strong>,{" "}
                  <strong>Hodela Apartments</strong> y{" "}
                  <strong>Prana Towers</strong>.
                </p>
                <p>
                  Cada opción de la plataforma funciona como un módulo interactivo donde el broker o inversionista puede abrir las listas de precios vigentes, simular descuentos por enganche (hasta 8% y 10%) y consultar las plantas arquitectónicas ambientadas sin salir del sistema.
                </p>
              </div>

              {/* Botones interactivos de la Dirección Ejecutiva */}
              <div
                className={`mt-7 flex flex-wrap items-center justify-between gap-3 border-t pt-5 ${
                  isDarkMode ? "border-slate-800" : "border-[#eaedf0]"
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      onOpenOptionDetail({
                        id: "ceo-mandate",
                        kicker: "DIRECCIÓN EJECUTIVA · ANDRE FRAGA",
                        title: "Tesis Patrimonial & Estándar Operativo de Proyecto Atlas",
                        subtitle: "Transparencia Documental y Ejecución Comercial en Cancún & Riviera Maya",
                        executiveSummary:
                          "La oficina de Andre Fraga establece un protocolo de curaduría donde ningún activo se presenta sin su respaldo documental completo: brochures oficiales, inventario auditado por nivel, política de descuentos vigente y fichas técnicas verificadas.",
                        keyMetrics: [
                          { label: "CEO & Founder", value: "Andre Fraga" },
                          { label: "Enfoque", value: "Private Wealth Real Estate" },
                          { label: "Sede Operativa", value: "Cancún & Riviera Maya" },
                        ],
                        bulletPoints: [
                          "Acceso directo en mano a toda la carpeta de Google Drive de Nautica Residences by Naúma.",
                          "Simulación transparente de planes de pago (30/70, 30/40/30, 50/30/20, 80/20 y 90/10).",
                          "Acompañamiento integral desde el apartado hasta la firma de escritura o fideicomiso.",
                        ],
                        deliverables: [
                          "Dossier Institucional Personalizado",
                          "Recorridos VIP & Showroom",
                          "Mesa de Cierre Jurídico",
                        ],
                        actionLabel: "Abrir Tablero Ejecutivo",
                        targetNav: "executive",
                      })
                    }
                    className="border border-[#091e3a] bg-[#091e3a] px-4 py-2 font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
                  >
                    Ver Tesis de Dirección (Andre Fraga) →
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenDossier(properties[0], "PAYMENT_PLANS")}
                    className="border border-[#755a34] bg-[#755a34]/10 px-4 py-2 font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#755a34] transition hover:bg-[#755a34] hover:text-white"
                  >
                    Ver Planes de Pago Nautica (Hasta 8% Desc.) →
                  </button>
                </div>

                {onOpenExitConcierge && (
                  <button
                    type="button"
                    onClick={onOpenExitConcierge}
                    className="group inline-flex items-center gap-2 font-['Outfit'] text-xs font-semibold uppercase tracking-[0.18em] text-[#0077cc] transition hover:text-[#755a34]"
                  >
                    <span>Solicitar Presentación Ejecutiva</span>
                    <span className="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:translate-x-1">
                      east
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollRevealSection>

      {/* =====================================================================
          3. EXPEDIENTE INTERACTIVO DE DESARROLLOS (GOOGLE DRIVE EN MANO)
      ====================================================================== */}
      <ScrollRevealSection delayMs={80}>
        <section
          className={`border p-7 sm:p-10 ${
            isDarkMode
              ? "border-[#1e2f48] bg-[#0c1524]"
              : "border-[#e2e6ec] bg-white"
          }`}
        >
          <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0] pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#755a34]" />
                <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#755a34]">
                  EXPEDIENTES GOOGLE DRIVE SINCRONIZADOS EN MANO
                </span>
              </div>
              <h3
                className={`mt-2 font-['Outfit'] text-2xl font-semibold tracking-tight ${
                  isDarkMode ? "text-white" : "text-[#091e3a]"
                }`}
              >
                Desarrollos en Cartera — Fotos, Brochure, Inventario, Planes de Pago y Fichas Técnicas
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                Haz clic en cualquiera de los botones de cada desarrollo para abrir directamente su módulo documental.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate("inventory")}
              className="atlas-btn-secondary group inline-flex items-center gap-2 self-start border border-[#091e3a] bg-[#091e3a] px-5 py-2.5 font-['Outfit'] text-xs font-medium uppercase tracking-[0.18em] text-white"
            >
              <span>Ver Catálogo Completo ({properties.length})</span>
              <span className="material-symbols-outlined text-[15px] transition-transform duration-300 group-hover:translate-x-1">
                east
              </span>
            </button>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((prop) => {
              const imgUrl = prop.customImageUrl ?? prop.defaultImageUrl;
              return (
                <article
                  key={prop.id}
                  className={`group flex flex-col justify-between border transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode
                      ? "border-slate-800 bg-[#091322]"
                      : "border-[#eaedf0] bg-[#f8f9fa]"
                  }`}
                >
                  <div>
                    <div
                      onClick={() => onOpenDossier(prop, "GALLERY")}
                      className="relative h-56 cursor-pointer overflow-hidden bg-neutral-900"
                    >
                      <img
                        src={imgUrl}
                        alt={prop.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 flex items-center gap-2">
                        <span className="bg-[#091e3a]/90 px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white">
                          {prop.zone}
                        </span>
                        <span className="bg-[#004044] px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white">
                          ROI {prop.roiAnnualPct}%
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <span className="font-['Outfit'] text-[10px] uppercase tracking-[0.2em] text-[#00b4f5]">
                            {prop.code} · {prop.availableUnits} UNIDADES
                          </span>
                          <h4 className="font-['Outfit'] text-lg font-bold leading-snug">
                            {prop.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-baseline justify-between">
                        <span className="font-['Outfit'] text-[10px] uppercase tracking-wider text-neutral-400">
                          Precio Desde
                        </span>
                        <span
                          className={`font-['Outfit'] text-base font-bold ${
                            isDarkMode ? "text-white" : "text-[#091e3a]"
                          }`}
                        >
                          {formatSovereignCurrency(prop.priceUsd, currency)}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                        {prop.subtitle}
                      </p>

                      {/* Botonera Directa a las 5 Secciones del Google Drive del Desarrollo */}
                      <div className="mt-4 pt-3 border-t border-[#eaedf0]/60">
                        <span className="block font-['Outfit'] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
                          ABRIR INFORMACIÓN DEL GOOGLE DRIVE EN MANO:
                        </span>
                        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                          <button
                            type="button"
                            onClick={() => onOpenDossier(prop, "GALLERY")}
                            className="border border-[#091e3a]/20 bg-white px-2.5 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
                          >
                            Fotos ({prop.galleryImages?.length ?? 1})
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDossier(prop, "BROCHURES")}
                            className="border border-[#091e3a]/20 bg-white px-2.5 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
                          >
                            Brochure ({prop.brochures?.length ?? 1})
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDossier(prop, "INVENTORY")}
                            className="border border-[#091e3a]/20 bg-white px-2.5 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
                          >
                            Inventario ({prop.inventoryUnits?.length ?? prop.availableUnits})
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDossier(prop, "PAYMENT_PLANS")}
                            className="border border-[#755a34]/40 bg-[#faeedd]/50 px-2.5 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34] transition hover:bg-[#755a34] hover:text-white"
                          >
                            Planes Pago ({prop.paymentPlans?.length ?? 1})
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDossier(prop, "TECH_SPECS")}
                            className="col-span-2 sm:col-span-1 border border-[#0077cc]/30 bg-[#0077cc]/5 px-2.5 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#0077cc] transition hover:bg-[#0077cc] hover:text-white"
                          >
                            Fichas Técnicas
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#eaedf0] px-5 py-3">
                    <a
                      href={prop.driveFolderUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#0077cc]"
                    >
                      Google Drive Oficial ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => onOpenDossier(prop, "INVENTORY")}
                      className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#0077cc] hover:text-[#755a34]"
                    >
                      Expediente Completo →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </ScrollRevealSection>

      {/* =====================================================================
          4. MAPA REAL E INTERACTIVO DEL CORREDOR CANCÚN — RIVIERA MAYA
      ====================================================================== */}
      <ScrollRevealSection delayMs={95}>
        <section
          className={`border p-7 sm:p-10 ${
            isDarkMode
              ? "border-[#1e2f48] bg-[#091322] text-white"
              : "border-[#e2e6ec] bg-[#091e3a] text-white"
          }`}
        >
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#00b4f5]">
                GEOLOCALIZACIÓN REAL EN VIVO · LEAFLET &amp; SATÉLITE ESRI
              </span>
              <h3 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-white">
                Mapa Real Interactivo de Desarrollos — Cancún, Huayacán y Playa del Carmen
              </h3>
              <p className="mt-1 text-xs text-slate-300">
                Haz zoom, navega por el mapa satelital o selecciona un desarrollo para volar a su ubicación exacta y abrir su expediente de Google Drive.
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
        </section>
      </ScrollRevealSection>

      {/* =====================================================================
          5. LAS 4 DISCIPLINAS COMO BOTONES DE INFORMACIÓN DETALLADA
      ====================================================================== */}
      <ScrollRevealSection delayMs={110}>
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-3 border-b border-[#eaedf0] pb-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#0077cc]" />
                <span className="font-['Outfit'] text-[11px] font-medium uppercase tracking-[0.26em] text-[#0077cc]">
                  ECOSISTEMA INTEGRAL INTERACTIVO
                </span>
              </div>
              <h2
                className={`mt-2 font-['Outfit'] text-2xl font-semibold tracking-tight sm:text-3xl ${
                  isDarkMode ? "text-white" : "text-[#091e3a]"
                }`}
              >
                Las Cuatro Disciplinas de Proyecto Atlas
              </h2>
            </div>
            <p className="font-['Outfit'] text-xs uppercase tracking-[0.18em] text-neutral-400">
              Haz clic en cualquier opción para abrir su ficha técnica detallada
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PLATFORM_DISCIPLINES.map((item) => (
              <button
                key={item.numeral}
                type="button"
                onClick={() => onOpenOptionDetail(item.detail)}
                className={`group flex flex-col justify-between border p-7 text-left transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode
                    ? "border-[#1e2f48] bg-[#0c1524] hover:border-[#00b4f5]"
                    : "border-[#e2e6ec] bg-white hover:border-[#091e3a] hover:shadow-[0_16px_40px_rgba(9,30,58,0.06)]"
                }`}
              >
                <div className="w-full">
                  <div className="flex items-baseline justify-between border-b border-[#eaedf0] pb-4">
                    <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.24em] text-[#755a34]">
                      {item.category}
                    </span>
                    <span className="font-['Outfit'] text-lg font-light tracking-widest text-neutral-400">
                      {item.numeral}
                    </span>
                  </div>

                  <h3
                    className={`mt-5 font-['Outfit'] text-lg font-semibold tracking-tight sm:text-xl ${
                      isDarkMode ? "text-white" : "text-[#091e3a]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-3 text-xs leading-[1.8] sm:text-sm ${
                      isDarkMode ? "text-slate-300" : "text-neutral-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex w-full items-center justify-between border-t border-[#eaedf0]/50 pt-4">
                  <span className="font-['Outfit'] text-xs font-semibold uppercase tracking-[0.18em] text-[#0077cc]">
                    {item.actionLabel}
                  </span>
                  <span className="material-symbols-outlined text-[17px] text-[#0077cc] transition-transform duration-300 group-hover:translate-x-1.5">
                    east
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </ScrollRevealSection>

      {/* =====================================================================
          6. CERTIFICADOS Y SELLOS CONFIABLES (BOTONES CON DETALLE JURÍDICO)
      ====================================================================== */}
      <ScrollRevealSection delayMs={140}>
        <section
          className={`border p-7 sm:p-10 ${
            isDarkMode
              ? "border-[#1e2f48] bg-[#091322]"
              : "border-[#e2e6ec] bg-white"
          }`}
        >
          <div className="flex flex-col justify-between gap-2 border-b border-[#eaedf0] pb-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#004044]" />
                <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#004044]">
                  RESPALDO REGULATORIO &amp; CERTEZA INSTITUCIONAL
                </span>
              </div>
              <h3
                className={`mt-2 font-['Outfit'] text-xl font-semibold tracking-tight sm:text-2xl ${
                  isDarkMode ? "text-white" : "text-[#091e3a]"
                }`}
              >
                Certificados, Normativas y Sellos de Confianza
              </h3>
            </div>
            <span className="font-['Outfit'] text-[11px] uppercase tracking-wider text-neutral-400">
              Selecciona cualquier sello para abrir el protocolo legal
            </span>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CERTIFICATES.map((cert) => (
              <button
                key={cert.code}
                type="button"
                onClick={() => onOpenOptionDetail(cert.modalDetail)}
                className={`group flex flex-col justify-between border p-5 text-left transition-all hover:-translate-y-1 ${
                  isDarkMode
                    ? "border-slate-800 bg-[#0c1524] hover:border-[#00b4f5]"
                    : "border-[#eaedf0] bg-[#f8f9fa] hover:border-[#091e3a] hover:bg-white hover:shadow-md"
                }`}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between border-b border-[#eaedf0] pb-3">
                    <svg
                      className="h-7 w-7 text-[#0077cc]"
                      viewBox="0 0 32 32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <polygon points="16,2 28,8 28,20 16,30 4,20 4,8" />
                      <polyline points="11,16 14.5,19.5 21,12.5" />
                    </svg>
                    <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#755a34]">
                      {cert.code}
                    </span>
                  </div>

                  <div className="mt-4 font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                    {cert.authority}
                  </div>
                  <h4
                    className={`mt-1 font-['Outfit'] text-sm font-semibold ${
                      isDarkMode ? "text-white" : "text-[#091e3a]"
                    }`}
                  >
                    {cert.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                    {cert.detail}
                  </p>
                </div>

                <div className="mt-4 flex w-full items-center justify-between border-t border-[#eaedf0] pt-2.5">
                  <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0077cc]">
                    Abrir Protocolo Detallado
                  </span>
                  <span className="text-xs text-[#0077cc] transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </ScrollRevealSection>
    </div>
  );
};
