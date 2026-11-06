import React from "react";
import {
  SubmarketZoneDTO,
  ValuationEngineBento,
} from "@/modules/ai-engine/components/ValuationEngineBento";
import { ComparableWitnessInput } from "@/modules/ai-engine/validations/valuation.schema";

const SUBMARKET_ZONES_DATASET: SubmarketZoneDTO[] = [
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

const INITIAL_WITNESSES_DATASET: ComparableWitnessInput[] = [
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

export default async function ValuationEnginePage() {
  return (
    <ValuationEngineBento
      zones={SUBMARKET_ZONES_DATASET}
      initialWitnesses={INITIAL_WITNESSES_DATASET}
    />
  );
}
