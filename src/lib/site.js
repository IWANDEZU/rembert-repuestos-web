const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const isValidUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(rawSiteUrl || "");
const configuredSiteUrl = isValidUrl ? rawSiteUrl : "https://rembertrepuestos.com";

// Mantener la URL canónica independiente de NEXTAUTH_URL y normalizar el host
// al dominio canónico (rembertrepuestos.com) para evitar saltos 308 en sitemap y SEO.
export const siteUrl = configuredSiteUrl
  .replace(/\/$/, "")
  .replace("https://www.rembertrepuestos.com", "https://rembertrepuestos.com");
