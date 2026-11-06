import React from "react";
import type { Metadata } from "next";
import { MarketplaceEditorialBento } from "@/modules/marketplace/components/MarketplaceEditorialBento";
import {
  EditorialDevelopmentCardDTO,
  MarketplaceService,
} from "@/modules/marketplace/services/marketplace.service";

export const metadata: Metadata = {
  title: "Marketplace Editorial B2B/B2C | Atlas Real Estate México",
  description:
    "Catálogo paramétrico de desarrollos inmobiliarios verificados en CDMX, Monterrey y Riviera Maya. Comparador de Cap Rate, precios por m² y esquemas de preventa en MXN.",
  openGraph: {
    title: "Atlas Real Estate — Marketplace Inmobiliario Institucional",
    description:
      "Análisis comparativo de desarrollos en preventa y entrega inmediata en México.",
    locale: "es_MX",
    type: "website",
  },
};

const EDITORIAL_CATALOG_DATASET: EditorialDevelopmentCardDTO[] = [
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

export default async function MarketplaceEditorialPage() {
  const jsonLdList = EDITORIAL_CATALOG_DATASET.map((item) =>
    MarketplaceService.buildSeoJsonLd(item)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }}
      />
      <MarketplaceEditorialBento initialCatalog={EDITORIAL_CATALOG_DATASET} />
    </>
  );
}
