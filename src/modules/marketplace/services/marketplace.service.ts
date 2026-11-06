import { prisma } from "@/core/db/prisma";
import {
  CaptureMarketplaceLeadInput,
  ParametricCatalogFilterInput,
} from "@/modules/marketplace/validations/marketplace.schema";
import {
  ActivityType,
  Currency,
  DealStage,
  DevelopmentStatus,
  LeadSource,
  LeadStatus,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface EditorialDevelopmentCardDTO {
  id: string;
  organizationId: string;
  slug: string;
  code: string;
  name: string;
  city: string;
  state: string;
  neighborhood: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: DevelopmentStatus;
  estimatedDeliveryIso: string;
  totalUnits: number;
  availableUnitsCount: number;
  startingPriceMxn: number;
  avgPricePerM2Mxn: number;
  minDownPaymentPct: number;
  minDownPaymentAmountMxn: number;
  monthsToDeliver: number;
  projectedCapRatePct: number;
  projectedAppreciation5YPct: number;
  bedroomsRangeLabel: string;
  areaRangeM2Label: string;
  amenities: string[];
  featuredUnit: {
    id: string;
    unitNumber: string;
    typologyCode: string;
    totalAreaM2: number;
    priceMxn: number;
  };
}

export interface ComparisonBenchmarkSummary {
  lowestPricePerM2DevelopmentId: string;
  highestCapRateDevelopmentId: string;
  lowestEntryDownPaymentDevelopmentId: string;
}

export class MarketplaceService {
  /**
   * Filtra y ordena paramétricamente el catálogo editorial de desarrollos.
   */
  public static filterAndSortCatalog(
    catalog: EditorialDevelopmentCardDTO[],
    filter: ParametricCatalogFilterInput
  ): EditorialDevelopmentCardDTO[] {
    const filtered = catalog.filter((item) => {
      if (
        filter.city &&
        filter.city !== "ALL" &&
        item.city.toUpperCase() !== filter.city.toUpperCase()
      ) {
        return false;
      }
      if (filter.status && item.status !== filter.status) {
        return false;
      }
      if (
        filter.maxBudgetMxn !== undefined &&
        item.startingPriceMxn > filter.maxBudgetMxn
      ) {
        return false;
      }
      if (
        filter.minCapRatePct !== undefined &&
        item.projectedCapRatePct < filter.minCapRatePct
      ) {
        return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (filter.sortBy) {
        case "PRICE_ASC":
          return a.startingPriceMxn - b.startingPriceMxn;
        case "PRICE_M2_ASC":
          return a.avgPricePerM2Mxn - b.avgPricePerM2Mxn;
        case "APPRECIATION_DESC":
          return b.projectedAppreciation5YPct - a.projectedAppreciation5YPct;
        case "CAP_RATE_DESC":
        default:
          return b.projectedCapRatePct - a.projectedCapRatePct;
      }
    });
  }

  /**
   * Evalúa hasta 3 desarrollos seleccionados y determina los líderes técnicos
   * en eficiencia de precio por m², Cap Rate y enganche de entrada.
   */
  public static evaluateComparisonBenchmarks(
    items: EditorialDevelopmentCardDTO[]
  ): ComparisonBenchmarkSummary | null {
    if (items.length === 0) return null;

    let lowestPpm2 = items[0];
    let highestCap = items[0];
    let lowestEntry = items[0];

    for (const item of items) {
      if (item.avgPricePerM2Mxn < lowestPpm2.avgPricePerM2Mxn) {
        lowestPpm2 = item;
      }
      if (item.projectedCapRatePct > highestCap.projectedCapRatePct) {
        highestCap = item;
      }
      if (item.minDownPaymentAmountMxn < lowestEntry.minDownPaymentAmountMxn) {
        lowestEntry = item;
      }
    }

    return {
      lowestPricePerM2DevelopmentId: lowestPpm2.id,
      highestCapRateDevelopmentId: highestCap.id,
      lowestEntryDownPaymentDevelopmentId: lowestEntry.id,
    };
  }

  /**
   * Genera el grafo estructurado JSON-LD (Schema.org RealEstateListing)
   * para indexación orgánica de alta conversión en motores de búsqueda.
   */
  public static buildSeoJsonLd(item: EditorialDevelopmentCardDTO): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: `${item.name} — ${item.neighborhood}, ${item.city}`,
      identifier: item.code,
      url: `https://atlasrealestate.mx/marketplace/${item.slug}`,
      datePosted: "2026-11-01",
      offers: {
        "@type": "Offer",
        priceCurrency: "MXN",
        price: item.startingPriceMxn,
        availability:
          item.availableUnitsCount > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: item.city,
        addressRegion: item.state,
        postalCode: item.postalCode,
        streetAddress: item.neighborhood,
        addressCountry: "MX",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: item.coordinates.latitude,
        longitude: item.coordinates.longitude,
      },
    };
  }

  /**
   * Convierte un prospecto captado en la Ficha Técnica del Marketplace en un Lead
   * calificado y abre su Deal automáticamente en el Pipeline del CRM.
   */
  public static async captureLeadFromSheet(
    input: CaptureMarketplaceLeadInput,
    defaultAgentId: string
  ) {
    return await prisma.$transaction(async (tx) => {
      const existingLead = await tx.lead.findFirst({
        where: {
          organizationId: input.organizationId,
          email: input.email,
        },
      });

      const lead = existingLead
        ? await tx.lead.update({
            where: { id: existingLead.id },
            data: {
              phone: input.phone,
              budgetMax: new Decimal(input.estimatedBudgetMxn),
              investmentGoal: input.investmentGoal,
              status: LeadStatus.QUALIFIED,
            },
          })
        : await tx.lead.create({
            data: {
              organizationId: input.organizationId,
              assignedToId: defaultAgentId,
              firstName: input.firstName,
              lastName: input.lastName,
              email: input.email,
              phone: input.phone,
              source: LeadSource.ORGANIC_WEB,
              status: LeadStatus.QUALIFIED,
              budgetMax: new Decimal(input.estimatedBudgetMxn),
              currency: Currency.MXN,
              targetZones: [input.developmentId],
              investmentGoal: input.investmentGoal,
            },
          });

      const deal = await tx.deal.create({
        data: {
          leadId: lead.id,
          agentId: defaultAgentId,
          unitId: input.unitId ?? null,
          stage: DealStage.PROSPECT,
          dealValue: new Decimal(input.estimatedBudgetMxn),
          currency: Currency.MXN,
          probability: 20,
        },
      });

      await tx.activity.create({
        data: {
          dealId: deal.id,
          leadId: lead.id,
          userId: defaultAgentId,
          type: ActivityType.ONLINE_MEETING,
          subject: `Solicitud de Ficha Técnica & Corrida — Marketplace Editorial`,
          body: `Inversionista ${input.firstName} ${input.lastName} (${input.email}) registró interés en desarrollo ID ${input.developmentId}. Objetivo: ${input.investmentGoal}. Presupuesto declarado: $${input.estimatedBudgetMxn.toLocaleString("es-MX")} MXN. ${input.notes ?? ""}`,
          isCompleted: false,
          scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        },
      });

      return {
        leadId: lead.id,
        dealId: deal.id,
        stage: deal.stage,
      };
    });
  }
}
