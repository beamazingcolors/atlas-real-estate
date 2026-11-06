import React from "react";
import {
  CrmPipelineBento,
  CrmPipelineDealDTO,
} from "@/modules/crm/components/CrmPipelineBento";

const INITIAL_DEALS_DATASET: CrmPipelineDealDTO[] = [
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

export default async function CrmPipelinePage() {
  return <CrmPipelineBento initialDeals={INITIAL_DEALS_DATASET} />;
}
