import React, { useEffect, useRef, useState } from "react";
import { AureaProperty, CurrencyCode, NavSectionId } from "../types";
import { formatSovereignCurrency } from "../storage/useAureaStorage";
import { AtlasBrandLogo } from "../components/AtlasBrandLogo";

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
  onOpenDossier: (property: AureaProperty) => void;
  onOpenExitConcierge?: () => void;
}

export const AtlasHomeOverviewView: React.FC<AtlasHomeOverviewViewProps> = ({
  properties,
  currency,
  isDarkMode = false,
  onNavigate,
  onOpenDossier,
  onOpenExitConcierge,
}) => {
  const totalPortfolioUsd = properties.reduce((acc, p) => acc + p.priceUsd, 0);

  const PLATFORM_DISCIPLINES = [
    {
      numeral: "I",
      category: "AUDITORÍA & ACTIVOS",
      title: "Inventario Maestro & Verificación Documental",
      description:
        "Concentra los desarrollos más exclusivos de Cancún Zona Hotelera, Puerto Cancún, Isla Pok Ta Pok, Riviera Maya y Playa del Carmen con acceso directo a carpetas oficiales de Google Drive, planos ejecutivos y listas de precios vigentes.",
      actionLabel: "Explorar Inventario Maestro",
      target: "inventory" as NavSectionId,
    },
    {
      numeral: "II",
      category: "INGENIERÍA FINANCIERA",
      title: "Modelado de Cap Rate & Comparador Multidimensional",
      description:
        "Calcula con rigor institucional el retorno neto anual, flujo de efectivo por rentas vacacionales (ADR y ocupación), plusvalía proyectada a 5 años y compara hasta tres propiedades en simultáneo.",
      actionLabel: "Ejecutar Simulador Financiero",
      target: "calculator" as NavSectionId,
    },
    {
      numeral: "III",
      category: "DEALFLOW PATRIMONIAL",
      title: "CRM de 6 Fases & Curaduría para Family Offices",
      description:
        "Gestiona cada operación desde el contacto inicial y calificación patrimonial hasta la firma notarial, generando colecciones privadas a medida y comunicación directa con protocolo ejecutivo.",
      actionLabel: "Abrir Pipeline Comercial",
      target: "crm" as NavSectionId,
    },
    {
      numeral: "IV",
      category: "INTELIGENCIA JURÍDICA & AGENCIA",
      title: "Atlas Copilot IA & Gobernanza Multi-Broker",
      description:
        "Resuelve al instante consultas sobre Fideicomisos en Zona Restringida, costos de escrituración, ISR/IVA y cumplimiento NOM-247, integrado con asignación Round-Robin y split de comisiones.",
      actionLabel: "Consultar Atlas Copilot",
      target: "copilot" as NavSectionId,
    },
  ];

  const TRUST_CERTIFICATES = [
    {
      code: "NOM-247-SE-2021",
      authority: "NORMATIVA FEDERAL MÉXICO",
      title: "Cumplimiento en Contratos de Preventa",
      detail:
        "Expedientes técnicos validados con licencias de construcción, garantías estructurales y apego estricto a protección del adquirente.",
    },
    {
      code: "SRE · ARTÍCULO 27",
      authority: "CERTEZA FIDUCIARIA BANCARIA",
      title: "Fideicomisos en Zona Restringida",
      detail:
        "Protocolo jurídico verificado con instituciones fiduciarias de primer orden para inversionistas extranjeros y patrimonios familiares.",
    },
    {
      code: "ISO/IEC 27001 · LFPDPPP",
      authority: "SEGURIDAD DE LA INFORMACIÓN",
      title: "Bóveda Cifrada & Protección de Datos",
      detail:
        "Resguardo de información patrimonial, sanitización contra inyecciones de código y trazabilidad completa en registro de auditoría.",
    },
    {
      code: "ESTÁNDAR RICS / AMPI",
      authority: "VALUACIÓN & DUE DILIGENCE",
      title: "Auditoría Semanal de Inventario Oficial",
      detail:
        "Sincronización periódica de disponibilidad real, métricas de precio por metro cuadrado y validación de escrituración notarial.",
    },
  ];

  return (
    <div className="space-y-14 pb-16">
      {/* =====================================================================
          1. HERO ARQUITECTÓNICO CON ANIMACIÓN CINEMATOGRÁFICA
      ====================================================================== */}
      <section
        className={`relative overflow-hidden border transition-colors duration-500 ${
          isDarkMode
            ? "border-[#1e2f48] bg-[#091322] text-white"
            : "border-[#e2e6ec] bg-white text-[#091e3a]"
        }`}
      >
        {/* Líneas reticulares arquitectónicas sutiles de fondo */}
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
              {/* Kicker tipográfico sin badges ni puntos */}
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
                <strong>Proyecto Atlas</strong> es la plataforma integral de Real Estate de ultra lujo y sistema operativo PropTech diseñada para brokers, desarrolladores y family offices. Unificamos en un entorno de banca privada la auditoría documental de preventas, el modelado financiero de rendimientos y la ejecución comercial de principio a fin.
              </p>

              {/* Microinteracciones en Botones Principales */}
              <div className="animate-hero-rise-3 mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
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
                  onClick={() => onNavigate("inventory")}
                  className={`atlas-btn-secondary group inline-flex items-center justify-center gap-3 border px-7 py-4 font-['Outfit'] text-xs font-medium uppercase tracking-[0.2em] ${
                    isDarkMode
                      ? "border-slate-700 bg-transparent text-slate-200 hover:border-[#00b4f5] hover:text-white"
                      : "border-[#091e3a]/25 bg-[#f8f9fa] text-[#091e3a] hover:border-[#091e3a] hover:bg-white"
                  }`}
                >
                  <span>Explorar Cartera de Activos</span>
                  <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                    north_east
                  </span>
                </button>
              </div>
            </div>

            {/* Cifras Institucionales con tipografía limpia */}
            <div
              className={`mt-12 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4 ${
                isDarkMode ? "border-slate-800" : "border-[#eaedf0]"
              }`}
            >
              <div>
                <span className="block font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  Volumen en Cartera
                </span>
                <span
                  className={`mt-1.5 block font-['Outfit'] text-xl font-semibold tabular-nums sm:text-2xl ${
                    isDarkMode ? "text-white" : "text-[#091e3a]"
                  }`}
                >
                  {formatSovereignCurrency(totalPortfolioUsd, currency, true)}
                </span>
              </div>
              <div>
                <span className="block font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  Activos Auditados
                </span>
                <span className="mt-1.5 block font-['Outfit'] text-xl font-semibold tabular-nums text-[#0077cc] sm:text-2xl">
                  14 Desarrollos
                </span>
              </div>
              <div>
                <span className="block font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  Rendimiento Anual
                </span>
                <span
                  className={`mt-1.5 block font-['Outfit'] text-xl font-semibold tabular-nums sm:text-2xl ${
                    isDarkMode ? "text-emerald-400" : "text-[#004044]"
                  }`}
                >
                  11.5% — 14.8%
                </span>
              </div>
              <div>
                <span className="block font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  Cobertura Territorial
                </span>
                <span className="mt-1.5 block font-['Outfit'] text-xl font-semibold tabular-nums text-[#755a34] sm:text-2xl">
                  5 Corredores
                </span>
              </div>
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
            <div
              className={`animate-atlas-float relative flex flex-col items-center border p-10 transition-all duration-500 ${
                isDarkMode
                  ? "border-slate-800 bg-white/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                  : "border-[#e5e8ec] bg-white shadow-[0_20px_50px_rgba(9,30,58,0.06)]"
              }`}
            >
              {/* Esquinas arquitectónicas finas */}
              <span className="pointer-events-none absolute left-2.5 top-2.5 h-3 w-3 border-l border-t border-[#091e3a]/30" />
              <span className="pointer-events-none absolute right-2.5 top-2.5 h-3 w-3 border-r border-t border-[#091e3a]/30" />
              <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l border-[#091e3a]/30" />
              <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-3 w-3 border-b border-r border-[#091e3a]/30" />

              <AtlasBrandLogo
                variant="full"
                theme="light"
                className="h-44 w-auto sm:h-52"
              />
            </div>

            <div className="mt-6 text-center">
              <p className="font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
                SISTEMA OPERATIVO INMOBILIARIO · MÉXICO
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. CARTA EDITORIAL & LIDERAZGO — ANDRE FRAGA (RETRATO EDITORIAL COMPACTO)
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
            {/* Retrato Editorial Compacto (Estilo Architectural Digest / FT) */}
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

                {/* Pie de foto editorial sobrio */}
                <div className="mt-4 text-center lg:text-left">
                  <div className="font-['Outfit'] text-base font-semibold tracking-wide">
                    Andre Fraga
                  </div>
                  <div className="mt-0.5 font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.24em] text-[#0077cc]">
                    CEO &amp; Founder · Proyecto Atlas
                  </div>
                  <div className="mt-2 h-[1px] w-12 bg-[#755a34] mx-auto lg:mx-0" />
                </div>
              </div>
            </div>

            {/* Columna Editorial de Visión y Resumen Ejecutivo */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#755a34]" />
                <span className="font-['Outfit'] text-[11px] font-medium uppercase tracking-[0.26em] text-[#755a34]">
                  DIRECCIÓN EJECUTIVA &amp; TESIS DE LA PLATAFORMA
                </span>
              </div>

              <h2 className="mt-4 font-['Outfit'] text-2xl font-light leading-snug tracking-tight sm:text-3xl">
                “La inversión inmobiliaria de alto patrimonio exige{" "}
                <span className="font-semibold">
                  rigor técnico, transparencia documental y velocidad de ejecución
                </span>
                .”
              </h2>

              <div
                className={`mt-5 grid grid-cols-1 gap-6 text-xs leading-[1.85] sm:grid-cols-2 sm:text-sm ${
                  isDarkMode ? "text-slate-300" : "text-neutral-600"
                }`}
              >
                <p>
                  Bajo la dirección de <strong>Andre Fraga</strong>,{" "}
                  <strong>Proyecto Atlas</strong> nace para resolver la fragmentación operativa del sector inmobiliario en México. Reemplazamos las hojas de cálculo aisladas y los enlaces dispersos por una arquitectura centralizada donde cada activo cuenta con trazabilidad documental y métricas verificadas.
                </p>
                <p>
                  Desde la evaluación del Cap Rate neto y la plusvalía proyectada hasta la estructuración de Fideicomisos en Zona Restringida y el cierre notarial, la plataforma dota al broker y al inversionista de herramientas institucionales para tomar decisiones con certidumbre absoluta.
                </p>
              </div>

              <div
                className={`mt-7 flex flex-wrap items-center justify-between gap-4 border-t pt-5 ${
                  isDarkMode ? "border-slate-800" : "border-[#eaedf0]"
                }`}
              >
                <div>
                  <span className="font-['Outfit'] text-xs font-semibold tracking-wider">
                    ANDRE FRAGA
                  </span>
                  <span className="mx-2 text-neutral-400">—</span>
                  <span className="font-['Outfit'] text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                    Dirección General · Cancún &amp; Riviera Maya
                  </span>
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
          3. ¿DE QUÉ TRATA PROYECTO ATLAS? — ARQUITECTURA EN 4 DISCIPLINAS
      ====================================================================== */}
      <ScrollRevealSection delayMs={90}>
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-3 border-b border-[#eaedf0] pb-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-[#0077cc]" />
                <span className="font-['Outfit'] text-[11px] font-medium uppercase tracking-[0.26em] text-[#0077cc]">
                  ECOSISTEMA INTEGRAL
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
              Selecciona una disciplina para acceder al módulo operativo
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PLATFORM_DISCIPLINES.map((item) => (
              <div
                key={item.numeral}
                onClick={() => onNavigate(item.target)}
                className={`group cursor-pointer border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode
                    ? "border-[#1e2f48] bg-[#0c1524] hover:border-[#00b4f5]"
                    : "border-[#e2e6ec] bg-white hover:border-[#091e3a] hover:shadow-[0_16px_40px_rgba(9,30,58,0.06)]"
                }`}
              >
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

                <div className="mt-6 flex items-center justify-between pt-2">
                  <span className="font-['Outfit'] text-xs font-semibold uppercase tracking-[0.18em] text-[#0077cc]">
                    {item.actionLabel}
                  </span>
                  <span className="material-symbols-outlined text-[17px] text-[#0077cc] transition-transform duration-300 group-hover:translate-x-1.5">
                    east
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollRevealSection>

      {/* =====================================================================
          4. SELECCIÓN EDITORIAL DE PROPIEDADES INSIGNIA
      ====================================================================== */}
      <ScrollRevealSection delayMs={110}>
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
                  CURADURÍA PATRIMONIAL
                </span>
              </div>
              <h3
                className={`mt-2 font-['Outfit'] text-2xl font-semibold tracking-tight ${
                  isDarkMode ? "text-white" : "text-[#091e3a]"
                }`}
              >
                Activos Insignia en Cartera
              </h3>
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

          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
            {properties.slice(0, 3).map((prop) => {
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
                    <div className="relative h-52 overflow-hidden bg-neutral-900">
                      <img
                        src={imgUrl}
                        alt={prop.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4">
                        <span className="font-['Outfit'] text-[10px] font-medium uppercase tracking-[0.22em] text-[#faeedd]">
                          {prop.zone}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4
                          className={`font-['Outfit'] text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-[#091e3a]"
                          }`}
                        >
                          {prop.name}
                        </h4>
                        <span className="font-['Outfit'] text-xs font-semibold text-[#0077cc]">
                          ROI {prop.roiAnnualPct}%
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                        {prop.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#eaedf0] px-5 py-3.5">
                    <span
                      className={`font-['Outfit'] text-sm font-semibold tabular-nums ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {formatSovereignCurrency(prop.priceUsd, currency, true)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenDossier(prop)}
                      className="group/btn inline-flex items-center gap-1 font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0077cc] hover:text-[#755a34]"
                    >
                      <span>Ficha Dossier</span>
                      <span className="material-symbols-outlined text-[14px] transition-transform duration-200 group-hover/btn:translate-x-0.5">
                        north_east
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </ScrollRevealSection>

      {/* =====================================================================
          5. CERTIFICADOS Y SELLOS CONFIABLES (TRUST & COMPLIANCE)
      ====================================================================== */}
      <ScrollRevealSection delayMs={140}>
        <section
          className={`border p-7 sm:p-10 ${
            isDarkMode
              ? "border-[#1e2f48] bg-[#091322]"
              : "border-[#e2e6ec] bg-white"
          }`}
        >
          <div className="border-b border-[#eaedf0] pb-5">
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

          <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CERTIFICATES.map((cert) => (
              <div
                key={cert.code}
                className={`flex flex-col justify-between border p-5 ${
                  isDarkMode
                    ? "border-slate-800 bg-[#0c1524]"
                    : "border-[#eaedf0] bg-[#f8f9fa]"
                }`}
              >
                <div>
                  {/* Sello vectorial arquitectónico minimalista */}
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

                <div className="mt-4 border-t border-[#eaedf0] pt-2.5">
                  <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#004044]">
                    VERIFICACIÓN ACTIVA
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollRevealSection>
    </div>
  );
};
