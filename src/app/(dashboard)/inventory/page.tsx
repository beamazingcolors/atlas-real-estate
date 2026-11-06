import React from "react";
import {
  CrmLeadDTO,
  InventoryUnitDTO,
  MasterInventoryBento,
  PaymentPlanDTO,
} from "@/modules/inventory/components/MasterInventoryBento";
import { InventoryCrmService } from "@/modules/crm/services/inventory-crm.service";
import { UnitStatus } from "@prisma/client";

const INITIAL_UNITS_DATASET: InventoryUnitDTO[] = [
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
        probability: 55,
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
        probability: 75,
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

const PAYMENT_PLANS_DATASET: PaymentPlanDTO[] = [
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

const CRM_LEADS_DATASET: CrmLeadDTO[] = [
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

export default async function InventoryMasterPage() {
  const initialAnalytics = InventoryCrmService.computeOccupancyAnalytics(
    INITIAL_UNITS_DATASET.map((unit) => ({
      status: unit.status as UnitStatus,
      currentPrice: unit.currentPrice,
      pricePerM2: unit.pricePerM2,
    }))
  );

  return (
    <MasterInventoryBento
      developmentName="MONOLITO POLANCO V"
      developmentCode="DEV-CDMX-014"
      locationLabel="MIGUEL HIDALGO, CIUDAD DE MÉXICO · CP 11560"
      initialAnalytics={initialAnalytics}
      units={INITIAL_UNITS_DATASET}
      paymentPlans={PAYMENT_PLANS_DATASET}
      crmLeads={CRM_LEADS_DATASET}
    />
  );
}
