import { siteUrl } from "@/lib/site";

export default function robots() {
  const baseUrl = siteUrl;

  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot", "DuckDuckBot", "OAI-SearchBot"],
        allow: ["/", "/catalogo", "/producto/", "/marcas/", "/radiadores", "/blog"],
        disallow: ["/admin/", "/api/", "/perfil", "/checkout", "/auth/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/perfil", "/checkout", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
