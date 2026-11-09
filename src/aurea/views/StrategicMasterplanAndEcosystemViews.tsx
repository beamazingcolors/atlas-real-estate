import React, { useMemo, useState } from "react";
import {
  AureaProperty,
  CurrencyCode,
  DeliveryStatus,
  InteractiveOptionDetail,
  NavSectionId,
  StrategicYearKey,
} from "../types";
import {
  formatSovereignCurrency,
  usePersistentState,
} from "../storage/useAureaStorage";
import {
  STRATEGIC_5Y_ROADMAP,
  TEN_CORE_MODULES,
} from "../data/strategicPlanData";

/* ============================================================================
 * VISTA 1: PLAN ESTRATÉGICO (PRIMEROS 5 AÑOS) — StrategicMasterplanView
 * ========================================================================== */

interface StrategicMasterplanViewProps {
  currency: CurrencyCode;
  onNavigate: (section: NavSectionId) => void;
  onOpenOptionDetail: (detail: InteractiveOptionDetail) => void;
}

export const StrategicMasterplanView: React.FC<StrategicMasterplanViewProps> = ({
  currency,
  onNavigate,
  onOpenOptionDetail,
}) => {
  const [selectedYearKey, setSelectedYearKey] =
    useState<StrategicYearKey>("YEAR_1");

  // Parámetros del Simulador del Modelo de Ingresos (6 Fuentes de Monetización)
  const [saasSubscribers, setSaasSubscribers] = useState<number>(850);
  const [avgSubscriptionUsd, setAvgSubscriptionUsd] = useState<number>(95);
  const [monthlyMarketplaceReferrals, setMonthlyMarketplaceReferrals] =
    useState<number>(65);
  const [avgReferralFeeUsd, setAvgReferralFeeUsd] = useState<number>(680);
  const [featuredDevelopmentsAds, setFeaturedDevelopmentsAds] =
    useState<number>(18);
  const [enterpriseDevLicenses, setEnterpriseDevLicenses] =
    useState<number>(14);
  const [thirdPartyApiConnections, setThirdPartyApiConnections] =
    useState<number>(28);
  const [premiumAiModulesSold, setPremiumAiModulesSold] = useState<number>(310);

  const activeYearPlan =
    STRATEGIC_5Y_ROADMAP.find((y) => y.key === selectedYearKey) ??
    STRATEGIC_5Y_ROADMAP[0];

  const revenueBreakdown = useMemo(() => {
    const subscriptionMrr = saasSubscribers * avgSubscriptionUsd;
    const marketplaceCommissionMrr =
      monthlyMarketplaceReferrals * avgReferralFeeUsd;
    const featuredAdsMrr = featuredDevelopmentsAds * 1850;
    const enterpriseLicensesMrr = enterpriseDevLicenses * 3200;
    const apiThirdPartyMrr = thirdPartyApiConnections * 750;
    const premiumAiMrr = premiumAiModulesSold * 65;

    const totalMrrUsd =
      subscriptionMrr +
      marketplaceCommissionMrr +
      featuredAdsMrr +
      enterpriseLicensesMrr +
      apiThirdPartyMrr +
      premiumAiMrr;

    return {
      subscriptionMrr,
      marketplaceCommissionMrr,
      featuredAdsMrr,
      enterpriseLicensesMrr,
      apiThirdPartyMrr,
      premiumAiMrr,
      totalMrrUsd,
      totalArrUsd: totalMrrUsd * 12,
    };
  }, [
    saasSubscribers,
    avgSubscriptionUsd,
    monthlyMarketplaceReferrals,
    avgReferralFeeUsd,
    featuredDevelopmentsAds,
    enterpriseDevLicenses,
    thirdPartyApiConnections,
    premiumAiModulesSold,
  ]);

  return (
    <div className="space-y-10 pb-12">
      {/* 1. ENCABEZADO EJECUTIVO: OBJETIVO, VISIÓN, PROPUESTA DE VALOR Y META AÑO 5 */}
      <section className="border border-[#091e3a] bg-[#091e3a] p-7 text-white sm:p-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-7 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-10 bg-[#00b4f5]" />
              <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.28em] text-[#00b4f5]">
                ATLAS REAL ESTATE · PLAN ESTRATÉGICO (PRIMEROS 5 AÑOS)
              </span>
            </div>
            <h1 className="mt-3 font-['Outfit'] text-2xl font-semibold tracking-tight sm:text-4xl">
              El Sistema Operativo Inmobiliario Integral de México
            </h1>
            <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-sm">
              Concentramos en un solo ecosistema la operación comercial, el inventario de desarrollos, la inteligencia artificial, los servicios complementarios y un marketplace certificado para todos los profesionales del sector.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate("directory")}
              className="border border-[#00b4f5] bg-[#0077cc] px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#00b4f5] hover:text-[#091e3a]"
            >
              Abrir Marketplace (8 Categorías) →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("developers")}
              className="border border-white/25 bg-white/5 px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#091e3a]"
            >
              Portal Desarrolladores &amp; API →
            </button>
          </div>
        </div>

        {/* 4 Pilares Estratégicos como Botones que abren Ficha Detallada */}
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              tag: "01 · OBJETIVO",
              title: "Ecosistema Tecnológico Único",
              summary:
                "Construir durante los primeros cinco años una plataforma especializada que concentre operación comercial, inventario de desarrollos, IA, servicios complementarios y marketplace profesional.",
              detail: {
                id: "strat-objetivo",
                kicker: "PLAN ESTRATÉGICO · OBJETIVO CENTRAL",
                title: "Objetivo de Atlas Real Estate (Primeros 5 Años)",
                subtitle: "Unificación de Operación Comercial, Inventario, IA y Marketplace",
                executiveSummary:
                  "Construir durante los primeros cinco años una plataforma tecnológica especializada en el sector inmobiliario que concentre en un solo ecosistema la operación comercial, el inventario de desarrollos, la inteligencia artificial, los servicios complementarios y un marketplace para profesionales del sector.",
                keyMetrics: [
                  { label: "Horizonte", value: "5 Años (Año 1 a Año 5)" },
                  { label: "Módulos Integrados", value: "10 Módulos Core" },
                  { label: "Verticales Marketplace", value: "8 Categorías" },
                ],
                bulletPoints: [
                  "Elimina la fragmentación entre carpetas sueltas de Google Drive, hojas de Excel, chats de WhatsApp y contratos manuales.",
                  "Conecta en tiempo real la oferta de desarrolladores con la fuerza de ventas y los proveedores de cierre.",
                  "Integra inteligencia artificial en cada punto de contacto con el comprador e inversionista.",
                ],
                deliverables: [
                  "Operación Comercial CRM",
                  "Inventario Vivo de Desarrollos",
                  "Atlas AI & Marketplace",
                ],
                actionLabel: "Explorar Inventario de Desarrollos",
                targetNav: "inventory" as NavSectionId,
              },
            },
            {
              tag: "02 · VISIÓN",
              title: "Sistema Operativo Líder",
              summary:
                "Convertirse en el sistema operativo inmobiliario líder para asesores, desarrolladores, brokers, inversionistas y proveedores de servicios.",
              detail: {
                id: "strat-vision",
                kicker: "PLAN ESTRATÉGICO · VISIÓN INSTITUCIONAL",
                title: "Visión de Atlas Real Estate",
                subtitle: "El Sistema Operativo para Todos los Actores del Sector",
                executiveSummary:
                  "Convertirse en el sistema operativo inmobiliario líder para asesores, desarrolladores, brokers, inversionistas y proveedores de servicios, ofreciendo una infraestructura confiable, veloz y estéticamente impecable.",
                keyMetrics: [
                  { label: "Actores Conectados", value: "5 Perfiles Clave" },
                  { label: "Meta Usuarios Año 5", value: "48,500+" },
                  { label: "Cobertura", value: "Nacional (México)" },
                ],
                bulletPoints: [
                  "Asesores y Brokers: CRM, comparador, calculadora de ROI, generador de dossieres y comisiones por referencia.",
                  "Desarrolladores: Portal de publicación en tiempo real y conexión API con sus ERPs.",
                  "Inversionistas y Proveedores: Transparencia documental, certeza jurídica y contratación certificada.",
                ],
                deliverables: [
                  "Panel de Asesores",
                  "Portal de Desarrolladores",
                  "Portal de Clientes & Proveedores",
                ],
                actionLabel: "Ir al Tablero Ejecutivo",
                targetNav: "executive" as NavSectionId,
              },
            },
            {
              tag: "03 · PROPUESTA DE VALOR",
              title: "Ciclo Inmobiliario 360° con IA",
              summary:
                "Centralizar todo el proceso inmobiliario: captación, inventario, análisis, venta, postventa y administración mediante IA y automatización.",
              detail: {
                id: "strat-propuesta",
                kicker: "PLAN ESTRATÉGICO · PROPUESTA DE VALOR",
                title: "Centralización de Punta a Punta mediante IA y Automatización",
                subtitle: "Captación · Inventario · Análisis · Venta · Postventa · Administración",
                executiveSummary:
                  "Centralizar todo el proceso inmobiliario en una sola plataforma continua donde los datos fluyen automáticamente desde la captación del inmueble o prospecto hasta la firma notarial, entrega postventa y administración de rentas.",
                keyMetrics: [
                  { label: "Etapas Cubiertas", value: "6 Fases del Ciclo" },
                  { label: "Agentes IA", value: "4 Especialistas" },
                  { label: "Ahorro Operativo", value: "65% en Tiempos de Cierre" },
                ],
                bulletPoints: [
                  "Captación e Inventario: Sincronización directa con Google Drive y Portal de Desarrolladores.",
                  "Análisis y Venta: Comparador inteligente, simulador de Cap Rate y Atlas AI para cierre comercial.",
                  "Postventa y Administración: Marketplace de interiorismo, mudanzas y gestión de rentas vacacionales.",
                ],
                deliverables: [
                  "Automatización WhatsApp/Email",
                  "Firma Electrónica",
                  "Administración de Rentas",
                ],
                actionLabel: "Probar Atlas AI",
                targetNav: "copilot" as NavSectionId,
              },
            },
            {
              tag: "04 · META AL FINALIZAR EL AÑO 5",
              title: "Referente Nacional en México",
              summary:
                "Ser la plataforma inmobiliaria de referencia en México, integrando operación, inteligencia artificial, marketplace y colaboración entre todos los actores.",
              detail: {
                id: "strat-meta5",
                kicker: "PLAN ESTRATÉGICO · META AÑO 5",
                title: "Consolidación como la Plataforma de Referencia en México",
                subtitle: "Operación + Inteligencia Artificial + Marketplace + Colaboración Nacional",
                executiveSummary:
                  "Al finalizar el quinto año, Atlas Real Estate opera como el estándar tecnológico del mercado inmobiliario mexicano, conectando los principales corredores turísticos, residenciales e industriales del país.",
                keyMetrics: [
                  { label: "MRR Proyectado Año 5", value: "$740,000 USD / mes" },
                  { label: "Desarrollos Activos", value: "680 Desarrollos" },
                  { label: "Retención Neta", value: "96.8% Anual" },
                ],
                bulletPoints: [
                  "Expansión nacional consolidada en Cancún, Riviera Maya, CDMX, Monterrey, Guadalajara, Los Cabos y Mérida.",
                  "Modelos de IA predictiva de precios y plusvalía entrenados con transacciones reales.",
                  "Ecosistema colaborativo donde desarrolladores, brokers, notarías y clientes operan bajo un mismo estándar.",
                ],
                deliverables: [
                  "Red Nacional de Desarrollos",
                  "IA Predictiva de Plusvalía",
                  "Marketplace Consolidado",
                ],
                actionLabel: "Ver Portal de Desarrolladores",
                targetNav: "developers" as NavSectionId,
              },
            },
          ].map((pillar) => (
            <button
              key={pillar.tag}
              type="button"
              onClick={() => onOpenOptionDetail(pillar.detail)}
              className="group flex flex-col justify-between border border-white/15 bg-white/5 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#00b4f5] hover:bg-white/10"
            >
              <div>
                <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#00b4f5]">
                  {pillar.tag}
                </span>
                <h2 className="mt-2 font-['Outfit'] text-base font-semibold text-white">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {pillar.summary}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#faeedd] group-hover:underline">
                <span>Abrir Ficha Estratégica</span>
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. ROADMAP INTERACTIVO DE 5 AÑOS (AÑO 1 A AÑO 5) */}
      <section className="border border-[#e2e6ec] bg-white p-7 sm:p-10">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0] pb-6 lg:flex-row lg:items-end">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#755a34]">
              HOJA DE RUTA TECNOLÓGICA &amp; COMERCIAL
            </span>
            <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-[#091e3a]">
              Roadmap Estratégico de 5 Años (Año 1 – MVP a Año 5 – Plataforma Integral)
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Selecciona cada año para inspeccionar sus entregables, sus KPIs proyectados y abrir directamente cada módulo funcional.
            </p>
          </div>

          {/* Selector de los 5 Años */}
          <div className="flex flex-wrap gap-1.5">
            {STRATEGIC_5Y_ROADMAP.map((yr) => {
              const active = yr.key === selectedYearKey;
              return (
                <button
                  key={yr.key}
                  type="button"
                  onClick={() => setSelectedYearKey(yr.key)}
                  className={`px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider transition ${
                    active
                      ? "bg-[#091e3a] text-white shadow-sm"
                      : "border border-[#eaedf0] bg-[#f8f9fa] text-neutral-600 hover:border-[#091e3a] hover:text-[#091e3a]"
                  }`}
                >
                  {yr.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalle del Año Seleccionado */}
        <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Columna Izquierda: Tesis del Año y Entregables Clicables */}
          <div className="space-y-4 lg:col-span-7">
            <div className="border border-[#091e3a]/15 bg-[#f8f9fa] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-[#091e3a] px-3 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00b4f5]">
                  FASE {activeYearPlan.yearNumber} DE 5 · {activeYearPlan.label}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(activeYearPlan.targetNav)}
                  className="font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-[#0077cc] hover:underline"
                >
                  {activeYearPlan.actionButtonLabel} →
                </button>
              </div>
              <h3 className="mt-3 font-['Outfit'] text-xl font-semibold text-[#091e3a]">
                {activeYearPlan.phaseTitle}
              </h3>
              <p className="mt-1 font-['Outfit'] text-xs font-medium text-[#755a34]">
                {activeYearPlan.subtitle}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                {activeYearPlan.executiveThesis}
              </p>
            </div>

            <div className="space-y-3">
              {activeYearPlan.deliverables.map((item, idx) => (
                <div
                  key={item.title}
                  className="flex flex-col justify-between gap-4 border border-[#eaedf0] bg-white p-4 transition hover:border-[#091e3a] sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-['Outfit'] text-xs font-bold text-[#755a34]">
                        {activeYearPlan.yearNumber}.{idx + 1}
                      </span>
                      <h4 className="font-['Outfit'] text-sm font-semibold text-[#091e3a]">
                        {item.title}
                      </h4>
                      <span className="border border-emerald-700/30 bg-emerald-50 px-2 py-0.5 font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-emerald-800">
                        Implementado
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-neutral-600">
                      {item.detail}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate(item.targetNav)}
                    className="shrink-0 self-start border border-[#091e3a] bg-[#091e3a] px-3.5 py-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc] sm:self-center"
                  >
                    Abrir {item.linkedModule} →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Los 9 KPIs Estratégicos para el Año Seleccionado */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-6 lg:col-span-5">
            <div className="border-b border-[#eaedf0] pb-4">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
                MÉTRICAS DE DESEMPEÑO · {activeYearPlan.label}
              </span>
              <h3 className="mt-1 font-['Outfit'] text-lg font-semibold text-[#091e3a]">
                9 KPIs de los Primeros Cinco Años
              </h3>
              <p className="mt-0.5 text-xs text-neutral-500">
                Haz clic en cualquier indicador para ver su metodología de medición.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                {
                  label: "1. Usuarios registrados",
                  value: activeYearPlan.kpis.registeredUsers,
                },
                {
                  label: "2. Desarrollos publicados",
                  value: activeYearPlan.kpis.publishedDevelopments,
                },
                {
                  label: "3. Propiedades activas",
                  value: activeYearPlan.kpis.activeProperties,
                },
                {
                  label: "4. Operaciones cerradas",
                  value: activeYearPlan.kpis.closedOperations,
                },
                {
                  label: "5. Proveedores afiliados",
                  value: activeYearPlan.kpis.affiliatedProviders,
                },
                {
                  label: "6. Ingreso recurrente (MRR)",
                  value: formatSovereignCurrency(
                    activeYearPlan.kpis.mrrUsd,
                    currency
                  ),
                },
                {
                  label: "7. Tasa de conversión",
                  value: activeYearPlan.kpis.conversionRate,
                },
                {
                  label: "8. Retención de clientes",
                  value: activeYearPlan.kpis.clientRetention,
                },
                {
                  label: "9. Uso de IA por usuario",
                  value: activeYearPlan.kpis.aiUsagePerUser,
                },
              ].map((kpiItem) => (
                <button
                  key={kpiItem.label}
                  type="button"
                  onClick={() =>
                    onOpenOptionDetail({
                      id: `kpi-${kpiItem.label}`,
                      kicker: `KPI ESTRATÉGICO · ${activeYearPlan.label}`,
                      title: kpiItem.label,
                      subtitle: `Meta Proyectada en ${activeYearPlan.label}: ${kpiItem.value}`,
                      executiveSummary:
                        "Indicador clave del Plan Estratégico a 5 años de Atlas Real Estate para auditar tracción comercial, adopción tecnológica, liquidez del Marketplace y crecimiento recurrente.",
                      keyMetrics: [
                        { label: "Fase Actual", value: activeYearPlan.label },
                        { label: "Meta del Año", value: kpiItem.value },
                        {
                          label: "Meta Año 5",
                          value:
                            STRATEGIC_5Y_ROADMAP[4].kpis.registeredUsers,
                        },
                      ],
                      bulletPoints: [
                        "Monitoreo en tiempo real desde el Tablero Ejecutivo de Proyecto Atlas.",
                        "Crecimiento impulsado por efectos de red entre desarrolladores, asesores y proveedores del Marketplace.",
                        "Optimización continua mediante los 4 Agentes IA especializados.",
                      ],
                      deliverables: [
                        "Reporte Mensual de Cohorte",
                        "Tablero de Conversión",
                        "Auditoría de Uso IA",
                      ],
                      actionLabel: "Ir al Tablero Ejecutivo",
                      targetNav: "executive",
                    })
                  }
                  className="border border-[#eaedf0] bg-white p-3.5 text-left transition hover:border-[#091e3a]"
                >
                  <span className="block font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    {kpiItem.label}
                  </span>
                  <span className="mt-1 block font-['Outfit'] text-sm font-bold text-[#091e3a]">
                    {kpiItem.value}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOS 10 MÓDULOS PRINCIPALES DE ATLAS REAL ESTATE */}
      <section className="border border-[#e2e6ec] bg-white p-7 sm:p-10">
        <div className="border-b border-[#eaedf0] pb-5">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#0077cc]">
            ARQUITECTURA FUNCIONAL COMPLETA · 10 MÓDULOS PRINCIPALES
          </span>
          <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-[#091e3a]">
            Los 10 Módulos Principales del Ecosistema Atlas Real Estate
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Cada uno de los 10 módulos del Plan Estratégico está construido e interconectado. Haz clic en cualquiera para abrirlo o consultar su especificación.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
          {TEN_CORE_MODULES.map((mod) => (
            <div
              key={mod.number}
              className="flex flex-col justify-between border border-[#eaedf0] bg-[#f8f9fa] p-5 transition hover:-translate-y-1 hover:border-[#091e3a] hover:bg-white hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#eaedf0] pb-2.5">
                  <span className="font-['Outfit'] text-lg font-bold text-[#091e3a]">
                    {mod.number}
                  </span>
                  <span className="bg-[#091e3a]/5 px-2 py-0.5 font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-[#755a34]">
                    {mod.yearIntroduced}
                  </span>
                </div>
                <span className="mt-3 block font-['Outfit'] text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0077cc]">
                  {mod.category}
                </span>
                <h3 className="mt-1 font-['Outfit'] text-base font-semibold text-[#091e3a]">
                  {mod.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  {mod.description}
                </p>

                <ul className="mt-3 space-y-1 border-t border-[#eaedf0] pt-2.5 text-[11px] text-neutral-500">
                  {mod.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-1.5">
                      <span className="text-[#755a34]">▪</span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex items-center gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => onNavigate(mod.targetNav)}
                  className="w-full bg-[#091e3a] px-3 py-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
                >
                  Abrir Módulo {mod.number} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MODELO DE INGRESOS & SIMULADOR DE MONETIZACIÓN (6 FUENTES) */}
      <section className="border border-[#e2e6ec] bg-white p-7 sm:p-10">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0] pb-6 lg:flex-row lg:items-end">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#004044]">
              MODELO DE NEGOCIO MULTICAPA · 6 FUENTES DE INGRESOS
            </span>
            <h2 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-[#091e3a]">
              Simulador de Ingresos Recurrentes (MRR / ARR) de Atlas Real Estate
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              Ajusta las variables de las 6 líneas de monetización del Plan Estratégico para proyectar el ingreso mensual y anualizado de la plataforma.
            </p>
          </div>

          <div className="flex items-center gap-4 border border-[#091e3a] bg-[#091e3a] px-5 py-3 text-white">
            <div>
              <span className="block font-['Outfit'] text-[9px] uppercase tracking-[0.2em] text-[#00b4f5]">
                MRR PROYECTADO (MENSUAL)
              </span>
              <span className="font-['Outfit'] text-xl font-bold text-white">
                {formatSovereignCurrency(revenueBreakdown.totalMrrUsd, currency)}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-white/20" />
            <div>
              <span className="block font-['Outfit'] text-[9px] uppercase tracking-[0.2em] text-[#faeedd]">
                ARR ANUALIZADO
              </span>
              <span className="font-['Outfit'] text-xl font-bold text-[#faeedd]">
                {formatSovereignCurrency(
                  revenueBreakdown.totalArrUsd,
                  currency,
                  true
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Fuente 1: Suscripción Mensual */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#0077cc]">
                01 · SUSCRIPCIÓN MENSUAL (SAAS)
              </span>
              <span className="font-['Outfit'] text-sm font-bold text-[#091e3a]">
                {formatSovereignCurrency(
                  revenueBreakdown.subscriptionMrr,
                  currency
                )}
                /mes
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Membresías mensuales para asesores, brokers e inmobiliarias ({saasSubscribers} usuarios × ${avgSubscriptionUsd} USD).
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span>Usuarios Suscritos:</span>
                <strong>{saasSubscribers} asesores</strong>
              </div>
              <input
                type="range"
                min={100}
                max={10000}
                step={50}
                value={saasSubscribers}
                onChange={(e) => setSaasSubscribers(Number(e.target.value))}
                className="w-full accent-[#091e3a]"
              />
              <div className="flex justify-between text-[11px]">
                <span>Ticket Promedio Mensual:</span>
                <strong>${avgSubscriptionUsd} USD</strong>
              </div>
              <input
                type="range"
                min={49}
                max={299}
                step={10}
                value={avgSubscriptionUsd}
                onChange={(e) => setAvgSubscriptionUsd(Number(e.target.value))}
                className="w-full accent-[#0077cc]"
              />
            </div>
          </div>

          {/* Fuente 2: Comisión por Servicios Contratados (Marketplace) */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
                02 · COMISIÓN MARKETPLACE
              </span>
              <span className="font-['Outfit'] text-sm font-bold text-[#091e3a]">
                {formatSovereignCurrency(
                  revenueBreakdown.marketplaceCommissionMrr,
                  currency
                )}
                /mes
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Comisiones por referencia de notarías, hipotecas, avalúos, interiorismo y administración de rentas.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span>Servicios Contratados / Mes:</span>
                <strong>{monthlyMarketplaceReferrals} operaciones</strong>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={monthlyMarketplaceReferrals}
                onChange={(e) =>
                  setMonthlyMarketplaceReferrals(Number(e.target.value))
                }
                className="w-full accent-[#755a34]"
              />
              <div className="flex justify-between text-[11px]">
                <span>Fee Promedio por Referencia:</span>
                <strong>${avgReferralFeeUsd} USD</strong>
              </div>
              <input
                type="range"
                min={200}
                max={2500}
                step={50}
                value={avgReferralFeeUsd}
                onChange={(e) => setAvgReferralFeeUsd(Number(e.target.value))}
                className="w-full accent-[#755a34]"
              />
            </div>
          </div>

          {/* Fuente 3: Publicidad Destacada */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#004044]">
                03 · PUBLICIDAD DESTACADA
              </span>
              <span className="font-['Outfit'] text-sm font-bold text-[#091e3a]">
                {formatSovereignCurrency(
                  revenueBreakdown.featuredAdsMrr,
                  currency
                )}
                /mes
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Posicionamiento patrocinado de desarrollos en preventa y proveedores destacados en el Marketplace.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span>Campañas Destacadas Activas:</span>
                <strong>{featuredDevelopmentsAds} desarrollos</strong>
              </div>
              <input
                type="range"
                min={2}
                max={120}
                step={2}
                value={featuredDevelopmentsAds}
                onChange={(e) =>
                  setFeaturedDevelopmentsAds(Number(e.target.value))
                }
                className="w-full accent-[#004044]"
              />
            </div>
          </div>

          {/* Fuente 4: Licencias Enterprise para Desarrolladoras */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a]">
                04 · LICENCIAS ENTERPRISE DESARROLLADORAS
              </span>
              <span className="font-['Outfit'] text-sm font-bold text-[#091e3a]">
                {formatSovereignCurrency(
                  revenueBreakdown.enterpriseLicensesMrr,
                  currency
                )}
                /mes
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Portal dedicado para actualización de inventario en tiempo real, gestión de fuerza de ventas y firma digital.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span>Desarrolladoras con Licencia Enterprise:</span>
                <strong>{enterpriseDevLicenses} grupos</strong>
              </div>
              <input
                type="range"
                min={2}
                max={100}
                step={1}
                value={enterpriseDevLicenses}
                onChange={(e) =>
                  setEnterpriseDevLicenses(Number(e.target.value))
                }
                className="w-full accent-[#091e3a]"
              />
            </div>
          </div>

          {/* Fuente 5: API para Terceros */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#0077cc]">
                05 · API PARA TERCEROS (CRMS &amp; ERPS)
              </span>
              <span className="font-['Outfit'] text-sm font-bold text-[#091e3a]">
                {formatSovereignCurrency(
                  revenueBreakdown.apiThirdPartyMrr,
                  currency
                )}
                /mes
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Suscripción por consumo de endpoints de inventario en vivo, valuación automatizada y sincronización ERP.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span>Organizaciones Conectadas vía API:</span>
                <strong>{thirdPartyApiConnections} conexiones</strong>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={thirdPartyApiConnections}
                onChange={(e) =>
                  setThirdPartyApiConnections(Number(e.target.value))
                }
                className="w-full accent-[#0077cc]"
              />
            </div>
          </div>

          {/* Fuente 6: Venta de Módulos Premium IA */}
          <div className="border border-[#eaedf0] bg-[#f8f9fa] p-5">
            <div className="flex items-center justify-between">
              <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
                06 · VENTA DE MÓDULOS PREMIUM IA
              </span>
              <span className="font-['Outfit'] text-sm font-bold text-[#091e3a]">
                {formatSovereignCurrency(
                  revenueBreakdown.premiumAiMrr,
                  currency
                )}
                /mes
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Agentes IA especializados (Ventas, Inversiones, Legal, Postventa), IA predictiva de plusvalía y redacción contractual.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px]">
                <span>Licencias Add-On Atlas AI:</span>
                <strong>{premiumAiModulesSold} licencias</strong>
              </div>
              <input
                type="range"
                min={50}
                max={3000}
                step={25}
                value={premiumAiModulesSold}
                onChange={(e) =>
                  setPremiumAiModulesSold(Number(e.target.value))
                }
                className="w-full accent-[#755a34]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
 * VISTA 2: PORTAL PARA DESARROLLADORES, API CRMS/ERPS, FIRMA ELECTRÓNICA &
 * AUTOMATIZACIÓN (AÑO 4 – ECOSISTEMA & MÓDULOS 7, 8 Y 10)
 * ========================================================================== */

interface DeveloperEcosystemViewProps {
  properties: AureaProperty[];
  currency: CurrencyCode;
  onUpdatePropertyRealtime: (
    propertyId: string,
    updates: Partial<
      Pick<AureaProperty, "availableUnits" | "priceUsd" | "deliveryStatus">
    >
  ) => void;
}

interface ElectronicSignatureEnvelope {
  id: string;
  documentTitle: string;
  developmentName: string;
  signerName: string;
  signerRole: string;
  nomStandard: string;
  status: "Firmado & Sellado" | "Pendiente de Firma" | "En Validación KYC";
  timestamp: string;
}

const INITIAL_ENVELOPES: ElectronicSignatureEnvelope[] = [
  {
    id: "env-01",
    documentTitle: "Carta Oferta & Reserva de Unidad T1-1501 (Ocean View)",
    developmentName: "Nautica Residences by Naúma",
    signerName: "Alejandro Vega · Family Office Monterrey",
    signerRole: "Promitente Comprador",
    nomStandard: "NOM-151-SCFI · Sello Digital de Tiempo",
    status: "Firmado & Sellado",
    timestamp: "Hoy · 10:15 HRS",
  },
  {
    id: "env-02",
    documentTitle: "Contrato de Promesa de Compraventa · Villa Elara (V2)",
    developmentName: "The Villas Collection by Nautica",
    signerName: "Patrimonial Santa Fe S.A. de C.V.",
    signerRole: "Representante Legal",
    nomStandard: "NOM-247-SE-2021 & e.firma",
    status: "Pendiente de Firma",
    timestamp: "Hoy · 12:40 HRS",
  },
  {
    id: "env-03",
    documentTitle: "Instrucción de Apertura de Fideicomiso Zona Restringida",
    developmentName: "Isla Blanca Residences — Losantos Huayacán",
    signerName: "Marcus Vance · Vance Capital LLC",
    signerRole: "Fideicomisario Extranjero",
    nomStandard: "Art. 27 SRE · Escrow Fiduciario",
    status: "En Validación KYC",
    timestamp: "Ayer · 17:20 HRS",
  },
];

export const DeveloperEcosystemView: React.FC<DeveloperEcosystemViewProps> = ({
  properties,
  currency,
  onUpdatePropertyRealtime,
}) => {
  const [envelopes, setEnvelopes] = usePersistentState<
    ElectronicSignatureEnvelope[]
  >("proyecto_atlas_esign_envelopes_v3", INITIAL_ENVELOPES);
  const [newDocClient, setNewDocClient] = useState("");
  const [newDocPropId, setNewDocPropId] = useState(properties[0]?.id ?? "");
  const [newDocType, setNewDocType] = useState(
    "Carta Oferta Oficial (Esquema 50/30/20)"
  );
  const [apiSyncStatus, setApiSyncStatus] = useState<string | null>(null);

  const [automationWorkflows, setAutomationWorkflows] = usePersistentState<
    {
      id: string;
      channel: "WhatsApp Business API" | "Correo Institucional" | "Webhook CRM";
      title: string;
      trigger: string;
      action: string;
      active: boolean;
      executionsCount: number;
    }[]
  >("proyecto_atlas_automations_v3", [
    {
      id: "auto-1",
      channel: "WhatsApp Business API",
      title: "Envío Instantáneo de Brochure, ROI y Plantas tras Registro",
      trigger: "Nuevo prospecto registrado en CRM Pipeline",
      action:
        "Envía por WhatsApp el brochure oficial de Google Drive, corrida de Cap Rate y link a la Selección Exclusiva en menos de 15 segundos.",
      active: true,
      executionsCount: 342,
    },
    {
      id: "auto-2",
      channel: "Correo Institucional",
      title: "Alerta de Descuento de Preventa y Planes de Pago (Hasta 10%)",
      trigger: "Prospecto avanza a etapa 'Envío de Portafolio'",
      action:
        "Despacha comparativa automática entre esquemas 30/70, 50/30/20 y 80/20 con el ahorro neto calculado.",
      active: true,
      executionsCount: 218,
    },
    {
      id: "auto-3",
      channel: "WhatsApp Business API",
      title: "Confirmación de Recorrido VIP & Ubicación GPS",
      trigger: "24 horas antes de Visita Presencial o Showroom",
      action:
        "Envía pin satelital exacto, pase de acceso a caseta y datos del broker asignado.",
      active: true,
      executionsCount: 129,
    },
    {
      id: "auto-4",
      channel: "Webhook CRM",
      title: "Sincronización de Inventario con ERPs de Desarrolladoras",
      trigger: "Unidad apartada o Carta Oferta firmada electrónicamente",
      action:
        "Actualiza disponibilidad en tiempo real y notifica a Notaría y Broker Hipotecario en el Marketplace.",
      active: true,
      executionsCount: 94,
    },
  ]);

  const handleCreateSignatureEnvelope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocClient.trim()) return;
    const foundProp =
      properties.find((p) => p.id === newDocPropId) ?? properties[0];
    const created: ElectronicSignatureEnvelope = {
      id: `env-${Date.now()}`,
      documentTitle: `${newDocType} — ${foundProp.name}`,
      developmentName: foundProp.name,
      signerName: newDocClient.trim(),
      signerRole: "Adquirente / Inversionista",
      nomStandard: "NOM-151-SCFI · Firma Electrónica Avanzada",
      status: "Pendiente de Firma",
      timestamp: "Hace unos segundos",
    };
    setEnvelopes((prev) => [created, ...prev]);
    setNewDocClient("");
  };

  const handleToggleSignStatus = (id: string) => {
    setEnvelopes((prev) =>
      prev.map((env) =>
        env.id === id
          ? {
              ...env,
              status:
                env.status === "Firmado & Sellado"
                  ? "Pendiente de Firma"
                  : "Firmado & Sellado",
              timestamp: "Actualizado ahora",
            }
          : env
      )
    );
  };

  const handleTriggerApiSync = (connectorName: string) => {
    setApiSyncStatus(
      `Sincronización bidireccional completada con ${connectorName}: ${properties.length} desarrollos, listas de precios Google Drive y leads actualizados (Latencia: 42ms).`
    );
    setTimeout(() => setApiSyncStatus(null), 4500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Encabezado Portal de Desarrolladores & Ecosistema Año 4 */}
      <div className="border border-[#091e3a] bg-[#091e3a] p-7 text-white">
        <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#00b4f5]">
          AÑO 4 · ECOSISTEMA ENTERPRISE · MÓDULOS 07, 08 Y 10
        </span>
        <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight sm:text-3xl">
          Portal para Desarrolladores, API CRMs/ERPs, Firma Electrónica &amp; Automatización
        </h1>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-slate-300">
          Publica y actualiza inventario en tiempo real en toda la plataforma, conecta CRMs y ERPs corporativos vía API, gestiona contratos con firma electrónica certificada y automatiza el seguimiento por WhatsApp y correo.
        </p>
      </div>

      {/* 1. PANEL PARA DESARROLLADORES: PUBLICACIÓN Y ACTUALIZACIÓN DE INVENTARIO EN TIEMPO REAL */}
      <section className="border border-[#e2e6ec] bg-white p-6 sm:p-8">
        <div className="border-b border-[#eaedf0] pb-4">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
            MÓDULO 10 · PORTAL PARA DESARROLLADORES (TIEMPO REAL)
          </span>
          <h2 className="mt-1 font-['Outfit'] text-xl font-semibold text-[#091e3a]">
            Publicación y Actualización de Inventario en Tiempo Real
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Cualquier ajuste realizado aquí por la desarrolladora actualiza instantáneamente el Inventario Maestro, el Mapa Interactivo y las cotizaciones de todos los asesores.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eaedf0] bg-[#f8f9fa] font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                <th className="p-3">Desarrollo / Desarrollador</th>
                <th className="p-3">Zona</th>
                <th className="p-3">Unidades Disponibles (En Vivo)</th>
                <th className="p-3">Precio Base ({currency})</th>
                <th className="p-3">Estatus de Entrega</th>
                <th className="p-3">Sincronización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedf0]">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-[#f8f9fa]">
                  <td className="p-3">
                    <div className="font-['Outfit'] font-semibold text-[#091e3a]">
                      {prop.name}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {prop.developerName} · {prop.code}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-neutral-700">
                    {prop.zone}
                  </td>
                  <td className="p-3">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdatePropertyRealtime(prop.id, {
                            availableUnits: Math.max(0, prop.availableUnits - 1),
                          })
                        }
                        className="h-6 w-6 border border-[#eaedf0] bg-white font-bold text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-['Outfit'] font-bold text-[#091e3a]">
                        {prop.availableUnits} / {prop.totalUnits}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdatePropertyRealtime(prop.id, {
                            availableUnits: Math.min(
                              prop.totalUnits,
                              prop.availableUnits + 1
                            ),
                          })
                        }
                        className="h-6 w-6 border border-[#eaedf0] bg-white font-bold text-[#091e3a] hover:bg-[#091e3a] hover:text-white"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 font-['Outfit'] font-semibold text-[#0077cc]">
                    {formatSovereignCurrency(prop.priceUsd, currency)}
                  </td>
                  <td className="p-3">
                    <select
                      aria-label={`Estatus de entrega para ${prop.name}`}
                      value={prop.deliveryStatus}
                      onChange={(e) =>
                        onUpdatePropertyRealtime(prop.id, {
                          deliveryStatus: e.target.value as DeliveryStatus,
                        })
                      }
                      className="border border-[#eaedf0] bg-white px-2.5 py-1 font-['Outfit'] text-xs text-[#091e3a]"
                    >
                      <option value="Entrega Inmediata">Entrega Inmediata</option>
                      <option value="Preventa Q4 2026">Preventa Q4 2026</option>
                      <option value="Preventa Q2 2027">Preventa Q2 2027</option>
                      <option value="Preventa Q1 2028">Preventa Q1 2028</option>
                      <option value="Llave en Mano">Llave en Mano</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span className="border border-emerald-700/30 bg-emerald-50 px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                      Tiempo Real Activo
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. API GATEWAY PARA CONECTAR CRMS Y ERPS */}
      <section className="border border-[#e2e6ec] bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#eaedf0] pb-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0077cc]">
              INTEROPERABILIDAD ENTERPRISE · API REST &amp; GRAPHQL
            </span>
            <h2 className="mt-1 font-['Outfit'] text-xl font-semibold text-[#091e3a]">
              API para Conectar CRMs y ERPs de Terceros
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Conecta la disponibilidad de unidades, listas de precios y prospectos con los sistemas corporativos de desarrolladoras y master brokers.
            </p>
          </div>
          <code className="border border-[#eaedf0] bg-[#f8f9fa] px-3 py-1.5 font-mono text-[11px] text-[#091e3a]">
            POST https://api.proyectoatlas.mx/v1/inventory/sync
          </code>
        </div>

        {apiSyncStatus && (
          <div className="mt-4 border-l-4 border-emerald-600 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-900">
            {apiSyncStatus}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: "HubSpot & Salesforce CRM",
              protocol: "OAuth 2.0 + Webhooks Bidireccionales",
              desc: "Sincroniza prospectos, etapas del embudo, notas de asesores y asignación Round-Robin.",
            },
            {
              name: "SAP Real Estate & Oracle NetSuite",
              protocol: "ERP Connector · bloqueo de unidades",
              desc: "Actualiza en vivo estatus de unidades (Disponible / Reservado), planes de pago y conciliación fiduciaria.",
            },
            {
              name: "Tokko Broker, EasyBroker & Enkora",
              protocol: "Feed XML / JSON en Tiempo Real",
              desc: "Distribución sindicada de fichas técnicas, renders de Google Drive y listas de precios.",
            },
            {
              name: "Google Drive Official Sync API",
              protocol: "Carpeta Maestra 1HQ54e_SslhD...",
              desc: "Monitoreo automático de nuevos brochures, plantas arquitectónicas y listas de precios PDF/XLSX.",
            },
          ].map((conn) => (
            <div
              key={conn.name}
              className="flex flex-col justify-between border border-[#eaedf0] bg-[#f8f9fa] p-4"
            >
              <div>
                <span className="font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-[#755a34]">
                  {conn.protocol}
                </span>
                <h3 className="mt-1 font-['Outfit'] text-sm font-semibold text-[#091e3a]">
                  {conn.name}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                  {conn.desc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTriggerApiSync(conn.name)}
                className="mt-4 w-full border border-[#091e3a] bg-white py-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a] transition hover:bg-[#091e3a] hover:text-white"
              >
                Probar Sincronización API →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GESTIÓN DOCUMENTAL & FIRMA ELECTRÓNICA + 4. MARKETING Y AUTOMATIZACIÓN */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Firma Electrónica */}
        <section className="border border-[#e2e6ec] bg-white p-6 lg:col-span-6">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#004044]">
            MÓDULO 07 · GESTIÓN DOCUMENTAL &amp; FIRMA ELECTRÓNICA
          </span>
          <h2 className="mt-1 font-['Outfit'] text-lg font-semibold text-[#091e3a]">
            Firma Electrónica de Cartas Oferta y Contratos
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Genera sobres digitales con validez jurídica (NOM-151 / NOM-247) listos para firma remota del inversionista.
          </p>

          <form
            onSubmit={handleCreateSignatureEnvelope}
            className="mt-4 grid grid-cols-1 gap-2.5 border border-[#eaedf0] bg-[#f8f9fa] p-4 sm:grid-cols-3"
          >
            <input
              type="text"
              value={newDocClient}
              onChange={(e) => setNewDocClient(e.target.value)}
              placeholder="Nombre del firmante..."
              className="border border-[#eaedf0] bg-white px-3 py-2 text-xs text-black"
            />
            <select
              aria-label="Seleccionar desarrollo para firma"
              value={newDocPropId}
              onChange={(e) => setNewDocPropId(e.target.value)}
              className="border border-[#eaedf0] bg-white px-2.5 py-2 text-xs text-black"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-[#091e3a] px-3 py-2 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#0077cc]"
            >
              + Enviar a Firma Digital
            </button>
            <div className="sm:col-span-3">
              <select
                aria-label="Tipo de documento jurídico"
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value)}
                className="w-full border border-[#eaedf0] bg-white px-2.5 py-1.5 text-xs text-neutral-700"
              >
                <option value="Carta Oferta Oficial (Esquema 50/30/20)">
                  Documento: Carta Oferta Oficial (Esquema 50/30/20)
                </option>
                <option value="Contrato de Promesa de Compraventa (NOM-247)">
                  Documento: Contrato de Promesa de Compraventa (NOM-247)
                </option>
                <option value="Instrucción de Apertura de Fideicomiso SRE">
                  Documento: Instrucción de Apertura de Fideicomiso SRE
                </option>
              </select>
            </div>
          </form>

          <div className="mt-4 space-y-2.5">
            {envelopes.map((env) => (
              <div
                key={env.id}
                className="flex flex-col justify-between gap-3 border border-[#eaedf0] p-3.5 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-['Outfit'] text-xs font-semibold text-[#091e3a]">
                      {env.documentTitle}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    Firmante: <strong>{env.signerName}</strong> ·{" "}
                    {env.nomStandard} · {env.timestamp}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleSignStatus(env.id)}
                  className={`shrink-0 px-3 py-1.5 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider transition ${
                    env.status === "Firmado & Sellado"
                      ? "bg-emerald-800 text-white"
                      : "border border-[#755a34] bg-[#faeedd] text-[#755a34] hover:bg-[#755a34] hover:text-white"
                  }`}
                >
                  {env.status}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Marketing y Automatización (Seguimiento Automático WhatsApp y Correo) */}
        <section className="border border-[#e2e6ec] bg-white p-6 lg:col-span-6">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.22em] text-[#755a34]">
            MÓDULO 08 · MARKETING Y AUTOMATIZACIÓN (AÑO 2 &amp; AÑO 4)
          </span>
          <h2 className="mt-1 font-['Outfit'] text-lg font-semibold text-[#091e3a]">
            Seguimiento Automático por WhatsApp y Correo
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Flujos autónomos que envían brochures, propuestas de ROI y recordatorios según el avance del cliente en el embudo.
          </p>

          <div className="mt-4 space-y-3">
            {automationWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="border border-[#eaedf0] bg-[#f8f9fa] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-['Outfit'] text-[9px] font-semibold uppercase tracking-wider text-[#0077cc]">
                      {wf.channel} · {wf.executionsCount} envíos automáticos
                    </span>
                    <h3 className="mt-0.5 font-['Outfit'] text-xs font-semibold text-[#091e3a]">
                      {wf.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setAutomationWorkflows((prev) =>
                        prev.map((item) =>
                          item.id === wf.id
                            ? { ...item, active: !item.active }
                            : item
                        )
                      )
                    }
                    className={`px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider ${
                      wf.active
                        ? "bg-[#091e3a] text-white"
                        : "border border-neutral-300 bg-white text-neutral-500"
                    }`}
                  >
                    {wf.active ? "Activo" : "Pausado"}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-neutral-600">
                  <strong>Disparador:</strong> {wf.trigger}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500">
                  <strong>Acción:</strong> {wf.action}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
