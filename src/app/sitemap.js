import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/site";
import { products as catalogProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const baseUrl = siteUrl;
  const now = new Date();

  // 1. Rutas estáticas principales y páginas informativas / legales
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
      url: `${baseUrl}/marcas/dynamik`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.82,
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
      priority: 0.85,
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

  // 2. Landing pages de categorías automotrices
  const knownCategorySlugs = new Set([
    "lubricantes",
    "filtros",
    "frenos-y-suspension",
    "radiadores",
    "lubricantes-gasolina",
    "transmision",
    "hidraulico",
    "coolant",
    "grasas-y-aditivos",
    "electrico-y-encendido",
  ]);

  for (const product of catalogProducts) {
    if (product.category?.slug) {
      knownCategorySlugs.add(product.category.slug);
    }
  }

  const categoryRoutes = Array.from(knownCategorySlugs).map((slug) => ({
    url: `${baseUrl}/catalogo?category=${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.88,
  }));

  // 3. Landing pages de marcas
  const brandMap = new Map();
  for (const product of catalogProducts) {
    if (product.brand?.slug && product.brand.slug !== "vanssoil") {
      brandMap.set(product.brand.slug, {
        url: `${baseUrl}/catalogo?brand=${product.brand.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // 4. Catálogo de productos completo (3.369 productos consolidados)
  const productMap = new Map();
  for (const product of catalogProducts) {
    if (product.slug) {
      const hasStock = Boolean(product.inStock && product.stock > 0);
      productMap.set(product.slug, {
        url: `${baseUrl}/producto/${product.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: hasStock ? 0.85 : 0.75,
      });
    }
  }

  // 5. Enriquecimiento / Unión con base de datos Prisma (si está disponible)
  try {
    const [dbBrands, dbProducts] = await Promise.all([
      prisma.brand.findMany({
        where: { slug: { not: "vanssoil" } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true, inStock: true, stock: true },
      }),
    ]);

    for (const b of dbBrands) {
      if (b.slug) {
        brandMap.set(b.slug, {
          url: `${baseUrl}/catalogo?brand=${b.slug}`,
          lastModified: b.updatedAt || now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    for (const p of dbProducts) {
      if (p.slug) {
        const hasStock = Boolean(p.inStock && (p.stock || 0) > 0);
        productMap.set(p.slug, {
          url: `${baseUrl}/producto/${p.slug}`,
          lastModified: p.updatedAt || now,
          changeFrequency: "weekly",
          priority: hasStock ? 0.85 : 0.75,
        });
      }
    }
  } catch (error) {
    // Si Prisma no está disponible en este entorno, el sitemap sirve con total éxito el catálogo consolidado
  }

  const brandRoutes = Array.from(brandMap.values());
  const productRoutes = Array.from(productMap.values());

  return [...staticRoutes, ...categoryRoutes, ...brandRoutes, ...productRoutes];
}
