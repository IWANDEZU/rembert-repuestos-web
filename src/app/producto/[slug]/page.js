import { notFound } from "next/navigation";
import { cache } from "react";
import ProductVariantSelector from "@/components/ProductVariantSelector";
import CatalogSidebar from "@/components/CatalogSidebar";
import { siteUrl } from "@/lib/site";
import { getDynamikCatalogGallery, getProductDisplayImage, isDynamikProduct } from "@/lib/productImage";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

const baseUrl = siteUrl;

const databaseUrl = process.env.DATABASE_URL || "";
const hasDirectPostgresConnection =
  (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) &&
  !databaseUrl.includes("[SENSITIVE]");

const getProduct = cache(async (slug) => {
  let product = null;
  if (hasDirectPostgresConnection) {
    try {
      const { prisma } = await import("@/lib/prisma");
      product = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          brand: true,
          images: true,
          variants: true,
          attributes: true,
        },
      });
    } catch {
      product = null;
    }
  }

  if (product) return product;

  const fallbackProduct = getProductById(slug);
  return fallbackProduct
    ? { ...fallbackProduct, variants: fallbackProduct.variants || [], attributes: fallbackProduct.attributes || [] }
    : null;
});

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) return { title: "Producto no encontrado" };

  const imageUrl = getProductDisplayImage(product);
  const description =
    product.description ||
    product.shortDesc ||
    `Compra ${product.name} en REMBERT, Barrancabermeja. Envíos a toda Colombia.`;

  const openGraph = {
    title: `${product.name} | REMBERT`,
    description,
    url: `${baseUrl}/producto/${product.slug}`,
    siteName: "REMBERT",
    type: "website",
  };
  if (imageUrl) {
    openGraph.images = [{ url: imageUrl, width: 800, height: 800, alt: product.name }];
  }

  const twitter = {
    card: "summary_large_image",
    title: product.name,
    description,
  };
  if (imageUrl) twitter.images = [imageUrl];

  return {
    title: product.name,
    description,
    keywords: [
      product.name,
      product.brand?.name || "REMBERT",
      product.category?.name || "Repuestos",
      "Barrancabermeja",
      "Colombia",
    ],
    alternates: {
      canonical: `/producto/${product.slug}`,
    },
    openGraph,
    twitter,
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const toAbsoluteUrl = (url) => new URL(url || "/logo.png", baseUrl).toString();
  const displayImage = getProductDisplayImage(product);
  const imageUrls = isDynamikProduct(product)
    ? getDynamikCatalogGallery(product).map((image) => toAbsoluteUrl(image.url))
    : product.images?.length
    ? product.images.map((image) => toAbsoluteUrl(image.url))
    : [toAbsoluteUrl(displayImage)];
  const productUrl = `${baseUrl}/producto/${product.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Catálogo",
        "item": `${baseUrl}/catalogo`,
      },
      ...(product.category ? [
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.category.name,
          "item": `${baseUrl}/catalogo?category=${product.category.slug}`,
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": product.name,
          "item": productUrl,
        }
      ] : [
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": productUrl,
        }
      ])
    ],
  };

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": product.name,
    "url": productUrl,
    "image": imageUrls,
    "description": product.description || product.shortDesc || `Compra ${product.name} en REMBERT, Barrancabermeja.`,
    "sku": product.sku || product.id,
    "category": product.category?.name || "Repuestos automotrices",
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "REMBERT",
    },
    "additionalProperty": (product.attributes || []).map((attribute) => ({
      "@type": "PropertyValue",
      "name": attribute.name,
      "value": attribute.value,
    })),
  };

  if (product.price > 0) {
    productJsonLd.offers = {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "COP",
      "price": product.price.toFixed(0),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "AutoPartsStore",
        "name": "REMBERT",
        "url": baseUrl,
      },
    };
  }

  const structuredData = [productJsonLd, breadcrumbJsonLd];

  const categoryParam = product.category ? product.category.slug : undefined;
  const brandParam = product.brand ? product.brand.slug : undefined;

  return (
    <main className="main-container section catalog-layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <CatalogSidebar categoryParam={categoryParam} brandParam={brandParam} />
      <div className="catalog-content">
        <ProductVariantSelector product={product} />
      </div>
    </main>
  );
}
