import React from "react";
import { AureaProperty, CurrencyCode, NavSectionId } from "../types";
import { formatSovereignCurrency } from "../storage/useAureaStorage";
import { AtlasBrandLogo } from "../components/AtlasBrandLogo";

interface AtlasHomeOverviewViewProps {
  properties: AureaProperty[];
  currency: CurrencyCode;
  onNavigate: (section: NavSectionId) => void;
  onOpenDossier: (property: AureaProperty) => void;
}

export const AtlasHomeOverviewView: React.FC<AtlasHomeOverviewViewProps> = ({
  properties,
  currency,
  onNavigate,
  onOpenDossier,
}) => {
  const totalPortfolioUsd = properties.reduce((acc, p) => acc + p.priceUsd, 0);

  const PLATFORM_PILLARS = [
    {
      number: "01",
      title: "Inventario Maestro & Auditoría de Google Drives",
      description:
        "Centraliza las preventas y propiedades insignia de Cancún Zona Hotelera, Puerto Cancún, Isla Pok Ta Pok, Riviera Maya y Playa del Carmen con acceso verificado a carpetas oficiales de Google Drive (planos, listas de precios y documentos fiduciarios).",
      actionLabel: "Explorar Inventario",
      target: "inventory" as NavSectionId,
      icon: "apartment",
    },
    {
      number: "02",
      title: "Simulación Financiera & Comparador Multidimensional",
      description:
        "Evalúa en tiempo real el Cap Rate neto, flujo de caja anual por rentas vacacionales (ADR y ocupación), plusvalía proyectada a 5 años y compara hasta 3 activos en simultáneo lado a lado.",
      actionLabel: "Abrir Calculadora ROI",
      target: "calculator" as NavSectionId,
      icon: "calculate",
    },
    {
      number: "03",
      title: "CRM Patrimonial de 6 Fases & Gestor de Clientes",
      description:
        "Controla el embudo comercial completo desde Contacto Inicial y Calificación Patrimonial hasta Firma Notarial, con envío de propuestas exclusivas y contacto directo por WhatsApp pre-redactado.",
      actionLabel: "Ver Pipeline CRM",
      target: "crm" as NavSectionId,
      icon: "view_kanban",
    },
    {
      number: "04",
      title: "Atlas Copilot (IA) & Suite Multi-Broker",
      description:
        "Asistente entrenado en Fideicomisos en Zona Restringida (Art. 27), costos notariales, ISR/IVA y NOM-247, integrado con asignación Round-Robin para agencias, split de comisiones y Bóveda de Seguridad.",
      actionLabel: "Consultar Atlas Copilot",
      target: "copilot" as NavSectionId,
      icon: "temp_preferences_custom",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. HERO PRINCIPAL DE PROYECTO ATLAS */}
      <section className="overflow-hidden rounded-2xl border border-[#eaedf0] bg-white shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Columna Izquierda: Propuesta de Valor y Resumen */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:col-span-7">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0077cc]/30 bg-[#0077cc]/5 px-3.5 py-1">
                <span className="h-2 w-2 rounded-full bg-[#00a8e8]" />
                <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#091e3a]">
                  PROYECTO ATLAS · REAL ESTATE PLATFORM
                </span>
              </div>

              <h1 className="mt-4 font-['Outfit'] text-3xl font-bold leading-tight tracking-tight text-[#091e3a] sm:text-4xl">
                El Sistema Operativo Inmobiliario y Patrimonial para Brokers e Inversionistas
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                <strong>Proyecto Atlas</strong> es una plataforma integral de{" "}
                <em>Real Estate de Ultra Lujo y PropTech OS</em> diseñada para profesionalizar, auditar y acelerar la comercialización e inversión en desarrollos patrimoniales del Caribe Mexicano. Unifica en un solo ecosistema el inventario verificado, la corrida financiera de rendimientos, el CRM de prospectos VIP y la inteligencia jurídica-fiscal.
              </p>

              {/* Botones de Acción Rápida */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate("executive")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#091e3a] px-5 py-3 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#00c2ff]">
                    space_dashboard
                  </span>
                  Entrar al Centro de Mando Ejecutivo
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate("inventory")}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#091e3a]/20 bg-[#f8f9fa] px-5 py-3 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-[#091e3a] transition hover:border-[#091e3a] hover:bg-white"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    apartment
                  </span>
                  Ver Inventario de Desarrollos
                </button>
              </div>
            </div>

            {/* KPIs Resumen al pie del Hero */}
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#eaedf0] pt-6 sm:grid-cols-4">
              <div>
                <span className="block font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Cartera Activa
                </span>
                <span className="mt-0.5 block font-['Outfit'] text-lg font-bold text-[#091e3a]">
                  {formatSovereignCurrency(totalPortfolioUsd, currency, true)}
                </span>
              </div>
              <div>
                <span className="block font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Desarrollos Auditados
                </span>
                <span className="mt-0.5 block font-['Outfit'] text-lg font-bold text-[#0077cc]">
                  14 Preventas VIP
                </span>
              </div>
              <div>
                <span className="block font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  ROI Promedio Anual
                </span>
                <span className="mt-0.5 block font-['Outfit'] text-lg font-bold text-[#004044]">
                  11.5% – 14.8%
                </span>
              </div>
              <div>
                <span className="block font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  Zonas Estratégicas
                </span>
                <span className="mt-0.5 block font-['Outfit'] text-lg font-bold text-[#755a34]">
                  5 Corredores
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Showcase del Logo Oficial Project Atlas */}
          <div className="flex flex-col items-center justify-center border-t border-[#eaedf0] bg-gradient-to-br from-[#f8f9fa] via-white to-[#eef6fc] p-8 lg:col-span-5 lg:border-l lg:border-t-0">
            <div className="flex flex-col items-center rounded-2xl border border-[#eaedf0] bg-white p-8 shadow-[0_8px_30px_rgba(9,30,58,0.06)]">
              <AtlasBrandLogo
                variant="full"
                theme="light"
                className="h-48 w-auto sm:h-56"
              />
              <div className="mt-4 flex items-center gap-2 rounded-full bg-[#f2f4f6] px-3.5 py-1 text-[11px] font-medium text-[#091e3a]">
                <span className="material-symbols-outlined text-[15px] text-[#0077cc]">
                  verified
                </span>
                Identidad Oficial · Proyecto Atlas Real Estate Platform
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECCIÓN DE LIDERAZGO & VISIÓN EJECUTIVA — CEO ANDRE FRAGA */}
      <section className="overflow-hidden rounded-2xl border border-[#eaedf0] bg-[#091e3a] text-white shadow-[0_4px_20px_rgba(9,30,58,0.12)]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Fotografía Oficial de Andre Fraga */}
          <div className="relative min-h-[360px] bg-[#061529] lg:col-span-5">
            <img
              src="/andre-fraga-ceo.jpg"
              alt="Andre Fraga — CEO de Proyecto Atlas"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#091e3a] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#091e3a]/90" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/15 bg-black/65 px-4 py-3 backdrop-blur-md">
              <div>
                <div className="font-['Outfit'] text-sm font-bold text-white">
                  Andre Fraga
                </div>
                <div className="font-['Outfit'] text-[11px] font-medium uppercase tracking-widest text-[#00c2ff]">
                  CEO & Founder · Proyecto Atlas
                </div>
              </div>
              <AtlasBrandLogo
                variant="icon"
                theme="dark"
                className="h-9 w-auto"
              />
            </div>
          </div>

          {/* Mensaje y Visión del CEO */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-7">
            <div className="inline-flex items-center gap-2 self-start rounded-md bg-white/10 px-3 py-1 font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00c2ff]">
              DIRECCIÓN GENERAL & VISIÓN PATRIMONIAL
            </div>

            <h2 className="mt-3 font-['Outfit'] text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Andre Fraga — CEO de Proyecto Atlas
            </h2>

            <blockquote className="mt-4 border-l-2 border-[#00b4f5] pl-4 text-sm leading-relaxed text-neutral-200 sm:text-base">
              “Construimos <strong>Proyecto Atlas</strong> con un propósito claro: transformar la manera en que los brokers profesionales, agencias y family offices analizan, presentan y cierran inversiones inmobiliarias de alto nivel. En lugar de herramientas dispersas, entregamos una plataforma donde cada desarrollo tiene auditoría documental en tiempo real, proyecciones financieras transparentes y certeza jurídica total.”
            </blockquote>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#00c2ff]">
                  Certeza Documental
                </span>
                <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                  Acceso directo y auditado a Google Drives oficiales, listas de precios y fideicomisos.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#00c2ff]">
                  Precisión Financiera
                </span>
                <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                  Métricas claras de ROI anual, Cap Rate neto, plusvalía a 5 años y comparador técnico.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-[#00c2ff]">
                  Ejecución Comercial
                </span>
                <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                  CRM de 6 fases, generador de Dossiers PDF en un clic y asistencia legal con Atlas Copilot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ¿DE QUÉ TRATA PROYECTO ATLAS? — LOS 4 PILARES DE LA PLATAFORMA */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0077cc]">
              ARQUITECTURA FUNCIONAL
            </span>
            <h2 className="mt-1 font-['Outfit'] text-2xl font-bold text-[#091e3a]">
              ¿De qué trata Proyecto Atlas y cómo potencia tu operación?
            </h2>
          </div>
          <p className="text-xs text-neutral-500">
            Haz clic en cualquier módulo para abrir la herramienta correspondiente
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PLATFORM_PILLARS.map((pillar) => (
            <div
              key={pillar.number}
              className="flex flex-col justify-between rounded-2xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#0077cc]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#091e3a] px-2.5 py-1 font-['Outfit'] text-xs font-bold text-[#00c2ff]">
                    <span className="material-symbols-outlined text-[15px]">
                      {pillar.icon}
                    </span>
                    PILAR {pillar.number}
                  </span>
                  <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Módulo Activo
                  </span>
                </div>

                <h3 className="mt-4 font-['Outfit'] text-lg font-bold text-[#091e3a]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-5 border-t border-[#eaedf0] pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate(pillar.target)}
                  className="inline-flex items-center gap-1.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-[#0077cc] hover:text-[#091e3a]"
                >
                  {pillar.actionLabel}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DESARROLLOS DESTACADOS EN PROYECTO ATLAS */}
      <section className="rounded-2xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eaedf0] pb-4 sm:flex-row sm:items-center">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
              PORTAFOLIO CURADO EN VIVO
            </span>
            <h3 className="mt-0.5 font-['Outfit'] text-lg font-bold text-[#091e3a]">
              Vista Rápida de Propiedades Insignia en Proyecto Atlas
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("inventory")}
            className="self-start rounded-lg bg-[#091e3a] px-4 py-2 font-['Outfit'] text-xs font-semibold text-white hover:bg-[#0077cc]"
          >
            Ver Todo el Inventario ({properties.length}) →
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {properties.slice(0, 3).map((prop) => {
            const imgUrl = prop.customImageUrl ?? prop.defaultImageUrl;
            return (
              <div
                key={prop.id}
                className="group overflow-hidden rounded-xl border border-[#eaedf0] bg-[#f8f9fa] transition hover:border-[#091e3a]"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={prop.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded bg-[#091e3a]/90 px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white">
                    {prop.zone}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-['Outfit'] text-base font-bold text-[#091e3a]">
                    {prop.name}
                  </h4>
                  <p className="mt-1 line-clamp-1 text-xs text-neutral-500">
                    {prop.subtitle}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-[#eaedf0] pt-3">
                    <span className="font-['Outfit'] text-sm font-bold text-black">
                      {formatSovereignCurrency(prop.priceUsd, currency, true)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenDossier(prop)}
                      className="font-['Outfit'] text-xs font-semibold text-[#0077cc] hover:underline"
                    >
                      Abrir Dossier PDF ↗
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
