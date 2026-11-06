import React, { useEffect, useState } from "react";

let cachedFullDataUrl: string | null = null;
let cachedIconDataUrl: string | null = null;
let cachedDarkIconDataUrl: string | null = null;

/**
 * Procesa `/project-atlas-logo.jpg` en un canvas offscreen para eliminar el fondo
 * cuadriculado gris/blanco y generar un PNG transparente nítido tanto del logo completo
 * como del isotipo ("A" arquitectónica con edificios).
 */
function processAtlasLogoImage(
  img: HTMLImageElement
): { fullUrl: string; iconUrl: string; darkIconUrl: string } {
  if (cachedFullDataUrl && cachedIconDataUrl && cachedDarkIconDataUrl) {
    return {
      fullUrl: cachedFullDataUrl,
      iconUrl: cachedIconDataUrl,
      darkIconUrl: cachedDarkIconDataUrl,
    };
  }

  const w = img.naturalWidth || 1024;
  const h = img.naturalHeight || 1024;

  // 1. Canvas completo sin fondo cuadriculado
  const fullCanvas = document.createElement("canvas");
  fullCanvas.width = w;
  fullCanvas.height = h;
  const ctx = fullCanvas.getContext("2d");

  if (!ctx) {
    return {
      fullUrl: "/project-atlas-logo.jpg",
      iconUrl: "/favicon.svg",
      darkIconUrl: "/favicon.svg",
    };
  }

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    const avg = (r + g + b) / 3;

    // El tablero de ajedrez de transparencia tiene píxeles neutros claros (gris #ebebeb a blanco #ffffff)
    if (maxDiff <= 14 && avg >= 218) {
      data[i + 3] = 0;
    } else if (maxDiff <= 18 && avg >= 204) {
      // Suavizado de bordes (anti-aliasing)
      const alphaFactor = Math.max(0, Math.min(1, (218 - avg) / 14));
      data[i + 3] = Math.round(data[i + 3] * alphaFactor);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Recortar márgenes vacíos para el logo completo (x: 18%..82%, y: 11%..91%)
  const cropFullX = Math.round(w * 0.18);
  const cropFullY = Math.round(h * 0.11);
  const cropFullW = Math.round(w * 0.64);
  const cropFullH = Math.round(h * 0.8);

  const trimmedFullCanvas = document.createElement("canvas");
  trimmedFullCanvas.width = cropFullW;
  trimmedFullCanvas.height = cropFullH;
  const trimmedFullCtx = trimmedFullCanvas.getContext("2d");
  trimmedFullCtx?.drawImage(
    fullCanvas,
    cropFullX,
    cropFullY,
    cropFullW,
    cropFullH,
    0,
    0,
    cropFullW,
    cropFullH
  );

  // 2. Canvas solo del isotipo superior (la "A" con rascacielos: x: 25%..75%, y: 11%..62%)
  const iconX = Math.round(w * 0.25);
  const iconY = Math.round(h * 0.11);
  const iconW = Math.round(w * 0.5);
  const iconH = Math.round(h * 0.51);

  const iconCanvas = document.createElement("canvas");
  iconCanvas.width = iconW;
  iconCanvas.height = iconH;
  const iconCtx = iconCanvas.getContext("2d");
  iconCtx?.drawImage(fullCanvas, iconX, iconY, iconW, iconH, 0, 0, iconW, iconH);

  // 3. Versión del isotipo optimizada para fondos oscuros (convierte el azul marino muy oscuro en plata/blanco manteniendo el cyan eléctrico)
  const darkIconCanvas = document.createElement("canvas");
  darkIconCanvas.width = iconW;
  darkIconCanvas.height = iconH;
  const darkCtx = darkIconCanvas.getContext("2d");
  if (darkCtx && iconCtx) {
    const iconImgData = iconCtx.getImageData(0, 0, iconW, iconH);
    const d = iconImgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const a = d[i + 3];
      if (a > 15) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        // Si es el azul marino profundo (#081b33) y no el cyan brillante
        if (b < 95 && g < 70 && r < 50) {
          d[i] = 242;
          d[i + 1] = 246;
          d[i + 2] = 252;
        }
      }
    }
    darkCtx.putImageData(iconImgData, 0, 0);
  }

  cachedFullDataUrl = trimmedFullCanvas.toDataURL("image/png");
  cachedIconDataUrl = iconCanvas.toDataURL("image/png");
  cachedDarkIconDataUrl = darkIconCanvas.toDataURL("image/png");

  return {
    fullUrl: cachedFullDataUrl,
    iconUrl: cachedIconDataUrl,
    darkIconUrl: cachedDarkIconDataUrl,
  };
}

interface AtlasBrandLogoProps {
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  className?: string;
}

export const AtlasBrandLogo: React.FC<AtlasBrandLogoProps> = ({
  variant = "icon",
  theme = "light",
  className = "h-10 w-auto",
}) => {
  const [urls, setUrls] = useState<{
    fullUrl: string;
    iconUrl: string;
    darkIconUrl: string;
  } | null>(
    cachedFullDataUrl && cachedIconDataUrl && cachedDarkIconDataUrl
      ? {
          fullUrl: cachedFullDataUrl,
          iconUrl: cachedIconDataUrl,
          darkIconUrl: cachedDarkIconDataUrl,
        }
      : null
  );

  useEffect(() => {
    if (urls) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const processed = processAtlasLogoImage(img);
        setUrls(processed);
      } catch {
        setUrls({
          fullUrl: "/project-atlas-logo.jpg",
          iconUrl: "/favicon.svg",
          darkIconUrl: "/favicon.svg",
        });
      }
    };
    img.onerror = () => {
      setUrls({
        fullUrl: "/project-atlas-logo.jpg",
        iconUrl: "/favicon.svg",
        darkIconUrl: "/favicon.svg",
      });
    };
    img.src = "/project-atlas-logo.jpg";
  }, [urls]);

  if (!urls) {
    return (
      <img
        src="/favicon.svg"
        alt="Proyecto Atlas — Real Estate Platform"
        className={className}
      />
    );
  }

  const src =
    variant === "full"
      ? urls.fullUrl
      : theme === "dark"
      ? urls.darkIconUrl
      : urls.iconUrl;

  return (
    <img
      src={src}
      alt="Proyecto Atlas — Real Estate Platform"
      className={`object-contain select-none ${className}`}
    />
  );
};
