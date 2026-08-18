import { siteUrl } from "@/lib/site";

export default function robots() {
  const baseUrl = siteUrl;

  return {
    rules: [
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/perfil", "/checkout"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
