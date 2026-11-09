import React, { useState } from "react";
import {
  BrokerAgentMember,
  CurrencyCode,
  DriveAuditItem,
  MarketplaceProviderItem,
  MarketplaceReferralRecord,
  MarketplaceServiceCategory,
  MembershipTier,
  SecurityAuditEvent,
  WhiteLabelConfig,
} from "../types";
import {
  formatSovereignCurrency,
  sanitizeSovereignInput,
  usePersistentState,
} from "../storage/useAureaStorage";

/* ============================================================================
 * H. SUITE CORPORATIVA PARA AGENCIAS INMOBILIARIAS & DIRECTORIO
 * ========================================================================== */

interface AgencySuiteViewProps {
  brokers: BrokerAgentMember[];
  currency: CurrencyCode;
  whiteLabel: WhiteLabelConfig;
  onUpdateWhiteLabel: (next: WhiteLabelConfig) => void;
  onAssignRoundRobinLead: () => void;
  roundRobinPointer: number;
}

export const AgencySuiteView: React.FC<AgencySuiteViewProps> = ({
  brokers,
  currency,
  whiteLabel,
  onUpdateWhiteLabel,
  onAssignRoundRobinLead,
  roundRobinPointer,
}) => {
  const [sampleDealUsd, setSampleDealUsd] = useState<number>(4920000);
  const [grossCommissionPct, setGrossCommissionPct] = useState<number>(5.5);

  const totalGrossCommissionUsd = sampleDealUsd * (grossCommissionPct / 100);
  const brokerShareUsd =
    totalGrossCommissionUsd * (whiteLabel.brokerSplitPct / 100);
  const agencyShareUsd =
    totalGrossCommissionUsd * (whiteLabel.agencySplitPct / 100);

  const nextBrokerInQueue = brokers[roundRobinPointer % brokers.length];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            MÓDULO H · GOBERNANZA MULTI-BROKER & MARCA BLANCA
          </span>
          <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-black">
            Suite Corporativa para Agencias Inmobiliarias
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Asignación inteligente de prospectos mediante algoritmo Round-Robin, split de comisiones y personalización White-Label.
          </p>
        </div>

        <button
          type="button"
          onClick={onAssignRoundRobinLead}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#755a34]"
        >
          <span className="material-symbols-outlined text-[16px] text-[#faeedd]">
            autorenew
          </span>
          Simular Asignación Round-Robin
        </button>
      </div>

      {/* Estado de Cola Round-Robin y Equipo de Brokers */}
      <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="mb-4 flex flex-col justify-between gap-2 border-b border-[#eaedf0] pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-['Outfit'] text-base font-semibold text-black">
              Mesa de Brokers Patrimoniales & Algoritmo Round-Robin
            </h2>
            <p className="text-xs text-neutral-500">
              Siguiente asesor en turno automático:{" "}
              <strong className="text-[#755a34]">
                {nextBrokerInQueue?.name} ({nextBrokerInQueue?.specialtyZone})
              </strong>
            </p>
          </div>
          <span className="rounded-full bg-[#004044]/10 px-3 py-1 font-['Outfit'] text-xs font-semibold text-[#004044]">
            Balanceo Equitativo Activo
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {brokers.map((brk, index) => {
            const isNext = index === roundRobinPointer % brokers.length;
            return (
              <div
                key={brk.id}
                className={`rounded-xl border p-5 transition ${
                  isNext
                    ? "border-[#755a34] bg-[#faeedd]/30"
                    : "border-[#eaedf0] bg-[#f8f9fa]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-['Outfit'] text-xs font-bold text-[#faeedd]">
                      {brk.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-['Outfit'] text-sm font-semibold text-black">
                        {brk.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500">{brk.role}</p>
                    </div>
                  </div>
                  {isNext && (
                    <span className="rounded bg-[#755a34] px-2 py-0.5 font-['Outfit'] text-[10px] font-semibold uppercase text-white">
                      En Turno
                    </span>
                  )}
                </div>

                <div className="mt-4 space-y-1.5 border-t border-[#eaedf0] pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Zona Especialidad:</span>
                    <span className="font-medium text-black">
                      {brk.specialtyZone}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Leads Asignados:</span>
                    <span className="font-['Outfit'] font-bold text-black">
                      {brk.activeLeadsCount} expedientes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Volumen Cerrado:</span>
                    <span className="font-['Outfit'] font-semibold text-[#004044]">
                      {formatSovereignCurrency(
                        brk.closedVolumeUsd,
                        currency,
                        true
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split de Comisiones y Configuración Marca Blanca */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Split de Comisiones */}
        <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            TESORERÍA DE COMISIONES
          </span>
          <h3 className="mt-1 font-['Outfit'] text-lg font-semibold text-black">
            Simulador de Split Agencia vs. Asesor
          </h3>

          <div className="mt-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">Valor de Cierre:</span>
                <span className="font-['Outfit'] font-semibold text-black">
                  {formatSovereignCurrency(sampleDealUsd, currency)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={10000000}
                step={100000}
                value={sampleDealUsd}
                onChange={(e) => setSampleDealUsd(Number(e.target.value))}
                className="mt-1.5 w-full accent-black"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">
                  Comisión Total Desarrollador ({grossCommissionPct}%):
                </span>
                <span className="font-['Outfit'] font-semibold text-[#755a34]">
                  {formatSovereignCurrency(totalGrossCommissionUsd, currency)}
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={7}
                step={0.5}
                value={grossCommissionPct}
                onChange={(e) => setGrossCommissionPct(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#755a34]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">
                  Split para el Broker ({whiteLabel.brokerSplitPct}%) / Agencia ({whiteLabel.agencySplitPct}%)
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={85}
                step={5}
                value={whiteLabel.brokerSplitPct}
                onChange={(e) => {
                  const brokerPct = Number(e.target.value);
                  onUpdateWhiteLabel({
                    ...whiteLabel,
                    brokerSplitPct: brokerPct,
                    agencySplitPct: 100 - brokerPct,
                  });
                }}
                className="mt-1.5 w-full accent-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg bg-[#1c1b1a] p-4 text-white">
                <span className="font-['Outfit'] text-[10px] uppercase text-neutral-400">
                  Pago Neto Broker ({whiteLabel.brokerSplitPct}%)
                </span>
                <p className="mt-1 font-['Outfit'] text-base font-bold text-[#faeedd]">
                  {formatSovereignCurrency(brokerShareUsd, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-[#eaedf0] bg-[#f8f9fa] p-4">
                <span className="font-['Outfit'] text-[10px] uppercase text-neutral-500">
                  Retención Casa Matriz ({whiteLabel.agencySplitPct}%)
                </span>
                <p className="mt-1 font-['Outfit'] text-base font-bold text-black">
                  {formatSovereignCurrency(agencyShareUsd, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personalización Marca Blanca */}
        <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            WHITE-LABEL INSTITUTIONAL SUITE
          </span>
          <h3 className="mt-1 font-['Outfit'] text-lg font-semibold text-black">
            Identidad de Marca Blanca (Sidebar & Dossiers)
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Personaliza el monograma y firma institucional que aparece en la barra lateral y en las fichas exportables.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label className="block font-['Outfit'] text-xs font-medium text-neutral-700">
                Nombre o Monograma Principal
              </label>
              <input
                type="text"
                value={whiteLabel.agencyName}
                onChange={(e) =>
                  onUpdateWhiteLabel({
                    ...whiteLabel,
                    agencyName: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-['Outfit'] text-xs font-semibold text-black"
              />
            </div>

            <div>
              <label className="block font-['Outfit'] text-xs font-medium text-neutral-700">
                Subtítulo Patrimonial
              </label>
              <input
                type="text"
                value={whiteLabel.subtitle}
                onChange={(e) =>
                  onUpdateWhiteLabel({
                    ...whiteLabel,
                    subtitle: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-3 py-2 font-['Outfit'] text-xs text-black"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  onUpdateWhiteLabel({
                    agencyName: "PROYECTO ATLAS",
                    monogram: "PA",
                    subtitle: "REAL ESTATE PLATFORM",
                    agencySplitPct: 40,
                    brokerSplitPct: 60,
                  })
                }
                className="rounded-lg border border-[#eaedf0] bg-[#f2f4f6] px-3.5 py-2 font-['Outfit'] text-xs font-medium text-neutral-700 hover:border-black hover:text-black"
              >
                Restaurar Identidad Original Proyecto Atlas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * MÓDULO 03 · MARKETPLACE DE SERVICIOS INMOBILIARIOS (AÑO 3 & AÑO 5)
 * Directorio y contratación de: Notarías, Brokers hipotecarios, Aseguradoras,
 * Avalúos, Arquitectos, Interiorismo, Mudanzas y Administración de rentas.
 * Incluye calificaciones verificadas y comisiones por referencia.
 * ========================================================================== */

const MARKETPLACE_CATEGORIES: MarketplaceServiceCategory[] = [
  "Notarías",
  "Brokers hipotecarios",
  "Aseguradoras",
  "Avalúos",
  "Arquitectos",
  "Interiorismo",
  "Mudanzas",
  "Administración de rentas",
];

const MARKETPLACE_PROVIDERS: MarketplaceProviderItem[] = [
  {
    id: "mp-notaria-62",
    category: "Notarías",
    name: "Notaría Pública No. 62 · Cancún & Riviera Maya",
    leadPartner: "Lic. Rodrigo Castellanos · Notario Titular",
    corridor: "Cancún · Puerto Cancún · Playa del Carmen",
    specialty:
      "Escrituración de preventas, Fideicomisos en Zona Restringida (SRE), poder notarial internacional y protocolo NOM-247.",
    rating: 4.96,
    reviewsCount: 184,
    referralCommissionPct: 12,
    averageServiceFeeUsd: 4800,
    slaResponse: "Respuesta en < 2 hrs",
    tier: "Partner Destacado",
    phone: "+52 (998) 884 9102",
    deliverables: [
      "Proyecto de Escritura / Fideicomiso SRE",
      "Certificado de Libertad de Gravamen",
      "Cálculo de ISAI e ISR Notarial",
    ],
  },
  {
    id: "mp-hipotecario-01",
    category: "Brokers hipotecarios",
    name: "Sovereign Capital Mortgage · Crédito Patrimonial & Cross-Border",
    leadPartner: "Mtro. Adrián Mercader · Director Hipotecario",
    corridor: "Nacional & Compradores USA / Canadá",
    specialty:
      "Créditos de liquidez, hipotecas en USD para extranjeros en playa y financiamiento puente para preventas.",
    rating: 4.92,
    reviewsCount: 146,
    referralCommissionPct: 20,
    averageServiceFeeUsd: 6200,
    slaResponse: "Pre-aprobación en 24 hrs",
    tier: "Partner Destacado",
    phone: "+52 (998) 210 4400",
    deliverables: [
      "Pre-calificación Bancaria Multi-Institución",
      "Estructuración de Crédito en USD/MXN",
      "Acompañamiento hasta Firma y Dispersión",
    ],
  },
  {
    id: "mp-aseguradora-01",
    category: "Aseguradoras",
    name: "Atlas Coastal Shield · Seguros de Propiedad & Huracanes",
    leadPartner: "Ing. Valeria Montes · Suscripción Patrimonial",
    corridor: "Caribe Mexicano & Nivel Nacional",
    specialty:
      "Pólizas todo riesgo hidrometeorológico (frente al mar y laguna), responsabilidad civil para rentas vacacionales y seguro de título.",
    rating: 4.89,
    reviewsCount: 112,
    referralCommissionPct: 15,
    averageServiceFeeUsd: 2900,
    slaResponse: "Cotización en 30 min",
    tier: "Proveedor Certificado",
    phone: "+52 (998) 315 7710",
    deliverables: [
      "Póliza Todo Riesgo Hidrometeorológico",
      "Seguro de Título de Propiedad (Title Insurance)",
      "Cobertura de Contenidos y Renta Perdida",
    ],
  },
  {
    id: "mp-avaluos-01",
    category: "Avalúos",
    name: "Valuación RICS & Peritos Certificados del Sureste",
    leadPartner: "Arq. Perito Hernán Solís · MRICS / INDAABIN",
    corridor: "Cancún · Huayacán · Riviera Maya",
    specialty:
      "Avalúos comerciales, bancarios, catastrales y fiscales (para deducción de mejoras en ISR por enajenación).",
    rating: 4.94,
    reviewsCount: 98,
    referralCommissionPct: 14,
    averageServiceFeeUsd: 1650,
    slaResponse: "Dictamen en 48 hrs",
    tier: "Proveedor Certificado",
    phone: "+52 (998) 412 3309",
    deliverables: [
      "Avalúo Comercial Homologado",
      "Avalúo de Mejoras para Efectos Fiscales",
      "Estudio de Valor de Mercado y Absorción",
    ],
  },
  {
    id: "mp-arquitectos-01",
    category: "Arquitectos",
    name: "Taller de Arquitectura Costera & Adecuaciones Custom",
    leadPartner: "Arq. Mateo Villarreal · Socio Director",
    corridor: "Laguna Nichupté · Puerto Cancún · Huayacán",
    specialty:
      "Personalización de penthouses, integración de domótica KNX, pérgolas bioclimáticas, albercas en rooftop y muelles.",
    rating: 4.95,
    reviewsCount: 74,
    referralCommissionPct: 10,
    averageServiceFeeUsd: 14500,
    slaResponse: "Anteproyecto en 5 días",
    tier: "Partner Destacado",
    phone: "+52 (998) 501 2290",
    deliverables: [
      "Proyecto Ejecutivo de Adecuación",
      "Renders Fotorealistas de Personalización",
      "Supervisión Técnica de Obra",
    ],
  },
  {
    id: "mp-interiorismo-01",
    category: "Interiorismo",
    name: "Casa Naúma & Atelier Turnkey Interior Design",
    leadPartner: "Dis. Camila Arámburu · Directora Creativa",
    corridor: "Nautica Residences · The Villas · Prana Towers",
    specialty:
      "Paquetes de amueblado llave en mano (Turnkey) en parota, travertino y lino orgánico optimizados para maximizar tarifa por noche (ADR).",
    rating: 4.98,
    reviewsCount: 163,
    referralCommissionPct: 12,
    averageServiceFeeUsd: 22000,
    slaResponse: "Propuesta en 24 hrs",
    tier: "Partner Destacado",
    phone: "+52 (998) 892 1400",
    deliverables: [
      "Paquete de Mobiliario y Equipamiento Turnkey",
      "Curaduría de Arte, Iluminación y Blancos",
      "Instalación Completa Lista para Habitar o Rentar",
    ],
  },
  {
    id: "mp-mudanzas-01",
    category: "Mudanzas",
    name: "White-Glove Relocation & Fine Art Logistics",
    leadPartner: "Lic. Esteban Cárdenas · Operaciones Internacionales",
    corridor: "CDMX · Monterrey · EE. UU. → Caribe Mexicano",
    specialty:
      "Mudanzas residenciales de guante blanco, traslado climatizado de obras de arte, importación de menaje de casa y vehículos.",
    rating: 4.88,
    reviewsCount: 89,
    referralCommissionPct: 10,
    averageServiceFeeUsd: 4200,
    slaResponse: "Inspección en 12 hrs",
    tier: "Proveedor Certificado",
    phone: "+52 (55) 5280 9910",
    deliverables: [
      "Embalaje de Guante Blanco y Seguro Total",
      "Despacho Aduanal de Menaje para Extranjeros",
      "Desempaque y Montaje en el Desarrollo",
    ],
  },
  {
    id: "mp-rentas-01",
    category: "Administración de rentas",
    name: "Sovereign Hospitality & Vacation Rental Management",
    leadPartner: "Lic. Sofía Alarcón · Directora de Revenue",
    corridor: "Zona Hotelera · Laguna Nichupté · Playa del Carmen",
    specialty:
      "Operación integral de rentas vacacionales y estancias largas con pricing dinámico, concierge 24/7, mantenimiento preventivo y reporte mensual.",
    rating: 4.97,
    reviewsCount: 215,
    referralCommissionPct: 18,
    averageServiceFeeUsd: 5400,
    slaResponse: "Onboarding en 24 hrs",
    tier: "Partner Destacado",
    phone: "+52 (998) 688 4500",
    deliverables: [
      "Revenue Management Dinámico (Airbnb Luxe, Marriott Homes, Directo)",
      "Mantenimiento Preventivo y Concierge al Huésped",
      "Estado de Cuenta Mensual y Liquidación Fiscal",
    ],
  },
];

const INITIAL_REFERRAL_RECORDS: MarketplaceReferralRecord[] = [
  {
    id: "ref-101",
    providerId: "mp-interiorismo-01",
    providerName: "Casa Naúma & Atelier Turnkey Interior Design",
    category: "Interiorismo",
    clientName: "Alejandro Vega · Family Office Monterrey",
    propertyName: "Nautica Residences (Unidad T1-1501)",
    estimatedServiceUsd: 22000,
    referralCommissionUsd: 2640,
    status: "Comisión Liquidada",
    createdAtLabel: "Hace 2 días",
  },
  {
    id: "ref-102",
    providerId: "mp-notaria-62",
    providerName: "Notaría Pública No. 62 · Cancún & Riviera Maya",
    category: "Notarías",
    clientName: "Marcus Vance · Vance Capital LLC",
    propertyName: "The Villas Collection (Villa Elara)",
    estimatedServiceUsd: 4800,
    referralCommissionUsd: 576,
    status: "En Proceso",
    createdAtLabel: "Hoy · 11:30 HRS",
  },
];

interface DirectoryViewProps {
  currency?: CurrencyCode;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  currency = "USD",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    MarketplaceServiceCategory | "TODAS"
  >("TODAS");
  const [referrals, setReferrals] = usePersistentState<
    MarketplaceReferralRecord[]
  >("proyecto_atlas_marketplace_referrals_v3", INITIAL_REFERRAL_RECORDS);
  const [clientNameInput, setClientNameInput] = useState(
    "Inversionista Patrimonial · Cierre Activo"
  );
  const [propertyNameInput, setPropertyNameInput] = useState(
    "Nautica Residences by Naúma"
  );
  const [lastBookedBanner, setLastBookedBanner] = useState<string | null>(null);

  const filteredProviders =
    selectedCategory === "TODAS"
      ? MARKETPLACE_PROVIDERS
      : MARKETPLACE_PROVIDERS.filter((p) => p.category === selectedCategory);

  const totalReferralCommissionUsd = referrals.reduce(
    (acc, r) => acc + r.referralCommissionUsd,
    0
  );

  const handleCreateReferral = (provider: MarketplaceProviderItem) => {
    const commissionUsd = Math.round(
      provider.averageServiceFeeUsd * (provider.referralCommissionPct / 100)
    );
    const nextRecord: MarketplaceReferralRecord = {
      id: `ref-${Date.now()}`,
      providerId: provider.id,
      providerName: provider.name,
      category: provider.category,
      clientName: clientNameInput.trim() || "Cliente Patrimonial",
      propertyName: propertyNameInput.trim() || "Nautica Residences by Naúma",
      estimatedServiceUsd: provider.averageServiceFeeUsd,
      referralCommissionUsd: commissionUsd,
      status: "Cotizado",
      createdAtLabel: "Justo ahora",
    };
    setReferrals((prev) => [nextRecord, ...prev]);
    setLastBookedBanner(
      `Referencia registrada con ${provider.name} (${provider.category}). Comisión por referencia proyectada: ${formatSovereignCurrency(commissionUsd, currency)}.`
    );
    setTimeout(() => setLastBookedBanner(null), 4500);
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Cabecera del Marketplace (Módulo 03 / Año 3 & Año 5) */}
      <div className="border border-[#091e3a] bg-[#091e3a] p-7 text-white">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.26em] text-[#00b4f5]">
              MÓDULO 03 · MARKETPLACE DE SERVICIOS INMOBILIARIOS (AÑO 3 &amp; AÑO 5)
            </span>
            <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight sm:text-3xl">
              Marketplace de Proveedores Certificados &amp; Comisiones por Referencia
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Conecta a compradores y asesores con proveedores verificados en las 8 categorías clave del ecosistema inmobiliario. Modelo de ingresos integrado: suscripciones, comisiones por referencia, publicidad destacada y servicios premium.
            </p>
          </div>

          <div className="border border-white/20 bg-white/10 px-5 py-3">
            <span className="block font-['Outfit'] text-[9px] uppercase tracking-[0.2em] text-[#faeedd]">
              COMISIONES POR REFERENCIA GENERADAS
            </span>
            <span className="mt-0.5 block font-['Outfit'] text-xl font-bold text-white">
              {formatSovereignCurrency(totalReferralCommissionUsd, currency)}
            </span>
            <span className="text-[11px] text-slate-300">
              {referrals.length} servicios contratados / referidos
            </span>
          </div>
        </div>

        {/* 4 Fuentes del Modelo de Ingresos del Marketplace */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 sm:grid-cols-4">
          {[
            {
              label: "1. Suscripciones",
              desc: "Membresía mensual de proveedores certificados en las 8 verticales.",
            },
            {
              label: "2. Comisiones por Referencia",
              desc: "Fee del 10% al 20% por cada servicio contratado desde la plataforma.",
            },
            {
              label: "3. Publicidad Destacada",
              desc: "Posicionamiento preferente como Partner Destacado por corredor.",
            },
            {
              label: "4. Servicios Premium",
              desc: "Paquetes llave en mano (Turnkey), concierge legal y fast-track notarial.",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="border border-white/10 bg-white/5 p-3 text-xs"
            >
              <div className="font-['Outfit'] font-semibold text-[#00b4f5]">
                {m.label}
              </div>
              <p className="mt-1 text-[11px] text-slate-300">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtro Interactivo por las 8 Categorías Oficiales del Plan Estratégico */}
      <div className="border border-[#e2e6ec] bg-white p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-[#eaedf0] pb-4 sm:flex-row sm:items-center">
          <div>
            <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
              8 VERTICALES DEL MARKETPLACE
            </span>
            <h2 className="font-['Outfit'] text-base font-semibold text-[#091e3a]">
              Filtrar Directorio y Contratación por Especialidad
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <input
              type="text"
              value={clientNameInput}
              onChange={(e) => setClientNameInput(e.target.value)}
              placeholder="Cliente a referir..."
              className="border border-[#eaedf0] bg-[#f8f9fa] px-3 py-1.5 text-xs text-black"
            />
            <input
              type="text"
              value={propertyNameInput}
              onChange={(e) => setPropertyNameInput(e.target.value)}
              placeholder="Desarrollo / Unidad..."
              className="border border-[#eaedf0] bg-[#f8f9fa] px-3 py-1.5 text-xs text-black"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory("TODAS")}
            className={`px-3.5 py-2 font-['Outfit'] text-xs font-semibold uppercase tracking-wider transition ${
              selectedCategory === "TODAS"
                ? "bg-[#091e3a] text-white"
                : "border border-[#eaedf0] bg-[#f8f9fa] text-neutral-600 hover:border-[#091e3a]"
            }`}
          >
            Todas las Categorías ({MARKETPLACE_PROVIDERS.length})
          </button>
          {MARKETPLACE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 font-['Outfit'] text-xs font-semibold uppercase tracking-wider transition ${
                  active
                    ? "bg-[#091e3a] text-white"
                    : "border border-[#eaedf0] bg-[#f8f9fa] text-neutral-600 hover:border-[#091e3a]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {lastBookedBanner && (
        <div className="border-l-4 border-emerald-600 bg-emerald-50 p-4 text-xs font-medium text-emerald-900">
          {lastBookedBanner}
        </div>
      )}

      {/* Tarjetas de Proveedores Certificados */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filteredProviders.map((provider) => {
          const estimatedCommissionUsd = Math.round(
            provider.averageServiceFeeUsd *
              (provider.referralCommissionPct / 100)
          );
          return (
            <div
              key={provider.id}
              className="flex flex-col justify-between border border-[#e2e6ec] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition hover:border-[#091e3a]"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eaedf0] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#091e3a] px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-white">
                      {provider.category}
                    </span>
                    <span className="border border-[#755a34]/40 bg-[#faeedd] px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
                      {provider.tier}
                    </span>
                  </div>

                  <div className="font-['Outfit'] text-xs font-bold text-[#091e3a]">
                    Calificación: {provider.rating.toFixed(2)} / 5.0 (
                    {provider.reviewsCount} reseñas)
                  </div>
                </div>

                <h3 className="mt-3 font-['Outfit'] text-lg font-semibold text-[#091e3a]">
                  {provider.name}
                </h3>
                <p className="text-xs font-medium text-neutral-700">
                  {provider.leadPartner} · {provider.corridor}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                  {provider.specialty}
                </p>

                {/* Entregables */}
                <div className="mt-3 border-t border-[#eaedf0] pt-3">
                  <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    ALCANCE DEL SERVICIO CERTIFICADO:
                  </span>
                  <ul className="mt-1.5 space-y-1 text-xs text-neutral-600">
                    {provider.deliverables.map((deliv) => (
                      <li key={deliv} className="flex items-start gap-1.5">
                        <span className="text-[#0077cc]">▪</span>
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pie con Comisión por Referencia y Botón de Contratación */}
              <div className="mt-5 border-t border-[#eaedf0] bg-[#f8f9fa] p-4">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-neutral-400">
                      Ticket Promedio
                    </span>
                    <strong className="font-['Outfit'] text-[#091e3a]">
                      {formatSovereignCurrency(
                        provider.averageServiceFeeUsd,
                        currency
                      )}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-400">
                      Comisión Referencia
                    </span>
                    <strong className="font-['Outfit'] text-[#755a34]">
                      {provider.referralCommissionPct}% (
                      {formatSovereignCurrency(
                        estimatedCommissionUsd,
                        currency
                      )}
                      )
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-400">
                      SLA de Atención
                    </span>
                    <strong className="font-['Outfit'] text-[#004044]">
                      {provider.slaResponse}
                    </strong>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 pt-2">
                  <span className="font-mono text-[11px] text-neutral-500">
                    {provider.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCreateReferral(provider)}
                    className="bg-[#091e3a] px-4 py-2 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
                  >
                    Contratar / Referir y Generar Comisión →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bitácora de Contrataciones y Comisiones por Referencia */}
      <div className="border border-[#e2e6ec] bg-white p-6">
        <h3 className="font-['Outfit'] text-base font-semibold text-[#091e3a]">
          Bitácora de Servicios Contratados &amp; Comisiones por Referencia
        </h3>
        <p className="text-xs text-neutral-500">
          Trazabilidad de referencias enviadas a proveedores del Marketplace y liquidación de fees.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eaedf0] bg-[#f8f9fa] font-['Outfit'] text-[10px] uppercase tracking-wider text-neutral-500">
                <th className="p-3">Categoría</th>
                <th className="p-3">Proveedor Certificado</th>
                <th className="p-3">Cliente &amp; Desarrollo</th>
                <th className="p-3">Monto Servicio</th>
                <th className="p-3">Comisión por Referencia</th>
                <th className="p-3">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedf0]">
              {referrals.map((ref) => (
                <tr key={ref.id}>
                  <td className="p-3 font-['Outfit'] font-semibold text-[#755a34]">
                    {ref.category}
                  </td>
                  <td className="p-3 font-medium text-[#091e3a]">
                    {ref.providerName}
                  </td>
                  <td className="p-3 text-neutral-600">
                    <div>{ref.clientName}</div>
                    <div className="text-[11px] text-neutral-400">
                      {ref.propertyName} · {ref.createdAtLabel}
                    </div>
                  </td>
                  <td className="p-3 font-['Outfit'] text-neutral-700">
                    {formatSovereignCurrency(ref.estimatedServiceUsd, currency)}
                  </td>
                  <td className="p-3 font-['Outfit'] font-bold text-[#004044]">
                    {formatSovereignCurrency(
                      ref.referralCommissionUsd,
                      currency
                    )}
                  </td>
                  <td className="p-3">
                    <span className="border border-[#091e3a]/20 bg-[#f8f9fa] px-2.5 py-1 font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#091e3a]">
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * I. BÓVEDA DE SEGURIDAD & CIFRADO (SECURITY SHIELD)
 * ========================================================================== */

interface SecurityVaultViewProps {
  membershipTier: MembershipTier;
  onChangeMembershipTier: (tier: MembershipTier) => void;
  securityLogs: SecurityAuditEvent[];
  onRecordSecurityEvent: (
    category: SecurityAuditEvent["category"],
    severity: SecurityAuditEvent["severity"],
    description: string
  ) => void;
}

export const SecurityVaultView: React.FC<SecurityVaultViewProps> = ({
  membershipTier,
  onChangeMembershipTier,
  securityLogs,
  onRecordSecurityEvent,
}) => {
  const [rateLimitCounter, setRateLimitCounter] = useState<number>(0);
  const [rateLimitBlocked, setRateLimitBlocked] = useState<boolean>(false);
  const [sanitizerInput, setSanitizerInput] = useState<string>(
    '<script>alert("xss")</script> Oferta por Villa Canto del Agua'
  );
  const [sanitizedPreview, setSanitizedPreview] = useState<string>("");

  const handleSimulateBruteForce = () => {
    const nextCount = rateLimitCounter + 1;
    setRateLimitCounter(nextCount);
    if (nextCount >= 4) {
      setRateLimitBlocked(true);
      onRecordSecurityEvent(
        "RATE_LIMIT",
        "BLOQUEADO",
        `Escudo Rate-Limiting activado tras ${nextCount} ráfagas consecutivas. IP en enfriamiento preventivo.`
      );
    } else {
      onRecordSecurityEvent(
        "RATE_LIMIT",
        "PREVENTIVO",
        `Petición de alta frecuencia #${nextCount}/4 monitoreada por el limitador de caudal.`
      );
    }
  };

  const handleTestSanitizer = () => {
    const result = sanitizeSovereignInput(sanitizerInput);
    setSanitizedPreview(result.clean);
    onRecordSecurityEvent(
      "SANITIZACION_XSS",
      result.hadInjectionAttempt ? "BLOQUEADO" : "INFO",
      result.hadInjectionAttempt
        ? `Vector malicioso neutralizado y purgado: "${result.clean}"`
        : "Cadena verificada limpia de vectores XSS/SQLi."
    );
  };

  const handleSimulateHoneypotBot = () => {
    onRecordSecurityEvent(
      "HONEYPOT_SHIELD",
      "BLOQUEADO",
      "Bot automatizado rellenó el campo trampa invisible 'sovereign_bot_trap'. Solicitud descartada silenciosamente."
    );
  };

  const TIER_CARDS: {
    tier: MembershipTier;
    title: string;
    price: string;
    perks: string[];
  }[] = [
    {
      tier: "BASICA",
      title: "Membresía Básica",
      price: "Acceso Individual",
      perks: [
        "Consulta de Inventario Oficial y Fichas Técnicas",
        "Calculadora Financiera de Cap Rate",
        "Exportación de Dossier Estándar",
      ],
    },
    {
      tier: "PRO",
      title: "Membresía Pro Wealth",
      price: "Broker Senior Certificado",
      perks: [
        "CRM Pipeline de 6 Fases + WhatsApp VIP",
        "Atlas Copilot (IA Jurídica y Fiscal)",
        "Personalización de Fotografías y Selecciones Privadas",
      ],
    },
    {
      tier: "AGENCIA_CORPORATIVA",
      title: "Agencia Corporativa",
      price: "Family Office & Master Broker",
      perks: [
        "Algoritmo Round-Robin Multi-Broker y Split de Comisiones",
        "Personalización Marca Blanca (White-Label)",
        "Auditoría Automatizada de Google Drives y Bóveda Completa",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#eaedf0] bg-[#1c1b1a] p-6 text-white shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d9b88c]">
              MÓDULO I · BÓVEDA DE SEGURIDAD & CIFRADO (SECURITY SHIELD)
            </span>
            <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-white">
              Arquitectura Defensiva & Control de Membresías
            </h1>
            <p className="mt-1 text-xs text-neutral-300">
              Protección activa con Rate Limiting, Honeypot invisible anti-bots, sanitización profunda XSS y registro inmutable de auditoría.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 font-['Outfit'] text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Escudo Soberano Activo · 0 Brechas
          </span>
        </div>
      </div>

      {/* Simulador de Niveles de Membresía */}
      <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <h2 className="font-['Outfit'] text-base font-semibold text-black">
          Simulación de Cuentas por Nivel de Membresía
        </h2>
        <p className="text-xs text-neutral-500">
          Alterna en vivo el nivel de cuenta del asesor para verificar privilegios y píldora de estado en el Header superior.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {TIER_CARDS.map((card) => {
            const active = membershipTier === card.tier;
            return (
              <div
                key={card.tier}
                className={`flex flex-col justify-between rounded-xl border p-5 transition ${
                  active
                    ? "border-black bg-[#1c1b1a] text-white"
                    : "border-[#eaedf0] bg-[#f8f9fa] text-black"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#d9b88c]">
                      {card.price}
                    </span>
                    {active && (
                      <span className="rounded bg-[#755a34] px-2 py-0.5 font-['Outfit'] text-[10px] font-bold uppercase text-white">
                        Nivel Activo
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-['Outfit'] text-base font-semibold">
                    {card.title}
                  </h3>
                  <ul className="mt-3 space-y-1.5 text-xs">
                    {card.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-1.5">
                        <span className="text-[#755a34]">●</span>
                        <span
                          className={
                            active ? "text-neutral-300" : "text-neutral-600"
                          }
                        >
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onChangeMembershipTier(card.tier)}
                  className={`mt-5 w-full rounded-lg py-2 font-['Outfit'] text-xs font-semibold uppercase tracking-wider transition ${
                    active
                      ? "bg-[#faeedd] text-black"
                      : "bg-black text-white hover:bg-[#755a34]"
                  }`}
                >
                  {active ? "Sesión Activa en Este Plan" : "Activar Este Nivel"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Escudos Interactivos: Rate Limiting, Honeypot, Sanitización */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 1. Rate Limiting */}
        <div className="rounded-xl border border-[#eaedf0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
            DEFENSA 01 · ANTI-FUERZA BRUTA
          </span>
          <h3 className="mt-1 font-['Outfit'] text-sm font-semibold text-black">
            Rate Limiting Dinámico
          </h3>
          <p className="mt-1 text-xs text-neutral-600">
            Bloquea ráfagas de autenticación o peticiones repetitivas en menos de 10 segundos.
          </p>

          <div className="mt-4 rounded-lg bg-[#f8f9fa] p-3 text-xs">
            <div className="flex justify-between">
              <span>Ráfagas registradas:</span>
              <strong className="font-['Outfit']">{rateLimitCounter} / 4</strong>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Estado de Compuerta:</span>
              <strong
                className={
                  rateLimitBlocked ? "text-rose-600" : "text-emerald-700"
                }
              >
                {rateLimitBlocked
                  ? "BLOQUEO PREVENTIVO ACTIVO"
                  : "Tráfico Nominal"}
              </strong>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSimulateBruteForce}
              className="flex-1 rounded-lg bg-black px-3 py-2 font-['Outfit'] text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Disparar Ráfaga
            </button>
            {rateLimitBlocked && (
              <button
                type="button"
                onClick={() => {
                  setRateLimitCounter(0);
                  setRateLimitBlocked(false);
                }}
                className="rounded-lg border border-neutral-300 px-3 py-2 font-['Outfit'] text-xs font-medium text-neutral-700"
              >
                Liberar
              </button>
            )}
          </div>
        </div>

        {/* 2. Honeypot Invisible */}
        <div className="rounded-xl border border-[#eaedf0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
            DEFENSA 02 · ANTI-SCRAPING
          </span>
          <h3 className="mt-1 font-['Outfit'] text-sm font-semibold text-black">
            Trampa Honeypot Invisible
          </h3>
          <p className="mt-1 text-xs text-neutral-600">
            Campo señuelo oculto (`tabIndex=-1`, `aria-hidden`) activo en todos los formularios de prospectos.
          </p>

          <div className="mt-4 rounded-lg bg-[#f8f9fa] p-3 text-xs text-neutral-700">
            Los usuarios humanos jamás ven el campo; cualquier bot que lo rellene queda aislado en el Audit Log sin contaminar el CRM.
          </div>

          <button
            type="button"
            onClick={handleSimulateHoneypotBot}
            className="mt-4 w-full rounded-lg bg-[#004044] px-3 py-2 font-['Outfit'] text-xs font-semibold text-white hover:bg-[#002b2e]"
          >
            Simular Ataque de Bot en Honeypot
          </button>
        </div>

        {/* 3. Sanitización Profunda */}
        <div className="rounded-xl border border-[#eaedf0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          <span className="font-['Outfit'] text-[10px] font-semibold uppercase tracking-wider text-[#755a34]">
            DEFENSA 03 · PAYLOAD SANITIZER
          </span>
          <h3 className="mt-1 font-['Outfit'] text-sm font-semibold text-black">
            Sanitización contra Inyección XSS/SQL
          </h3>
          <input
            type="text"
            value={sanitizerInput}
            onChange={(e) => setSanitizerInput(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#eaedf0] bg-[#f8f9fa] px-2.5 py-1.5 font-mono text-[11px] text-black"
          />
          {sanitizedPreview && (
            <div className="mt-2 rounded bg-emerald-50 p-2 font-mono text-[11px] text-emerald-900">
              Resultado limpio: {sanitizedPreview}
            </div>
          )}
          <button
            type="button"
            onClick={handleTestSanitizer}
            className="mt-3 w-full rounded-lg bg-black px-3 py-2 font-['Outfit'] text-xs font-semibold text-white hover:bg-[#755a34]"
          >
            Probar Purgado de Código
          </button>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <h3 className="font-['Outfit'] text-base font-semibold text-black">
          Registro de Auditoría de Seguridad (Audit Log)
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eaedf0] font-['Outfit'] text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="pb-2.5 pr-4">Timestamp</th>
                <th className="pb-2.5 pr-4">Categoría</th>
                <th className="pb-2.5 pr-4">Severidad</th>
                <th className="pb-2.5 pr-4">Evento / Dictamen</th>
                <th className="pb-2.5">Origen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedf0]">
              {securityLogs.map((log) => (
                <tr key={log.id}>
                  <td className="py-3 pr-4 font-mono text-[11px] text-neutral-500">
                    {log.timestampIso}
                  </td>
                  <td className="py-3 pr-4 font-['Outfit'] font-semibold text-black">
                    {log.category}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-['Outfit'] text-[10px] font-bold uppercase ${
                        log.severity === "BLOQUEADO"
                          ? "bg-rose-100 text-rose-800"
                          : log.severity === "PREVENTIVO"
                          ? "bg-[#faeedd] text-[#755a34]"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-neutral-700">
                    {log.description}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-neutral-500">
                    {log.originIp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * J. AUDITORÍA SEMANAL AUTOMATIZADA DE GOOGLE DRIVES & BANNER DE PRIVACIDAD
 * ========================================================================== */

interface DriveAuditViewProps {
  audits: DriveAuditItem[];
  onRunDriveSync: () => void;
}

export const DriveAuditView: React.FC<DriveAuditViewProps> = ({
  audits,
  onRunDriveSync,
}) => {
  const [syncSuccessBanner, setSyncSuccessBanner] = useState(false);

  const handleTriggerAudit = () => {
    onRunDriveSync();
    setSyncSuccessBanner(true);
    setTimeout(() => setSyncSuccessBanner(false), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-['Outfit'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#755a34]">
            MÓDULO J · CUMPLIMIENTO DOCUMENTAL & DUE DILIGENCE
          </span>
          <h1 className="mt-1 font-['Outfit'] text-2xl font-semibold tracking-tight text-black">
            Auditoría Semanal Automatizada de Google Drives
          </h1>
          <p className="mt-1 text-xs text-neutral-600">
            Verificación institucional de listas de precios vigentes, planos arquitectónicos, carpetas fiduciarias y unidades disponibles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTriggerAudit}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 font-['Outfit'] text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#004044]"
        >
          <span className="material-symbols-outlined text-[16px] text-[#faeedd]">
            cloud_sync
          </span>
          Ejecutar Auditoría de Drives Ahora
        </button>
      </div>

      {syncSuccessBanner && (
        <div className="rounded-xl border border-[#004044]/30 bg-[#004044]/10 px-4 py-3 text-xs font-medium text-[#004044]">
          ✓ Sincronización completada: Todas las carpetas de Google Drive de desarrolladores han sido verificadas y selladas con hora actual.
        </div>
      )}

      <div className="rounded-xl border border-[#eaedf0] bg-white p-6 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#eaedf0] font-['Outfit'] text-[11px] uppercase tracking-wider text-neutral-500">
                <th className="pb-3 pr-4">Desarrollo</th>
                <th className="pb-3 pr-4">Zona</th>
                <th className="pb-3 pr-4">Última Verificación</th>
                <th className="pb-3 pr-4">Lista de Precios</th>
                <th className="pb-3 pr-4">Planos & Brochure</th>
                <th className="pb-3 pr-4">Carpeta Fideicomiso</th>
                <th className="pb-3 pr-4">Unidades</th>
                <th className="pb-3">Enlace Oficial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedf0]">
              {audits.map((item) => (
                <tr key={item.id}>
                  <td className="py-3.5 pr-4 font-['Outfit'] font-semibold text-black">
                    {item.developmentName}
                  </td>
                  <td className="py-3.5 pr-4 text-neutral-600">{item.zone}</td>
                  <td className="py-3.5 pr-4 font-mono text-[11px] text-neutral-500">
                    {item.lastVerifiedIso}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-block rounded px-2 py-0.5 font-['Outfit'] text-[10px] font-semibold uppercase ${
                        item.priceListStatus === "Vigente"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-[#faeedd] text-[#755a34]"
                      }`}
                    >
                      {item.priceListStatus}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-emerald-700">
                    {item.blueprintsComplete ? "Completos ✓" : "Pendiente"}
                  </td>
                  <td className="py-3.5 pr-4 text-emerald-700">
                    {item.fideicomisoDocsReady ? "Dictaminado ✓" : "Revisión"}
                  </td>
                  <td className="py-3.5 pr-4 font-['Outfit'] font-semibold text-black">
                    {item.verifiedUnitsCount} disp.
                  </td>
                  <td className="py-3.5">
                    <a
                      href={item.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-[#eaedf0] bg-[#f8f9fa] px-2.5 py-1 font-['Outfit'] text-[11px] font-semibold text-black hover:border-black"
                    >
                      Abrir Drive ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const CookiePrivacyBanner: React.FC = () => {
  const [consentState, setConsentState] = usePersistentState<
    "PENDING" | "ACCEPTED" | "ESSENTIAL_ONLY"
  >("proyecto_atlas_privacy_consent_v2", "PENDING");

  if (consentState !== "PENDING") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-5xl rounded-xl border border-[#0077cc]/40 bg-[#091e3a] p-4 text-white shadow-2xl lg:left-76">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 pr-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#0077cc] px-2 py-0.5 font-['Outfit'] text-[10px] font-bold uppercase tracking-wider text-white">
              CUMPLIMIENTO LFPDPPP & GDPR
            </span>
            <span className="font-['Outfit'] text-xs font-semibold text-white">
              Protocolo de Privacidad & Resguardo de Datos · Proyecto Atlas
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-neutral-300">
            Proyecto Atlas (Real Estate Platform) cifra localmente sus selecciones de inversión, fotos personalizadas y notas de clientes en{" "}
            <code className="text-[#00c2ff]">localStorage</code> bajo normativa de protección de datos personales.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setConsentState("ESSENTIAL_ONLY")}
            className="rounded-lg border border-white/20 px-3 py-2 font-['Outfit'] text-xs font-medium text-neutral-200 hover:bg-white/10"
          >
            Solo Esenciales
          </button>
          <button
            type="button"
            onClick={() => setConsentState("ACCEPTED")}
            className="rounded-lg bg-[#faeedd] px-4 py-2 font-['Outfit'] text-xs font-semibold text-black hover:bg-[#e5d4bc]"
          >
            Aceptar Bóveda & Cookies
          </button>
        </div>
      </div>
    </div>
  );
};
