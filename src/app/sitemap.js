import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = siteUrl;
  const now = new Date();

  // Rutas estáticas principales y páginas informativas / legales
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalogo`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/marcas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/servicio-tecnico`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/radiadores`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/politica-privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos-y-condiciones`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/eliminar-datos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Landing pages de categorías principales
  const categorySlugs = [
    "lubricantes",
    "filtros",
    "frenos-y-suspension",
    "radiadores",
    "lubricantes-gasolina",
    "transmision",
    "hidraulico",
    "coolant",
    "grasas-y-aditivos",
  ];

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${baseUrl}/catalogo?category=${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // Rutas dinámicas de marcas y productos desde la base de datos
  let brandRoutes = [];
  let productRoutes = [];

  try {
    const [brands, products] = await Promise.all([
      prisma.brand.findMany({
        where: { slug: { not: "vanssoil" } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    brandRoutes = brands.map((b) => ({
      url: `${baseUrl}/catalogo?brand=${b.slug}`,
      lastModified: b.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    productRoutes = products.map((product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: product.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.warn("Advertencia al consultar base de datos para sitemap:", error.message);
  }

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
