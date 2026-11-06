export type CurrencyCode = "USD" | "MXN" | "EUR";

export type MembershipTier = "BASICA" | "PRO" | "AGENCIA_CORPORATIVA";

export type SovereignZone =
  | "Cancún Zona Hotelera"
  | "Puerto Cancún"
  | "Isla Pok Ta Pok"
  | "Riviera Maya"
  | "Playa del Carmen";

export type DeliveryStatus =
  | "Entrega Inmediata"
  | "Preventa Q4 2026"
  | "Preventa Q2 2027"
  | "Preventa Q1 2028"
  | "Llave en Mano";

export type CrmStageKey =
  | "CONTACTO_INICIAL"
  | "CALIFICACION_PATRIMONIAL"
  | "ENVIO_PORTAFOLIO"
  | "RECORRIDO_PRESENCIAL"
  | "NEGOCIACION_OFERTA"
  | "FIRMA_NOTARIAL";

export type ClientSegmentTag =
  | "Inversionista Fondo"
  | "Comprador Final"
  | "Segunda Residencia"
  | "Family Office";

export type NavSectionId =
  | "home"
  | "executive"
  | "inventory"
  | "crm"
  | "clients"
  | "comparator"
  | "calculator"
  | "copilot"
  | "agency"
  | "directory"
  | "drives"
  | "security"
  | "favorites";

export interface PhotoPreset {
  id: string;
  label:
    | "Minimalista"
    | "Penthouse"
    | "Vista al Mar"
    | "Interior de Autor"
    | "Jardín Tropical";
  url: string;
  caption: string;
}

export interface AureaProperty {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  zone: SovereignZone;
  priceUsd: number;
  areaM2: number;
  bedrooms: number;
  bathrooms: number;
  typologies: string;
  roiAnnualPct: number;
  appreciation5YPct: number;
  brokerCommissionPct: number;
  maintenanceMonthlyUsd: number;
  deliveryStatus: DeliveryStatus;
  availableUnits: number;
  totalUnits: number;
  isFlagship: boolean;
  defaultImageUrl: string;
  customImageUrl?: string;
  driveFolderUrl: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // % horizontal en mapa cartográfico
    mapY: number; // % vertical en mapa cartográfico
  };
  amenities: string[];
  architecturalDigest: string;
  developerName: string;
}

export interface CrmProspect {
  id: string;
  fullName: string;
  titleOrOffice: string;
  phone: string;
  email: string;
  budgetUsd: number;
  source: string;
  interestedPropertyId: string;
  interestedPropertyName: string;
  stage: CrmStageKey;
  privateNotes: string;
  assignedBrokerName: string;
  createdAtIso: string;
}

export interface PrivateClient {
  id: string;
  name: string;
  entityName: string;
  tag: ClientSegmentTag;
  email: string;
  phone: string;
  aumAllocatedUsd: number;
  curatedPropertyIds: string[];
  advisorNotes: string;
  lastContactDate: string;
}

export interface VipAppointment {
  id: string;
  clientName: string;
  clientTier: ClientSegmentTag;
  propertyName: string;
  dateLabel: string;
  timeLabel: string;
  transportMode: "Yate Privado" | "Helicóptero" | "Chófer Ejecutivo" | "Visita Presencial";
  status: "Confirmada" | "En Protocolo" | "Pendiente KYC";
}

export interface BrokerAgentMember {
  id: string;
  name: string;
  role: string;
  specialtyZone: SovereignZone;
  activeLeadsCount: number;
  closedVolumeUsd: number;
  commissionSplitBrokerPct: number;
  avatarInitials: string;
  status: "Disponible" | "En Visita VIP";
}

export interface DriveAuditItem {
  id: string;
  developmentName: string;
  zone: SovereignZone;
  driveUrl: string;
  lastVerifiedIso: string;
  priceListStatus: "Vigente" | "Actualización Detectada";
  blueprintsComplete: boolean;
  fideicomisoDocsReady: boolean;
  verifiedUnitsCount: number;
}

export interface SecurityAuditEvent {
  id: string;
  timestampIso: string;
  category:
    | "CIFRADO_AES"
    | "RATE_LIMIT"
    | "HONEYPOT_SHIELD"
    | "SANITIZACION_XSS"
    | "CAMBIO_MEMBRESIA";
  severity: "INFO" | "PREVENTIVO" | "BLOQUEADO";
  description: string;
  originIp: string;
}

export interface WhiteLabelConfig {
  agencyName: string;
  monogram: string;
  subtitle: string;
  agencySplitPct: number;
  brokerSplitPct: number;
}
