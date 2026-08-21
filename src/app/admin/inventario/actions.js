'use server';

import { getServerSession } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function processInventoryCSV(data) {
  try {
    // 1. Verify user is ADMIN
    const session = await getServerSession();
    if (!session || session?.user?.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado. Se requiere cuenta de Administrador.' };
    }

    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, error: 'El archivo CSV está vacío o tiene un formato incorrecto.' };
    }

    const results = {
      total: data.length,
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    // Iterate over rows and update
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const sku = row.sku || row.SKU;
      const stockStr = row.stock || row.Stock || row.STOCK;
      const priceStr = row.price || row.Price || row.precio || row.Precio;

      if (!sku) {
        results.errorCount++;
        results.errors.push(`Fila ${i + 1}: SKU no proporcionado.`);
        continue;
      }

      const stock = parseInt(stockStr, 10);
      if (isNaN(stock) && stockStr !== undefined) {
        results.errorCount++;
        results.errors.push(`Fila ${i + 1} (SKU: ${sku}): Stock no válido (${stockStr}).`);
        continue;
      }

      let price = undefined;
      if (priceStr !== undefined && priceStr !== '') {
         price = parseFloat(priceStr);
         if(isNaN(price)) {
            price = undefined; // Don't fail the row, just don't update price if it's invalid, or maybe we want to fail it. Let's fail it.
            results.errorCount++;
            results.errors.push(`Fila ${i + 1} (SKU: ${sku}): Precio no válido (${priceStr}).`);
            continue;
         }
      }

      // Check if it's a Product
      const product = await prisma.product.findUnique({
        where: { sku: sku },
      });

      if (product) {
        const updateData = {};
        if (!isNaN(stock)) {
          updateData.stock = stock;
          updateData.inStock = stock > 0;
        }
        if (price !== undefined) {
          updateData.price = price;
        }

        try {
          await prisma.product.update({
            where: { id: product.id },
            data: updateData,
          });
          results.successCount++;
        } catch (error) {
          results.errorCount++;
          results.errors.push(`Fila ${i + 1} (SKU: ${sku}): Error actualizando producto.`);
        }
      } else {
        // Check if it's a Variant
        // Find first variant with that sku since Variant sku is not marked @unique in Prisma schema
        const variants = await prisma.variant.findMany({
          where: { sku: sku },
        });

        if (variants && variants.length > 0) {
           let updatedAny = false;
           for(const variant of variants) {
              const updateData = {};
              if (!isNaN(stock)) updateData.stock = stock;
              if (price !== undefined) updateData.price = price;

              try {
                await prisma.variant.update({
                  where: { id: variant.id },
                  data: updateData,
                });
                updatedAny = true;
              } catch (error) {
                 // ignore individual variant errors, we will catch it below if none updated
              }
           }
           if (updatedAny) {
             results.successCount++;
           } else {
              results.errorCount++;
              results.errors.push(`Fila ${i + 1} (SKU: ${sku}): Error actualizando variante(s).`);
           }
        } else {
           results.errorCount++;
           results.errors.push(`Fila ${i + 1} (SKU: ${sku}): SKU no encontrado como Producto ni como Variante.`);
        }
      }
    }

    return { success: true, results };

  } catch (error) {
    console.error('Error procesando CSV de inventario:', error);
    return { success: false, error: 'Ocurrió un error interno procesando el archivo.' };
  }
}
