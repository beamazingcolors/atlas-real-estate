import { NavSectionId, StrategicYearKey } from "../types";

export interface StrategicYearPlan {
  key: StrategicYearKey;
  yearNumber: number;
  label: string;
  phaseTitle: string;
  subtitle: string;
  executiveThesis: string;
  targetNav: NavSectionId;
  actionButtonLabel: string;
  deliverables: {
    title: string;
    detail: string;
    linkedModule: string;
    targetNav: NavSectionId;
  }[];
  kpis: {
    registeredUsers: string;
    publishedDevelopments: string;
    activeProperties: string;
    closedOperations: string;
    affiliatedProviders: string;
    mrrUsd: number;
    conversionRate: string;
    clientRetention: string;
    aiUsagePerUser: string;
  };
}

export const STRATEGIC_5Y_ROADMAP: StrategicYearPlan[] = [
  {
    key: "YEAR_1",
    yearNumber: 1,
    label: "Año 1 – MVP",
    phaseTitle: "Cimiento Operativo & Centralización Comercial",
    subtitle:
      "CRM Inmobiliario, Inventario de Desarrollos, Clientes, Buscador y Panel de Asesores",
    executiveThesis:
      "Establecer el núcleo transaccional del sistema operativo inmobiliario: unificar el inventario verificado de desarrollos, la gestión de prospectos en embudo Kanban y el buscador predictivo para asesores e inversionistas.",
    targetNav: "crm",
    actionButtonLabel: "Explorar CRM & Inventario MVP",
    deliverables: [
      {
        title: "CRM Inmobiliario",
        detail:
          "Embudo comercial de 6 etapas con calificación patrimonial, presupuesto, notas privadas y trazabilidad completa por asesor.",
        linkedModule: "Módulo 01 · CRM Pipeline",
        targetNav: "crm",
      },
      {
        title: "Inventario de Desarrollos y Propiedades",
        detail:
          "Catálogo estructurado con fotos reales, brochures ES/EN, listas de precios por unidad, planes de pago y fichas técnicas sincronizadas desde Google Drive.",
        linkedModule: "Módulo 02 · Inventario Maestro",
        targetNav: "inventory",
      },
      {
        title: "Gestión de Clientes, Leads y Seguimiento",
        detail:
          "Directorio segmentado por perfil (Family Office, Inversionista Fondo, Segunda Residencia, Comprador Final) con colecciones personalizadas.",
        linkedModule: "Módulo 09 · Portal para Clientes",
        targetNav: "clients",
      },
      {
        title: "Buscador Inteligente",
        detail:
          "Búsqueda instantánea por comando rápido (Ctrl + K), filtrado por corredor geográfico, retorno anual (ROI) y estatus de entrega.",
        linkedModule: "Buscador Predictivo Global",
        targetNav: "inventory",
      },
      {
        title: "Panel para Asesores",
        detail:
          "Centro de mando con métricas de volumen en cartera, comisiones proyectadas, citas VIP y mapa satelital interactivo.",
        linkedModule: "Módulo 06 · Analítica y Dashboards",
        targetNav: "executive",
      },
    ],
    kpis: {
      registeredUsers: "1,250 asesores y brokers",
      publishedDevelopments: "24 desarrollos verificados",
      activeProperties: "680 unidades en tiempo real",
      closedOperations: "110 cierres anuales",
      affiliatedProviders: "45 aliados iniciales",
      mrrUsd: 38000,
      conversionRate: "4.8% lead a visita",
      clientRetention: "87.5% retención anual",
      aiUsagePerUser: "24 consultas / mes",
    },
  },
  {
    key: "YEAR_2",
    yearNumber: 2,
    label: "Año 2 – IA Comercial",
    phaseTitle: "Automatización Comercial & Inteligencia Financiera",
    subtitle:
      "Respuestas IA, Comparador, Propuestas/ROI Automáticos, WhatsApp/Email y Recomendaciones",
    executiveThesis:
      "Multiplicar la productividad comercial del asesor mediante inteligencia artificial entrenada en cada desarrollo, comparativas multidimensionales instantáneas y seguimiento automatizado multicanal.",
    targetNav: "copilot",
    actionButtonLabel: "Abrir Atlas AI & Comparador",
    deliverables: [
      {
        title: "IA que Responda Preguntas sobre Propiedades",
        detail:
          "Motor conversacional entrenado en precios por m², amenidades, fideicomisos en Zona Restringida, normas NOM-247 y retenciones fiscales.",
        linkedModule: "Módulo 04 · Atlas AI",
        targetNav: "copilot",
      },
      {
        title: "Comparador de Desarrollos",
        detail:
          "Evaluación lado a lado de hasta 3 desarrollos comparando precio por m², Cap Rate anual, plusvalía proyectada a 5 años y cuota de mantenimiento.",
        linkedModule: "Módulo 05 · Comparador Inteligente",
        targetNav: "comparator",
      },
      {
        title: "Generación Automática de Propuestas, ROI y Presentaciones",
        detail:
          "Creación en un clic de dossieres ejecutivos imprimibles y corridas de flujo de caja con descuentos de preventa.",
        linkedModule: "Calculadora & Dossier Studio",
        targetNav: "calculator",
      },
      {
        title: "Seguimiento Automático por WhatsApp y Correo",
        detail:
          "Secuencias automatizadas de contacto con mensajes pre-redactados ejecutivos y alertas de cambio de etapa o precio.",
        linkedModule: "Módulo 08 · Marketing y Automatización",
        targetNav: "developers",
      },
      {
        title: "Recomendaciones de Propiedades según Perfil",
        detail:
          "Curaduría algorítmica que sugiere unidades óptimas según presupuesto, horizonte de entrega y objetivo patrimonial del cliente.",
        linkedModule: "Módulo 04 · Matching & Recomendación",
        targetNav: "copilot",
      },
    ],
    kpis: {
      registeredUsers: "4,800 asesores e inversionistas",
      publishedDevelopments: "85 desarrollos activos",
      activeProperties: "2,950 unidades activas",
      closedOperations: "420 cierres anuales",
      affiliatedProviders: "180 proveedores certificados",
      mrrUsd: 115000,
      conversionRate: "6.9% con seguimiento IA",
      clientRetention: "91.2% retención anual",
      aiUsagePerUser: "62 ejecuciones IA / mes",
    },
  },
  {
    key: "YEAR_3",
    yearNumber: 3,
    label: "Año 3 – Marketplace",
    phaseTitle: "Marketplace Transaccional de Servicios Inmobiliarios",
    subtitle:
      "8 Verticales de Proveedores Certificados con Calificaciones y Comisiones por Referencia",
    executiveThesis:
      "Integrar toda la cadena de valor previa y posterior a la compraventa (Notarías, Crédito Hipotecario, Seguros, Avalúos, Arquitectura, Interiorismo, Mudanzas y Administración de Rentas) monetizando cada referencia certificada.",
    targetNav: "directory",
    actionButtonLabel: "Abrir Marketplace de Servicios",
    deliverables: [
      {
        title: "Notarías, Brokers Hipotecarios, Aseguradoras y Avalúos",
        detail:
          "Contratación directa de servicios jurídicos, financieros y periciales con tiempos de respuesta garantizados (SLA) y expediente compartido.",
        linkedModule: "Módulo 03 · Marketplace Legal & Financiero",
        targetNav: "directory",
      },
      {
        title: "Arquitectos, Interiorismo, Mudanzas y Administración de Rentas",
        detail:
          "Proveedores llave en mano para equipamiento de unidades vacacionales, mudanza residencial y operación hotelera de rentas cortas.",
        linkedModule: "Módulo 03 · Marketplace Postventa & Rentas",
        targetNav: "directory",
      },
      {
        title: "Sistema de Calificaciones y Comisiones por Referencia",
        detail:
          "Evaluación transparente por operación cerrada y liquidación automática de fee de referencia para el asesor y la plataforma.",
        linkedModule: "Módulo 03 · Motor de Comisiones por Referencia",
        targetNav: "directory",
      },
    ],
    kpis: {
      registeredUsers: "12,500 usuarios activos",
      publishedDevelopments: "210 desarrollos publicados",
      activeProperties: "8,400 propiedades activas",
      closedOperations: "1,150 cierres anuales",
      affiliatedProviders: "540 proveedores en 8 categorías",
      mrrUsd: 265000,
      conversionRate: "8.6% conversión integral",
      clientRetention: "93.8% retención anual",
      aiUsagePerUser: "95 ejecuciones IA / mes",
    },
  },
  {
    key: "YEAR_4",
    yearNumber: 4,
    label: "Año 4 – Ecosistema",
    phaseTitle:
      "Conectividad Enterprise, Portal de Desarrolladores & Firma Digital",
    subtitle:
      "Inventario en Tiempo Real, API CRMs/ERPs, Gestión Documental y Firma Electrónica",
    executiveThesis:
      "Conectar directamente a las desarrolladoras inmobiliarias al corazón de Atlas mediante su propio portal de actualización en tiempo real, pasarela API para ERPs/CRMs y cierre documental con firma electrónica.",
    targetNav: "developers",
    actionButtonLabel: "Abrir Portal Desarrolladores & API",
    deliverables: [
      {
        title: "Panel para Desarrolladores & Inventario en Tiempo Real",
        detail:
          "Consola para que cada desarrolladora actualice precios, bloqueos de unidades, avances de obra y promociones de preventa al instante.",
        linkedModule: "Módulo 10 · Portal para Desarrolladores",
        targetNav: "developers",
      },
      {
        title: "API para Conectar CRMs y ERPs",
        detail:
          "Webhooks y endpoints REST/GraphQL para sincronizar HubSpot, Salesforce, SAP Real Estate, Enkora y Tokko Broker en tiempo real.",
        linkedModule: "Módulo 10 · API Gateway & Webhooks",
        targetNav: "developers",
      },
      {
        title: "Gestión Documental & Firma Electrónica",
        detail:
          "Bóveda documental sincronizada con Google Drive y flujo de firma electrónica certificada para Cartas Oferta y Contratos de Promesa.",
        linkedModule: "Módulo 07 · Gestión Documental & Firma",
        targetNav: "drives",
      },
      {
        title: "Automatización de Procesos",
        detail:
          "Orquestación sin fricción desde el apartado de la unidad y validación KYC hasta la dispersión de comisiones.",
        linkedModule: "Módulo 08 · Automatización Operativa",
        targetNav: "developers",
      },
    ],
    kpis: {
      registeredUsers: "26,000 profesionales registrados",
      publishedDevelopments: "410 desarrollos en tiempo real",
      activeProperties: "16,800 propiedades activas",
      closedOperations: "2,480 cierres anuales",
      affiliatedProviders: "1,120 proveedores certificados",
      mrrUsd: 460000,
      conversionRate: "10.2% conversión omnicanal",
      clientRetention: "95.1% retención anual",
      aiUsagePerUser: "128 ejecuciones IA / mes",
    },
  },
  {
    key: "YEAR_5",
    yearNumber: 5,
    label: "Año 5 – Plataforma Integral",
    phaseTitle: "Consolidación Nacional & Agentes IA Especializados",
    subtitle:
      "Marketplace Consolidado, IA Predictiva, Matching Automático, 4 Agentes IA y Expansión Nacional",
    executiveThesis:
      "Ser la plataforma inmobiliaria de referencia en México, integrando operación, inteligencia artificial predictiva, matching autónomo cliente-propiedad, 4 agentes IA especializados y colaboración total en los principales corredores del país.",
    targetNav: "copilot",
    actionButtonLabel: "Probar Agentes IA & Matching Año 5",
    deliverables: [
      {
        title: "Marketplace Consolidado a Nivel Nacional",
        detail:
          "Red nacional de proveedores certificados con contratación embebida en cada etapa del cierre inmobiliario.",
        linkedModule: "Módulo 03 · Marketplace Nacional",
        targetNav: "directory",
      },
      {
        title: "IA Predictiva de Precios y Plusvalía",
        detail:
          "Modelos econométricos que proyectan absorción, elasticidad de precios por m² y curvas de plusvalía a 3 y 5 años por micro-corredor.",
        linkedModule: "Módulo 04 · Atlas AI Predictiva",
        targetNav: "copilot",
      },
      {
        title: "Matching Automático entre Clientes y Propiedades",
        detail:
          "Motor de emparejamiento instantáneo que cruza el perfil financiero y patrimonial del inversionista contra todas las unidades disponibles.",
        linkedModule: "Módulo 04 · Motor de Matching IA",
        targetNav: "copilot",
      },
      {
        title:
          "Agentes IA Especializados (Ventas, Inversiones, Legal y Postventa)",
        detail:
          "Cuatro agentes autónomos dedicados a redacción de contratos, estructuración de portafolios, cierre comercial y administración postventa.",
        linkedModule: "Módulo 04 · Cuatro Agentes IA",
        targetNav: "copilot",
      },
      {
        title: "Expansión Nacional Consolidada",
        detail:
          "Presencia operativa en Cancún, Riviera Maya, CDMX, Monterrey, Guadalajara, Los Cabos, Mérida y Puerto Vallarta.",
        linkedModule: "Módulo 06 · Red Nacional Atlas",
        targetNav: "executive",
      },
    ],
    kpis: {
      registeredUsers: "48,500 usuarios registrados",
      publishedDevelopments: "680 desarrollos publicados",
      activeProperties: "29,400 propiedades activas",
      closedOperations: "4,650 operaciones cerradas / año",
      affiliatedProviders: "1,950 proveedores afiliados",
      mrrUsd: 740000,
      conversionRate: "12.4% con Matching IA",
      clientRetention: "96.8% retención neta (NRR)",
      aiUsagePerUser: "165 ejecuciones IA / mes",
    },
  },
];

export interface CorePlatformModuleItem {
  number: string;
  title: string;
  category: string;
  description: string;
  capabilities: string[];
  targetNav: NavSectionId;
  yearIntroduced: string;
}

export const TEN_CORE_MODULES: CorePlatformModuleItem[] = [
  {
    number: "01",
    title: "CRM Inmobiliario",
    category: "OPERACIÓN COMERCIAL",
    description:
      "Gestión integral de prospectos en embudo Kanban de 6 fases, calificación patrimonial, asignación Round-Robin y contacto directo por WhatsApp.",
    capabilities: [
      "Pipeline de 6 fases desde Contacto Inicial hasta Firma Notarial",
      "Calificación de presupuesto, origen del lead y notas de due diligence",
      "Asignación inteligente multi-broker y alertas de seguimiento",
    ],
    targetNav: "crm",
    yearIntroduced: "Año 1 – MVP",
  },
  {
    number: "02",
    title: "Inventario de Desarrollos",
    category: "CATÁLOGO & GOOGLE DRIVE EN MANO",
    description:
      "Repositorio vivo con fotos reales, brochures ES/EN, inventario unidad por unidad, planes de pago con descuentos y fichas técnicas.",
    capabilities: [
      "Expediente completo de Google Drive integrado en 5 pestañas",
      "Cotizador dinámico de esquemas de pago (30/70, 50/30/20, 80/20, 90/10)",
      "Personalización fotográfica y vista en mapa satelital real",
    ],
    targetNav: "inventory",
    yearIntroduced: "Año 1 – MVP",
  },
  {
    number: "03",
    title: "Marketplace de Servicios",
    category: "8 VERTICALES CERTIFICADAS",
    description:
      "Conecta a compradores y asesores con proveedores certificados en 8 categorías bajo un modelo de calificaciones y comisiones por referencia.",
    capabilities: [
      "Notarías, Brokers hipotecarios, Aseguradoras y Avalúos",
      "Arquitectos, Interiorismo, Mudanzas y Administración de rentas",
      "Liquidación transparente de comisiones por referencia y reseñas verificadas",
    ],
    targetNav: "directory",
    yearIntroduced: "Año 3 – Marketplace",
  },
  {
    number: "04",
    title: "Atlas AI",
    category: "4 AGENTES IA & 9 FUNCIONES",
    description:
      "Motor de inteligencia artificial con búsqueda en lenguaje natural, cálculo de ROI/plusvalía, redacción de contratos, clasificación de leads y matching automático.",
    capabilities: [
      "4 Agentes IA: Ventas, Inversiones, Legal y Postventa",
      "9 Funciones: Búsqueda natural, ROI, fichas, contratos, resumen y cierres",
      "Matching automático Cliente ↔ Propiedad con score de afinidad",
    ],
    targetNav: "copilot",
    yearIntroduced: "Año 2 & Año 5",
  },
  {
    number: "05",
    title: "Comparador Inteligente",
    category: "ANÁLISIS MULTIDIMENSIONAL",
    description:
      "Comparación simultánea lado a lado de desarrollos y zonas evaluando precio por m², Cap Rate anual, mantenimiento y plusvalía a 5 años.",
    capabilities: [
      "Matriz comparativa de hasta 3 desarrollos en simultáneo",
      "Conversión automática en USD, MXN y EUR",
      "Acceso inmediato al dossier de cada desarrollo comparado",
    ],
    targetNav: "comparator",
    yearIntroduced: "Año 2 – IA Comercial",
  },
  {
    number: "06",
    title: "Analítica y Dashboards",
    category: "CENTRO DE MANDO EJECUTIVO",
    description:
      "Tablero de control para directores, brokers e inversionistas con KPIs de volumen, comisiones, mapa satelital real y calculadora financiera.",
    capabilities: [
      "Métricas de cartera gestionada, comisiones proyectadas y conversión",
      "Cartografía real interactiva con capas satelitales Esri HD",
      "Simulador de Cap Rate, ADR vacacional y recuperación de capital",
    ],
    targetNav: "executive",
    yearIntroduced: "Año 1 & Año 5",
  },
  {
    number: "07",
    title: "Gestión Documental",
    category: "AUDITORÍA DRIVE & FIRMA DIGITAL",
    description:
      "Sincronización semanal con carpetas oficiales de desarrolladores, verificación de listas de precios, checklists KYC y firma electrónica.",
    capabilities: [
      "Auditoría automatizada de Google Drives por desarrollo",
      "Checklists para compradores nacionales y extranjeros (Fideicomiso SRE)",
      "Flujo de firma electrónica certificada para Cartas Oferta y Contratos",
    ],
    targetNav: "drives",
    yearIntroduced: "Año 4 – Ecosistema",
  },
  {
    number: "08",
    title: "Marketing y Automatización",
    category: "OMNICANALIDAD WHATSAPP & EMAIL",
    description:
      "Secuencias automáticas de nutrición y seguimiento por WhatsApp y correo electrónico, más generación express de presentaciones con marca blanca.",
    capabilities: [
      "Disparadores automáticos por cambio de etapa o nuevo prospecto",
      "Plantillas ejecutivas de WhatsApp y correo con un clic",
      "Personalización White-Label para agencias y equipos de corretaje",
    ],
    targetNav: "developers",
    yearIntroduced: "Año 2 & Año 4",
  },
  {
    number: "09",
    title: "Portal para Clientes",
    category: "EXPERIENCIA DEL INVERSIONISTA",
    description:
      "Espacio curado donde cada comprador o Family Office consulta su Selección Exclusiva de propiedades, corridas financieras y estatus postventa.",
    capabilities: [
      "Etiquetado por perfil: Family Office, Fondo, Segunda Residencia, Final",
      "Generación de enlaces privados cifrados con propiedades seleccionadas",
      "Seguimiento de entregas, garantías y conexión con administración de rentas",
    ],
    targetNav: "clients",
    yearIntroduced: "Año 1 & Año 5",
  },
  {
    number: "10",
    title: "Portal para Desarrolladores",
    category: "TIEMPO REAL & API ECOSYSTEM",
    description:
      "Consola Enterprise para que las desarrolladoras publiquen y actualicen su inventario en tiempo real y conecten sus CRMs y ERPs vía API.",
    capabilities: [
      "Actualización en vivo de disponibilidad, precios y estatus de entrega",
      "API bidireccional para conectar HubSpot, Salesforce, SAP y Tokko",
      "Métricas de absorción comercial y red de brokers afiliados",
    ],
    targetNav: "developers",
    yearIntroduced: "Año 4 – Ecosistema",
  },
];
