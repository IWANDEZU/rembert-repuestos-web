import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";

// Product data and truthful modification dates live in the production database.
// Generate this route at request time rather than baking an incomplete sitemap
// if the database is unavailable during a build.
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = siteUrl;

  // Rutas estáticas principales
  const staticRoutes = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/marcas`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nosotros`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Rutas dinámicas de productos desde la base de datos
  let productRoutes = [];
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    productRoutes = products.map((product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("Error al generar sitemap de productos:", error.message);
  }

  return [...staticRoutes, ...productRoutes];
}
