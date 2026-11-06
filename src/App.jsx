import React, { useState } from "react";
import { MasterInventoryBento } from "./modules/inventory/components/MasterInventoryBento";
import { InventoryCrmService } from "./modules/crm/services/inventory-crm.service";
import { CrmPipelineBento } from "./modules/crm/components/CrmPipelineBento";
import { KanbanBoard } from "./modules/crm/components/KanbanBoard";
import { ValuationEngineBento } from "./modules/ai-engine/components/ValuationEngineBento";
import { MarketplaceEditorialBento } from "./modules/marketplace/components/MarketplaceEditorialBento";

const INITIAL_UNITS_DATASET = [
  {
    id: "11111111-2222-4333-8444-555555550101",
    unitNumber: "101",
    floorLevel: 1,
    status: "AVAILABLE",
    basePrice: 8450000,
    currentPrice: 8650000,
    pricePerM2: 91052.63,
    currency: "MXN",
    maintenanceFee: 6800,
    orientation: "SUR-PONIENTE · JARDÍN PRIVADO",
    isCorner: true,
    phase: { id: "a1111111-1111-4111-8111-111111111101", name: "TORRE PONIENTE (FASE I)" },
    typology: {
      id: "b1111111-1111-4111-8111-111111111101",
      code: "GARDEN-A1",
      name: "Garden House 1 Recámara",
      bedrooms: 1,
      bathrooms: 1.5,
      parkingSpots: 1,
      interiorAreaM2: 72.0,
      exteriorAreaM2: 23.0,
      totalAreaM2: 95.0,
    },
    activeDeals: [],
  },
  {
    id: "11111111-2222-4333-8444-555555550204",
    unitNumber: "204",
    floorLevel: 2,
    status: "AVAILABLE",
    basePrice: 12400000,
    currentPrice: 12780000,
    pricePerM2: 98307.69,
    currency: "MXN",
    maintenanceFee: 8900,
    orientation: "NORTE · VISTA ARBOLADA",
    isCorner: false,
    phase: { id: "a1111111-1111-4111-8111-111111111101", name: "TORRE PONIENTE (FASE I)" },
    typology: {
      id: "b1111111-1111-4111-8111-111111111102",
      code: "TIPO-B2",
      name: "Residencia 2 Recámaras + Estudio",
      bedrooms: 2,
      bathrooms: 2.5,
      parkingSpots: 2,
      interiorAreaM2: 114.0,
      exteriorAreaM2: 16.0,
      totalAreaM2: 130.0,
    },
    activeDeals: [
      {
        id: "d9b2d63d-a233-4123-847a-6630a8719001",
        stage: "NEGOTIATION",
        probability: 65,
        leadName: "Rodrigo Elizondo",
        leadId: "c9b2d63d-a233-4123-847a-6630a8719001",
      },
    ],
  },
  {
    id: "11111111-2222-4333-8444-555555550402",
    unitNumber: "402",
    floorLevel: 4,
    status: "RESERVED",
    basePrice: 13100000,
    currentPrice: 13520000,
    pricePerM2: 104000.0,
    currency: "MXN",
    maintenanceFee: 8900,
    orientation: "PONIENTE · PARQUE LINCOLN",
    isCorner: true,
    phase: { id: "a1111111-1111-4111-8111-111111111101", name: "TORRE PONIENTE (FASE I)" },
    typology: {
      id: "b1111111-1111-4111-8111-111111111102",
      code: "TIPO-B2",
      name: "Residencia 2 Recámaras + Estudio",
      bedrooms: 2,
      bathrooms: 2.5,
      parkingSpots: 2,
      interiorAreaM2: 114.0,
      exteriorAreaM2: 16.0,
      totalAreaM2: 130.0,
    },
    activeDeals: [
      {
        id: "d9b2d63d-a233-4123-847a-6630a8719002",
        stage: "RESERVED",
        probability: 80,
        leadName: "Mariana Valladares",
        leadId: "c9b2d63d-a233-4123-847a-6630a8719002",
      },
    ],
  },
  {
    id: "11111111-2222-4333-8444-555555550601",
    unitNumber: "601",
    floorLevel: 6,
    status: "AVAILABLE",
    basePrice: 18900000,
    currentPrice: 19425000,
    pricePerM2: 111000.0,
    currency: "MXN",
    maintenanceFee: 12250,
    orientation: "SUR-ORIENTE · PANORÁMICA",
    isCorner: true,
    phase: { id: "a1111111-1111-4111-8111-111111111102", name: "TORRE ORIENTE (FASE II)" },
    typology: {
      id: "b1111111-1111-4111-8111-111111111103",
      code: "GRAND-C3",
      name: "Family Residence 3 Recámaras",
      bedrooms: 3,
      bathrooms: 3.5,
      parkingSpots: 3,
      interiorAreaM2: 152.0,
      exteriorAreaM2: 23.0,
      totalAreaM2: 175.0,
    },
    activeDeals: [],
  },
  {
    id: "11111111-2222-4333-8444-555555550801",
    unitNumber: "801-PH",
    floorLevel: 8,
    status: "SOLD",
    basePrice: 28500000,
    currentPrice: 29640000,
    pricePerM2: 123500.0,
    currency: "MXN",
    maintenanceFee: 16800,
    orientation: "360° · ROOF GARDEN PRIVADO",
    isCorner: true,
    phase: { id: "a1111111-1111-4111-8111-111111111101", name: "TORRE PONIENTE (FASE I)" },
    typology: {
      id: "b1111111-1111-4111-8111-111111111104",
      code: "PH-MASTER",
      name: "Penthouse Doble Altura 3 Recámaras",
      bedrooms: 3,
      bathrooms: 4.5,
      parkingSpots: 4,
      interiorAreaM2: 185.0,
      exteriorAreaM2: 55.0,
      totalAreaM2: 240.0,
    },
    activeDeals: [
      {
        id: "d9b2d63d-a233-4123-847a-6630a8719003",
        stage: "CLOSED_WON",
        probability: 100,
        leadName: "Fondo Patrimonial Bajío S.A.",
        leadId: "c9b2d63d-a233-4123-847a-6630a8719003",
      },
    ],
  },
  {
    id: "11111111-2222-4333-8444-555555550802",
    unitNumber: "802-PH",
    floorLevel: 8,
    status: "BLOCKED",
    basePrice: 27900000,
    currentPrice: 28800000,
    pricePerM2: 120000.0,
    currency: "MXN",
    maintenanceFee: 16800,
    orientation: "NORTE-PONIENTE · ROOF PRIVADO",
    isCorner: true,
    phase: { id: "a1111111-1111-4111-8111-111111111102", name: "TORRE ORIENTE (FASE II)" },
    typology: {
      id: "b1111111-1111-4111-8111-111111111104",
      code: "PH-MASTER",
      name: "Penthouse Doble Altura 3 Recámaras",
      bedrooms: 3,
      bathrooms: 4.5,
      parkingSpots: 4,
      interiorAreaM2: 185.0,
      exteriorAreaM2: 55.0,
      totalAreaM2: 240.0,
    },
    activeDeals: [],
  },
];

const PAYMENT_PLANS_DATASET = [
  {
    id: "e1111111-1111-4111-8111-111111111101",
    name: "30 / 50 / 20 — PREVENTA ESTRUCTURAL (18 MESES)",
    downPaymentPct: 30,
    deferredInstallmentsPct: 50,
    monthsToDeliver: 18,
    finalBalancePct: 20,
    discountPct: 0,
  },
  {
    id: "e1111111-1111-4111-8111-111111111102",
    name: "50 / 30 / 20 — INVERSIÓN PATRIMONIAL (18 MESES)",
    downPaymentPct: 50,
    deferredInstallmentsPct: 30,
    monthsToDeliver: 18,
    finalBalancePct: 20,
    discountPct: 3.5,
  },
  {
    id: "e1111111-1111-4111-8111-111111111103",
    name: "80 / 00 / 20 — CONTADO COMERCIAL PREFERENTE",
    downPaymentPct: 80,
    deferredInstallmentsPct: 0,
    monthsToDeliver: 1,
    finalBalancePct: 20,
    discountPct: 7.0,
  },
];

const CRM_LEADS_DATASET = [
  {
    id: "c9b2d63d-a233-4123-847a-6630a8719001",
    fullName: "Rodrigo Elizondo",
    email: "r.elizondo@capitalindustrial.mx",
    phone: "+52 55 4189 2201",
    investmentGoal: "PLUSVALÍA PREVENTA",
    budgetMax: 15000000,
    activeDealId: "d9b2d63d-a233-4123-847a-6630a8719001",
  },
  {
    id: "c9b2d63d-a233-4123-847a-6630a8719002",
    fullName: "Mariana Valladares",
    email: "mvalladares@arquitectos.mx",
    phone: "+52 55 8812 9034",
    investmentGoal: "USO RESIDENCIAL PROPIO",
    budgetMax: 14000000,
    activeDealId: "d9b2d63d-a233-4123-847a-6630a8719002",
  },
  {
    id: "c9b2d63d-a233-4123-847a-6630a8719004",
    fullName: "Alejandro Garza Sada",
    email: "agarza@regiomontanacapital.mx",
    phone: "+52 81 1920 4410",
    investmentGoal: "PATRIMONIAL / YIELD",
    budgetMax: 24000000,
  },
];

const INITIAL_DEALS_DATASET = [
  {
    id: "d9b2d63d-a233-4123-847a-6630a8719001",
    stage: "NEGOTIATION",
    dealValue: 12780000,
    currency: "MXN",
    probability: 65,
    leadScore: 88,
    lostReason: null,
    updatedAtIso: "2026-11-05T19:30:00.000Z",
    lead: {
      id: "c9b2d63d-a233-4123-847a-6630a8719001",
      fullName: "Rodrigo Elizondo",
      email: "r.elizondo@capitalindustrial.mx",
      phone: "+52 55 4189 2201",
      source: "BROKER_REFERRAL",
      investmentGoal: "PLUSVALÍA PREVENTA",
    },
    unit: {
      id: "11111111-2222-4333-8444-555555550204",
      unitNumber: "204",
      phaseName: "TORRE PONIENTE (FASE I)",
      typologyCode: "TIPO-B2",
      totalAreaM2: 130,
    },
    agentName: "Alexis Garzón",
    recentActivities: [
      {
        id: "act-101",
        type: "SHOWROOM_VISIT",
        subject: "Recorrido físico en Showroom Polanco y revisión de acabados",
        timestampIso: "2026-11-04T17:00:00.000Z",
      },
      {
        id: "act-102",
        type: "WHATSAPP_MESSAGE",
        subject: "Envío de corrida financiera esquema 50/30/20 con 3.5% descuento",
        timestampIso: "2026-11-05T14:20:00.000Z",
      },
    ],
  },
  {
    id: "d9b2d63d-a233-4123-847a-6630a8719002",
    stage: "RESERVED",
    dealValue: 13520000,
    currency: "MXN",
    probability: 80,
    leadScore: 94,
    lostReason: null,
    updatedAtIso: "2026-11-05T21:10:00.000Z",
    lead: {
      id: "c9b2d63d-a233-4123-847a-6630a8719002",
      fullName: "Mariana Valladares",
      email: "mvalladares@arquitectos.mx",
      phone: "+52 55 8812 9034",
      source: "DIRECT_WALK_IN",
      investmentGoal: "USO RESIDENCIAL PROPIO",
    },
    unit: {
      id: "11111111-2222-4333-8444-555555550402",
      unitNumber: "402",
      phaseName: "TORRE PONIENTE (FASE I)",
      typologyCode: "TIPO-B2",
      totalAreaM2: 130,
    },
    agentName: "Alexis Garzón",
    recentActivities: [
      {
        id: "act-103",
        type: "TASK_FOLLOW_UP",
        subject: "Apartado SPEI recibido ($100,000 MXN) — En validación por tesorería",
        timestampIso: "2026-11-05T18:45:00.000Z",
      },
    ],
  },
  {
    id: "d9b2d63d-a233-4123-847a-6630a8719004",
    stage: "SHOWING_SCHEDULED",
    dealValue: 19425000,
    currency: "MXN",
    probability: 35,
    leadScore: 79,
    lostReason: null,
    updatedAtIso: "2026-11-05T16:00:00.000Z",
    lead: {
      id: "c9b2d63d-a233-4123-847a-6630a8719004",
      fullName: "Alejandro Garza Sada",
      email: "agarza@regiomontanacapital.mx",
      phone: "+52 81 1920 4410",
      source: "ORGANIC_WEB",
      investmentGoal: "PATRIMONIAL / YIELD",
    },
    unit: {
      id: "11111111-2222-4333-8444-555555550601",
      unitNumber: "601",
      phaseName: "TORRE ORIENTE (FASE II)",
      typologyCode: "GRAND-C3",
      totalAreaM2: 175,
    },
    agentName: "Alexis Garzón",
    recentActivities: [
      {
        id: "act-104",
        type: "PHONE_CALL",
        subject: "Confirmación de vuelo Monterrey-CDMX para cita en Showroom viernes 11:00h",
        timestampIso: "2026-11-05T15:10:00.000Z",
      },
    ],
  },
  {
    id: "d9b2d63d-a233-4123-847a-6630a8719003",
    stage: "CLOSED_WON",
    dealValue: 29640000,
    currency: "MXN",
    probability: 100,
    leadScore: 99,
    lostReason: null,
    updatedAtIso: "2026-11-02T12:00:00.000Z",
    lead: {
      id: "c9b2d63d-a233-4123-847a-6630a8719003",
      fullName: "Fondo Patrimonial Bajío S.A.",
      email: "adquisiciones@fpbajio.mx",
      phone: "+52 442 390 1100",
      source: "BROKER_REFERRAL",
      investmentGoal: "PORTAFOLIO INSTITUCIONAL",
    },
    unit: {
      id: "11111111-2222-4333-8444-555555550801",
      unitNumber: "801-PH",
      phaseName: "TORRE PONIENTE (FASE I)",
      typologyCode: "PH-MASTER",
      totalAreaM2: 240,
    },
    agentName: "Alexis Garzón",
    recentActivities: [
      {
        id: "act-105",
        type: "NOTE",
        subject: "Contrato de promesa firmado y enganche del 50% liquidado vía SPEI",
        timestampIso: "2026-11-02T12:00:00.000Z",
      },
    ],
  },
];

const SUBMARKET_ZONES_DATASET = [
  {
    id: "f1111111-1111-4111-8111-111111111101",
    name: "POLANCO V SECCIÓN",
    city: "CIUDAD DE MÉXICO",
    state: "CDMX",
    avgPriceM2: 108500,
    avgRentM2: 640,
    historicalCapRate: 6.85,
    annualAppreciation: 8.4,
  },
  {
    id: "f1111111-1111-4111-8111-111111111102",
    name: "ROMA NORTE — CORREDOR ÁLVARO OBREGÓN",
    city: "CIUDAD DE MÉXICO",
    state: "CDMX",
    avgPriceM2: 86200,
    avgRentM2: 590,
    historicalCapRate: 8.15,
    annualAppreciation: 9.6,
  },
  {
    id: "f1111111-1111-4111-8111-111111111103",
    name: "VALLE ORIENTE — SAN PEDRO GARZA GARCÍA",
    city: "MONTERREY",
    state: "NUEVO LEÓN",
    avgPriceM2: 94800,
    avgRentM2: 580,
    historicalCapRate: 7.4,
    annualAppreciation: 10.2,
  },
  {
    id: "f1111111-1111-4111-8111-111111111104",
    name: "ALDEA ZAMA PREMIUM",
    city: "TULUM",
    state: "QUINTANA ROO",
    avgPriceM2: 72400,
    avgRentM2: 560,
    historicalCapRate: 9.25,
    annualAppreciation: 8.9,
  },
];

const INITIAL_WITNESSES_DATASET = [
  {
    sourceName: "TESTIGO MLS-CDMX #01 — Tennyson 120",
    listingPrice: 14200000,
    totalAreaM2: 132,
    distanceMeters: 180,
    conservationState: "EXCELLENT",
  },
  {
    sourceName: "CIERRE NOTARIAL INTERNO — Galileo 84",
    listingPrice: 16850000,
    totalAreaM2: 150,
    distanceMeters: 290,
    conservationState: "LUXURY_REMODELED",
  },
  {
    sourceName: "TESTIGO PORTAL PREMIUM — Arquímedes 198",
    listingPrice: 12300000,
    totalAreaM2: 124,
    distanceMeters: 420,
    conservationState: "GOOD",
  },
  {
    sourceName: "VENTA DIRECTA DESARROLLADOR — Tres Picos 45",
    listingPrice: 15100000,
    totalAreaM2: 140,
    distanceMeters: 310,
    conservationState: "EXCELLENT",
  },
];

const EDITORIAL_CATALOG_DATASET = [
  {
    id: "91111111-1111-4111-8111-111111111101",
    organizationId: "01111111-1111-4111-8111-111111111101",
    slug: "monolito-polanco-v-cdmx",
    code: "DEV-CDMX-014",
    name: "MONOLITO POLANCO V",
    city: "CIUDAD DE MÉXICO",
    state: "CDMX",
    neighborhood: "POLANCO V SECCIÓN",
    postalCode: "11560",
    coordinates: { latitude: 19.432608, longitude: -99.194702 },
    status: "PRE_SALE",
    estimatedDeliveryIso: "Q2 2028",
    totalUnits: 24,
    availableUnitsCount: 9,
    startingPriceMxn: 8650000,
    avgPricePerM2Mxn: 98307,
    minDownPaymentPct: 30,
    minDownPaymentAmountMxn: 2595000,
    monthsToDeliver: 18,
    projectedCapRatePct: 7.45,
    projectedAppreciation5YPct: 49.6,
    bedroomsRangeLabel: "1 A 3 REC + PH",
    areaRangeM2Label: "95 m² A 240 m²",
    amenities: [
      "CONCIERGE 24/7",
      "CARRIL DE NADO SEMIOLÍMPICO",
      "CAVA PRIVADA",
      "WELLNESS STUDIO",
    ],
    featuredUnit: {
      id: "11111111-2222-4333-8444-555555550101",
      unitNumber: "101",
      typologyCode: "GARDEN-A1",
      totalAreaM2: 95,
      priceMxn: 8650000,
    },
  },
  {
    id: "91111111-1111-4111-8111-111111111102",
    organizationId: "01111111-1111-4111-8111-111111111101",
    slug: "prisma-valle-oriente-spgg",
    code: "DEV-MTY-008",
    name: "PRISMA VALLE ORIENTE",
    city: "MONTERREY",
    state: "NUEVO LEÓN",
    neighborhood: "SAN PEDRO GARZA GARCÍA",
    postalCode: "66269",
    coordinates: { latitude: 25.648912, longitude: -100.334109 },
    status: "UNDER_CONSTRUCTION",
    estimatedDeliveryIso: "Q4 2027",
    totalUnits: 48,
    availableUnitsCount: 14,
    startingPriceMxn: 7900000,
    avgPricePerM2Mxn: 89772,
    minDownPaymentPct: 20,
    minDownPaymentAmountMxn: 1580000,
    monthsToDeliver: 14,
    projectedCapRatePct: 8.2,
    projectedAppreciation5YPct: 56.8,
    bedroomsRangeLabel: "2 A 3 REC",
    areaRangeM2Label: "88 m² A 185 m²",
    amenities: [
      "BUSINESS CLUB B2B",
      "SKY LOUNGE SIERRA MADRE",
      "GIMNASIO ALTO RENDIMIENTO",
      "ESTACIONAMIENTO EV",
    ],
    featuredUnit: {
      id: "11111111-2222-4333-8444-555555550502",
      unitNumber: "1104",
      typologyCode: "LOCK-OFF-B1",
      totalAreaM2: 88,
      priceMxn: 7900000,
    },
  },
  {
    id: "91111111-1111-4111-8111-111111111103",
    organizationId: "01111111-1111-4111-8111-111111111101",
    slug: "casa-brutale-aldea-zama-tulum",
    code: "DEV-QROO-021",
    name: "CASA BRUTALE ALDEA ZAMA",
    city: "TULUM",
    state: "QUINTANA ROO",
    neighborhood: "ALDEA ZAMA PREMIUM",
    postalCode: "77760",
    coordinates: { latitude: 20.198421, longitude: -87.456112 },
    status: "DELIVERY_READY",
    estimatedDeliveryIso: "ENTREGA INMEDIATA",
    totalUnits: 18,
    availableUnitsCount: 4,
    startingPriceMxn: 5450000,
    avgPricePerM2Mxn: 71710,
    minDownPaymentPct: 30,
    minDownPaymentAmountMxn: 1635000,
    monthsToDeliver: 1,
    projectedCapRatePct: 9.85,
    projectedAppreciation5YPct: 48.2,
    bedroomsRangeLabel: "1 A 2 REC LOCK-OFF",
    areaRangeM2Label: "76 m² A 142 m²",
    amenities: [
      "OPERACIÓN HOTELERA LLAVE EN MANO",
      "ROOFTOP ALBERCA INFINITA",
      "PLANTA SOLAR HÍBRIDA",
      "PLUNGE POOL PRIVADO",
    ],
    featuredUnit: {
      id: "11111111-2222-4333-8444-555555550903",
      unitNumber: "PH-03",
      typologyCode: "LOFT-SWIMUP",
      totalAreaM2: 76,
      priceMxn: 5450000,
    },
  },
];

const NAVIGATION_ITEMS = [
  { id: "INVENTORY", code: "01", label: "INVENTARIO MAESTRO" },
  { id: "CRM", code: "02", label: "PIPELINE CRM & DEALS" },
  { id: "VALUATION", code: "03", label: "MOTOR DE VALUACIÓN IA" },
  { id: "MARKETPLACE", code: "04", label: "MARKETPLACE EDITORIAL" },
];

export default function App() {
  const [activeModule, setActiveModule] = useState("INVENTORY");
  const [crmDarkKanbanMode, setCrmDarkKanbanMode] = useState(false);

  const initialAnalytics = InventoryCrmService.computeOccupancyAnalytics(
    INITIAL_UNITS_DATASET.map((unit) => ({
      status: unit.status,
      currentPrice: unit.currentPrice,
      pricePerM2: unit.pricePerM2,
    }))
  );

  const kanbanBoardCards = INITIAL_DEALS_DATASET.map((d) => ({
    id: d.id,
    leadName: d.lead.fullName,
    unitCode: d.unit ? `${d.unit.unitNumber} (${d.unit.typologyCode})` : undefined,
    developmentName: "MONOLITO POLANCO V",
    dealValue: String(d.dealValue),
    currency: d.currency,
    probability: d.probability,
    stage: d.stage,
  }));

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 antialiased selection:bg-neutral-950 selection:text-white">
      {/* BARRA SUPERIOR TÉCNICA ORTOGONAL (SIN AUTHSTATUSDOT NI DEGRADADOS) */}
      <header className="sticky top-0 z-30 grid h-14 grid-cols-12 border-b border-neutral-900 bg-white">
        <div className="col-span-3 flex items-center justify-between border-r border-neutral-900 px-5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xs font-bold tracking-[0.22em] text-neutral-950">
              ATLAS // RE
            </span>
            <span className="border border-neutral-900 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-900">
              MX-CORE v1.0
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            CDMX · TULUM · MTY
          </span>
        </div>

        <div className="col-span-6 flex items-center justify-between border-r border-neutral-900 px-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              DESARROLLO ACTIVO
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950">
              MONOLITO POLANCO V — TORRE PONIENTE & ORIENTE
            </span>
          </div>
          <div className="border border-neutral-300 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-800">
            MONEDA BASE: MXN
          </div>
        </div>

        {/* BLOQUE DE SESIÓN SOBRIO (PROHIBIDO AUTHSTATUSDOT Y AVATARES REDONDEADOS) */}
        <div className="col-span-3 flex items-center justify-between px-5">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              MESA COMERCIAL
            </span>
            <span className="text-xs font-semibold tracking-tight text-neutral-950">
              ALEXIS GARZÓN — DIRECTOR COMERCIAL
            </span>
          </div>
          <div className="border border-neutral-900 bg-neutral-950 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-white">
            ROL: DIRECTOR
          </div>
        </div>
      </header>

      {/* ESTRUCTURA PRINCIPAL: SIDEBAR EDITORIAL + LIENZO BENTO */}
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-12">
        <aside className="col-span-2 flex flex-col justify-between border-r border-neutral-900 bg-white">
          <nav className="divide-y divide-neutral-200 border-b border-neutral-200">
            {NAVIGATION_ITEMS.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setActiveModule(item.id)}
                  className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors ${
                    isActive
                      ? "bg-neutral-950 text-white"
                      : "bg-white text-neutral-800 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-neutral-400">
                      {item.code}
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-[0.12em]">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono text-xs">→</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-neutral-900 bg-neutral-50 p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
              NORMATIVA COMERCIAL MX
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
              Cotizaciones expresadas en Pesos Mexicanos (MXN) conforme a lineamientos
              NOM-247-SE-2021. Precios sujetos a disponibilidad atómica en inventario.
            </p>
          </div>
        </aside>

        <main className="col-span-10 bg-neutral-100 p-6">
          {activeModule === "INVENTORY" && (
            <MasterInventoryBento
              developmentName="MONOLITO POLANCO V"
              developmentCode="DEV-CDMX-014"
              locationLabel="MIGUEL HIDALGO, CIUDAD DE MÉXICO · CP 11560"
              initialAnalytics={initialAnalytics}
              units={INITIAL_UNITS_DATASET}
              paymentPlans={PAYMENT_PLANS_DATASET}
              crmLeads={CRM_LEADS_DATASET}
            />
          )}

          {activeModule === "CRM" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border border-neutral-900 bg-white px-5 py-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-900">
                  MODO DE VISUALIZACIÓN DEL PIPELINE COMERCIAL
                </span>
                <div className="flex border border-neutral-900">
                  <button
                    type="button"
                    onClick={() => setCrmDarkKanbanMode(false)}
                    className={`px-3 py-1 font-mono text-[10px] font-bold uppercase ${
                      !crmDarkKanbanMode
                        ? "bg-neutral-950 text-white"
                        : "bg-white text-neutral-800"
                    }`}
                  >
                    BENTO INSPECTOR INTEGRAL
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrmDarkKanbanMode(true)}
                    className={`border-l border-neutral-900 px-3 py-1 font-mono text-[10px] font-bold uppercase ${
                      crmDarkKanbanMode
                        ? "bg-neutral-950 text-white"
                        : "bg-white text-neutral-800"
                    }`}
                  >
                    KANBAN EDITORIAL MONOCROMO
                  </button>
                </div>
              </div>

              {crmDarkKanbanMode ? (
                <KanbanBoard deals={kanbanBoardCards} />
              ) : (
                <CrmPipelineBento initialDeals={INITIAL_DEALS_DATASET} />
              )}
            </div>
          )}

          {activeModule === "VALUATION" && (
            <ValuationEngineBento
              zones={SUBMARKET_ZONES_DATASET}
              initialWitnesses={INITIAL_WITNESSES_DATASET}
            />
          )}

          {activeModule === "MARKETPLACE" && (
            <MarketplaceEditorialBento initialCatalog={EDITORIAL_CATALOG_DATASET} />
          )}
        </main>
      </div>
    </div>
  );
}
