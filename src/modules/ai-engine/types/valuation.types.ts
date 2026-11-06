import { ConservationState, PropertyType, ValuationMethod } from "@prisma/client";

export interface HedonicValuationInput {
  submarketZoneId: string;
  propertyType: PropertyType;
  totalAreaM2: number;
  interiorAreaM2: number;
  ageYears: number;
  conservationState: ConservationState;
  parkingSpots: number;
  amenitiesCount: number;
  latitude: number;
  longitude: number;
}

export interface ValuationProjectionOutput {
  folioNumber: string;
  methodUsed: ValuationMethod;
  estimatedValueMxn: number;
  estimatedPricePerM2Mxn: number;
  confidenceScorePct: number;
  projectedCapRatePct: number;
  projectedAppreciation3YPct: number;
  projectedAppreciation5YPct: number;
}
