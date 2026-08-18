import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LegacyProductRedirect({ params }) {
  const resolvedParams = await params;
  const idOrSlug = resolvedParams?.id;

  if (idOrSlug) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }, { sku: idOrSlug }],
      },
      select: { slug: true },
    });

    if (product?.slug) {
      redirect(`/producto/${product.slug}`);
    }
  }

  redirect("/catalogo");
}

