import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedBrands = {
  donsson: "DONSSON",
  partmo: "PARTMO",
};

const allowedTypes = new Set(["aceite", "aire", "cabina", "combustible", "separador", "hidraulico", "refrigerante"]);

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function filterShape(type) {
  switch (type) {
    case "cabina":
      return `<rect x="205" y="150" width="390" height="230" rx="16" fill="#f4c842" stroke="#1a1a1a" stroke-width="14"/>
        <g stroke="#fff4bc" stroke-width="8">${Array.from({ length: 18 }, (_, index) => `<path d="M${225 + index * 20} 160v210"/>`).join("")}</g>`;
    case "aire":
      return `<ellipse cx="400" cy="270" rx="165" ry="135" fill="#edb530" stroke="#1a1a1a" stroke-width="16"/>
        <ellipse cx="400" cy="270" rx="72" ry="55" fill="#282828"/>
        <g stroke="#fff0a7" stroke-width="9">${Array.from({ length: 14 }, (_, index) => `<path d="M${272 + index * 20} 170c35 55 35 125 0 200"/>`).join("")}</g>`;
    case "combustible":
      return `<path d="M330 130h140l35 70v200l-35 55H330l-35-55V200z" fill="#e7e7e7" stroke="#1a1a1a" stroke-width="16"/>
        <rect x="360" y="92" width="80" height="46" rx="8" fill="#333"/><path d="M400 245c-38 46 0 99 0 99s38-53 0-99z" fill="#2b9cd8"/>`;
    case "separador":
      return `<path d="M320 125h160l26 60v210l-40 60H334l-40-60V185z" fill="#f5f5f5" stroke="#1a1a1a" stroke-width="16"/>
        <rect x="340" y="300" width="120" height="65" rx="8" fill="#2c9ed8"/><path d="M400 225c-32 39 0 84 0 84s32-45 0-84z" fill="#2c9ed8"/>`;
    case "hidraulico":
      return `<path d="M315 125h170l30 65v210l-45 55H330l-45-55V190z" fill="#c5cbd0" stroke="#1a1a1a" stroke-width="16"/>
        <rect x="332" y="232" width="136" height="88" rx="8" fill="#2f79bd"/><path d="M355 275h90" stroke="#fff" stroke-width="10"/>`;
    case "refrigerante":
      return `<path d="M315 130h170l28 55v215l-43 55H330l-43-55V185z" fill="#f6f7f7" stroke="#1a1a1a" stroke-width="16"/>
        <rect x="327" y="235" width="146" height="90" rx="8" fill="#31a8df"/><path d="M350 280h100" stroke="#fff" stroke-width="10"/>`;
    default:
      return `<path d="M310 120h180l32 65v220l-48 55H326l-48-55V185z" fill="#34495e" stroke="#161616" stroke-width="16"/>
        <rect x="328" y="235" width="144" height="92" rx="8" fill="#e8b528"/><path d="M352 280h96" stroke="#202020" stroke-width="11"/>`;
  }
}

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const brand = allowedBrands[searchParams.get("brand")] || "FILTRO";
  const rawReference = searchParams.get("reference") || "REFERENCIA";
  const reference = rawReference.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 32) || "REFERENCIA";
  const requestedType = searchParams.get("type") || "aceite";
  const type = allowedTypes.has(requestedType) ? requestedType : "aceite";
  const typeLabel = {
    aceite: "FILTRO DE ACEITE",
    aire: "FILTRO DE AIRE",
    cabina: "FILTRO DE CABINA",
    combustible: "FILTRO DE COMBUSTIBLE",
    separador: "FILTRO SEPARADOR",
    hidraulico: "FILTRO HIDRÁULICO",
    refrigerante: "FILTRO REFRIGERANTE",
  }[type];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-labelledby="title description">
    <title id="title">${escapeXml(typeLabel)} ${escapeXml(reference)}</title>
    <desc id="description">Imagen de referencia para ${escapeXml(brand)} ${escapeXml(reference)}</desc>
    <rect width="800" height="600" fill="#ffffff"/>
    <rect x="32" y="30" width="736" height="540" rx="26" fill="#f6f6f6" stroke="#dedede" stroke-width="4"/>
    <text x="400" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="29" font-weight="700" fill="#202020">${escapeXml(brand)}</text>
    ${filterShape(type)}
    <text x="400" y="510" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#1e1e1e">${escapeXml(typeLabel)}</text>
    <text x="400" y="545" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" fill="#4c4c4c">REF. ${escapeXml(reference)} · Imagen de referencia</text>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
