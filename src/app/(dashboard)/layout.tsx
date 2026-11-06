import React from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  { code: "01", label: "INVENTARIO MAESTRO", href: "/inventory", active: true },
  { code: "02", label: "PIPELINE CRM & DEALS", href: "/crm", active: false },
  { code: "03", label: "MOTOR DE VALUACIÓN IA", href: "/valuations", active: false },
  { code: "04", label: "MARKETPLACE EDITORIAL", href: "/marketplace", active: false },
] as const;

export default function DashboardEditorialLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 antialiased selection:bg-neutral-950 selection:text-white">
      {/* BARRA SUPERIOR TÉCNICA ORTOGONAL (SIN AUTHSTATUS.DOT NI DEGRADADOS) */}
      <header className="sticky top-0 z-30 grid h-14 grid-cols-12 border-b border-neutral-900 bg-white">
        <div className="col-span-3 flex items-center justify-between border-r border-neutral-900 px-5">
          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xs font-bold tracking-[0.22em] text-neutral-950">
              ATLAS // RE
            </span>
            <span className="border border-neutral-900 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-900">
              MX-CORE v1.0
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
            CDMX · TULUM · MTY
          </span>
        </div>

        <div className="col-span-6 flex items-center justify-between border-r border-neutral-900 px-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
              DESARROLLO ACTIVO
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-950">
              MONOLITO POLANCO V — TORRE PONIENTE & ORIENTE
            </span>
          </div>
          <div className="border border-neutral-300 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-800">
            MONEDA BASE: MXN
          </div>
        </div>

        {/* BLOQUE DE SESIÓN SOBRIO (PROHIBIDO AUTHSTATUSDOT Y AVATARES REDONDEADOS) */}
        <div className="col-span-3 flex items-center justify-between px-5">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-500">
              MESA COMERCIAL
            </span>
            <span className="text-xs font-semibold tracking-tight text-neutral-950">
              ALEXIS GARZÓN — DIRECTOR COMERCIAL
            </span>
          </div>
          <div className="border border-neutral-900 bg-neutral-950 px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-widest text-white">
            ROL: DIRECTOR
          </div>
        </div>
      </header>

      {/* ESTRUCTURA PRINCIPAL: SIDEBAR EDITORIAL + LIENZO BENTO */}
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-12">
        <aside className="col-span-2 flex flex-col justify-between border-r border-neutral-900 bg-white">
          <nav className="divide-y divide-neutral-200 border-b border-neutral-200">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.code}
                href={item.href}
                className={`group flex items-center justify-between px-5 py-4 transition-colors ${
                  item.active
                    ? "bg-neutral-950 text-white"
                    : "bg-white text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[11px] ${
                      item.active ? "text-neutral-400" : "text-neutral-400"
                    }`}
                  >
                    {item.code}
                  </span>
                  <span className="font-mono text-xs font-semibold tracking-[0.12em]">
                    {item.label}
                  </span>
                </div>
                <span className="font-mono text-xs">→</span>
              </Link>
            ))}
          </nav>

          {/* BLOQUE TÉCNICO INFERIOR DE CUMPLIMIENTO NOM-247-SE-2021 */}
          <div className="border-t border-neutral-900 bg-neutral-50 p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-900">
              NORMATIVA COMERCIAL MX
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
              Cotizaciones expresadas en Pesos Mexicanos (MXN) conforme a lineamientos
              NOM-247-SE-2021. Precios sujetos a disponibilidad atómica en inventario.
            </p>
          </div>
        </aside>

        <main className="col-span-10 bg-neutral-100 p-6">{children}</main>
      </div>
    </div>
  );
}
