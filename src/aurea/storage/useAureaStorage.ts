import { useCallback, useEffect, useState } from "react";
import { CurrencyCode } from "../types";

const memoryFallbackVault = new Map<string, string>();

export const CURRENCY_RATES: Record<
  CurrencyCode,
  { rate: number; symbol: string; locale: string }
> = {
  USD: { rate: 1, symbol: "$", locale: "en-US" },
  MXN: { rate: 20.15, symbol: "$", locale: "es-MX" },
  EUR: { rate: 0.92, symbol: "€", locale: "de-DE" },
};

export function formatSovereignCurrency(
  amountUsd: number,
  currency: CurrencyCode,
  compact = false
): string {
  const cfg = CURRENCY_RATES[currency];
  const converted = amountUsd * cfg.rate;

  if (compact && converted >= 1_000_000) {
    return `${cfg.symbol}${(converted / 1_000_000).toFixed(2)}M ${currency}`;
  }

  return `${cfg.symbol}${Math.round(converted).toLocaleString(cfg.locale)} ${currency}`;
}

export function sanitizeSovereignInput(raw: string): {
  clean: string;
  hadInjectionAttempt: boolean;
} {
  const injectionPattern =
    /<script\b[^>]*>([\s\S]*?)<\/script>|javascript:|onerror\s*=|onload\s*=|<iframe|DROP\s+TABLE|UNION\s+SELECT/gi;
  const hadInjectionAttempt = injectionPattern.test(raw);
  const clean = raw
    .replace(injectionPattern, "[BLOQUEADO]")
    .replace(/[<>]/g, "")
    .trim();

  return { clean, hadInjectionAttempt };
}

export function usePersistentState<T>(
  storageKey: string,
  initialValue: T
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw =
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage.getItem(storageKey)
          : memoryFallbackVault.get(storageKey) ?? null;
      if (raw !== null) {
        return JSON.parse(raw) as T;
      }
    } catch {
      const fallback = memoryFallbackVault.get(storageKey);
      if (fallback) {
        try {
          return JSON.parse(fallback) as T;
        } catch {
          return initialValue;
        }
      }
    }
    return initialValue;
  });

  useEffect(() => {
    const serialized = JSON.stringify(state);
    memoryFallbackVault.set(storageKey, serialized);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(storageKey, serialized);
      }
    } catch {
      // Respaldo en memoria activo si localStorage excede cuota o está restringido
    }
  }, [storageKey, state]);

  const setPersistentState = useCallback((updater: T | ((prev: T) => T)) => {
    setState((prev) =>
      typeof updater === "function"
        ? (updater as (p: T) => T)(prev)
        : updater
    );
  }, []);

  return [state, setPersistentState];
}
