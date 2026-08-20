const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const isValidUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(rawSiteUrl || "");
const configuredSiteUrl = isValidUrl ? rawSiteUrl : "https://www.rembertrepuestos.com";

// Keep the canonical URL independent from NEXTAUTH_URL, which may point to an
// internal deployment URL used only by the authentication callback.
export const siteUrl = configuredSiteUrl.replace(/\/$/, "");
