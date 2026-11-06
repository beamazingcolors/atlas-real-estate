import { Currency, DevelopmentStatus } from "@prisma/client";

export interface ParametricSearchQuery {
  city?: string;
  state?: string;
  neighborhood?: string;
  minBudgetMxn?: number;
  maxBudgetMxn?: number;
  minBedrooms?: number;
  minAreaM2?: number;
  developmentStatus?: DevelopmentStatus[];
  minProjectedCapRate?: number;
}

export interface EditorialListingSheetDTO {
  slug: string;
  developmentName: string;
  neighborhood: string;
  city: string;
  status: DevelopmentStatus;
  startingPriceMxn: number;
  avgPricePerM2Mxn: number;
  currency: Currency;
  availableUnitsCount: number;
  estimatedDeliveryIso: string | null;
}
