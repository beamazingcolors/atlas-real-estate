# ATLAS REAL ESTATE — Plataforma PropTech Integral (México)

Arquitectura modular para el mercado inmobiliario mexicano bajo **Next.js (App Router)**, **TypeScript estricto (`noImplicitAny: true`)**, **Prisma ORM (PostgreSQL)**, **Zod** y sistema de diseño **Bento Grid Editorial Suizo**.

## Pilares Operativos

1. **Inventario Maestro de Desarrolladores (`/modules/inventory`)**:
   - Jerarquía relacional: `Development` → `Phase` → `Typology` → `Unit` (`AVAILABLE`, `RESERVED`, `BLOCKED`, `UNDER_CONTRACT`, `SOLD`).
   - Simulación y emisión de cotizaciones formales (`QuotationService`) bajo esquemas mexicanos de preventa (Enganche + Mensualidades en obra + Liquidación contra escrituración en `MXN`).
   - Bloqueo atómico transaccional (`ReservationService`) con ventana SPEI de 48 horas.
2. **CRM Comercial y Pipeline de Negociaciones (`/modules/crm`)**:
   - Tablero Kanban ortogonal de 9 etapas (`PROSPECT` → `CLOSED_WON` / `CLOSED_LOST`), cálculo de Forecast Ponderado en `MXN` y sincronización bidireccional con el estatus de unidades en el Inventario Maestro.
3. **Motor de Inteligencia y Valuación Inmobiliaria (`/modules/ai-engine`)**:
   - Homologación econométrica de testigos comparables por elasticidad de superficie $(A_s/A_t)^{-0.12}$, estado de conservación y distancia geodésica, con proyecciones de plusvalía a 3 y 5 años, Cap Rate y ROI.
4. **Marketplace Editorial B2B/B2C (`/modules/marketplace`)**:
   - Buscador paramétrico, matriz comparativa lado a lado (hasta 3 desarrollos), indexación SEO estructurada (`Schema.org/RealEstateListing` JSON-LD) y conversión directa al pipeline del CRM.

## Estructura del Proyecto

```text
├── prisma/
│   └── schema.prisma
└── src/
    ├── core/
    │   ├── db/prisma.ts
    │   └── utils/currency.ts
    ├── modules/
    │   ├── inventory/
    │   ├── crm/
    │   ├── ai-engine/
    │   └── marketplace/
    └── app/
        └── (dashboard)/
            ├── layout.tsx
            ├── inventory/page.tsx
            ├── crm/page.tsx
            ├── valuations/page.tsx
            └── marketplace/page.tsx
```
