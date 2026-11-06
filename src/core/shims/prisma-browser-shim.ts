export const UserRole = {
  SUPERADMIN: "SUPERADMIN",
  DIRECTOR: "DIRECTOR",
  DEVELOPER_ADMIN: "DEVELOPER_ADMIN",
  SALES_MANAGER: "SALES_MANAGER",
  BROKER_AGENT: "BROKER_AGENT",
  VALUATION_ANALYST: "VALUATION_ANALYST",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const DevelopmentStatus = {
  PLANNING: "PLANNING",
  PRE_SALE: "PRE_SALE",
  UNDER_CONSTRUCTION: "UNDER_CONSTRUCTION",
  DELIVERY_READY: "DELIVERY_READY",
  COMPLETED: "COMPLETED",
  SOLD_OUT: "SOLD_OUT",
} as const;
export type DevelopmentStatus =
  (typeof DevelopmentStatus)[keyof typeof DevelopmentStatus];

export const UnitStatus = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  BLOCKED: "BLOCKED",
  UNDER_CONTRACT: "UNDER_CONTRACT",
  SOLD: "SOLD",
} as const;
export type UnitStatus = (typeof UnitStatus)[keyof typeof UnitStatus];

export const Currency = {
  MXN: "MXN",
  USD: "USD",
} as const;
export type Currency = (typeof Currency)[keyof typeof Currency];

export const LeadSource = {
  CAMPAIGN_FACEBOOK: "CAMPAIGN_FACEBOOK",
  CAMPAIGN_GOOGLE: "CAMPAIGN_GOOGLE",
  PORTAL_INMOBILIARIO: "PORTAL_INMOBILIARIO",
  ORGANIC_WEB: "ORGANIC_WEB",
  BROKER_REFERRAL: "BROKER_REFERRAL",
  DIRECT_WALK_IN: "DIRECT_WALK_IN",
  WHATSAPP: "WHATSAPP",
} as const;
export type LeadSource = (typeof LeadSource)[keyof typeof LeadSource];

export const LeadStatus = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  ENGAGED: "ENGAGED",
  QUALIFIED: "QUALIFIED",
  UNQUALIFIED: "UNQUALIFIED",
} as const;
export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus];

export const DealStage = {
  PROSPECT: "PROSPECT",
  DISCOVERY_CALL: "DISCOVERY_CALL",
  SHOWING_SCHEDULED: "SHOWING_SCHEDULED",
  VISIT_COMPLETED: "VISIT_COMPLETED",
  NEGOTIATION: "NEGOTIATION",
  RESERVED: "RESERVED",
  CONTRACT_IN_REVIEW: "CONTRACT_IN_REVIEW",
  CLOSED_WON: "CLOSED_WON",
  CLOSED_LOST: "CLOSED_LOST",
} as const;
export type DealStage = (typeof DealStage)[keyof typeof DealStage];

export const ActivityType = {
  WHATSAPP_MESSAGE: "WHATSAPP_MESSAGE",
  PHONE_CALL: "PHONE_CALL",
  EMAIL_SENT: "EMAIL_SENT",
  SHOWROOM_VISIT: "SHOWROOM_VISIT",
  ONLINE_MEETING: "ONLINE_MEETING",
  TASK_FOLLOW_UP: "TASK_FOLLOW_UP",
  NOTE: "NOTE",
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const ReservationStatus = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  VALIDATED: "VALIDATED",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  APPLIED_TO_CONTRACT: "APPLIED_TO_CONTRACT",
} as const;
export type ReservationStatus =
  (typeof ReservationStatus)[keyof typeof ReservationStatus];

export const PropertyType = {
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  PENTHOUSE: "PENTHOUSE",
  LAND_LOT: "LAND_LOT",
  COMMERCIAL_LOCAL: "COMMERCIAL_LOCAL",
} as const;
export type PropertyType = (typeof PropertyType)[keyof typeof PropertyType];

export const ConservationState = {
  LUXURY_REMODELED: "LUXURY_REMODELED",
  EXCELLENT: "EXCELLENT",
  GOOD: "GOOD",
  REGULAR: "REGULAR",
  REQUIRES_REPAIR: "REQUIRES_REPAIR",
} as const;
export type ConservationState =
  (typeof ConservationState)[keyof typeof ConservationState];

export const ValuationMethod = {
  COMPARABLE_MARKET_SALES: "COMPARABLE_MARKET_SALES",
  INCOME_CAPITALIZATION: "INCOME_CAPITALIZATION",
  HEDONIC_REGRESSION_AI: "HEDONIC_REGRESSION_AI",
  HYBRID_WEIGHTED: "HYBRID_WEIGHTED",
} as const;
export type ValuationMethod =
  (typeof ValuationMethod)[keyof typeof ValuationMethod];

export class Decimal {
  private readonly value: number;
  constructor(val: number | string | Decimal) {
    this.value = val instanceof Decimal ? val.value : Number(val);
  }
  toString(): string {
    return String(this.value);
  }
  valueOf(): number {
    return this.value;
  }
}

export namespace Prisma {
  export type UnitWhereInput = Record<string, unknown>;
  export interface ValuationComparableCreateWithoutValuationStudyInput {
    sourceName: string;
    sourceUrl?: string;
    listingPrice: Decimal;
    totalAreaM2: Decimal;
    pricePerM2: Decimal;
    distanceMeters: number;
    similarityFactor: Decimal;
    isOutlier?: boolean;
  }
}

export class PrismaClient {
  constructor(_options?: unknown) {}
  async $transaction<T>(_fn: (tx: never) => Promise<T>): Promise<T> {
    throw new Error("Modo demostración en cliente estático activo.");
  }
}
