require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

if (process.env.DATABASE_PRISMA_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_PRISMA_DATABASE_URL;
} else if (process.env.POSTGRES_PRISMA_URL) {
  process.env.DATABASE_URL = process.env.POSTGRES_PRISMA_URL;
} else if (process.env.DATABASE_POSTGRES_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_POSTGRES_URL;
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const brand = await prisma.brand.findUnique({ where: { slug: 'vanssoil' } });
    if (!brand) {
      console.log('Vanssoil brand not found.');
      return;
    }
    
    // Check if products have orders
    const products = await prisma.product.findMany({
      where: { brandId: brand.id },
      include: { orderItems: true }
    });
    
    let hasOrders = false;
    for (const p of products) {
      if (p.orderItems.length > 0) {
        hasOrders = true;
        break;
      }
    }
    
    if (hasOrders) {
      console.log('Products have orders. Deactivating products instead of deleting.');
      await prisma.product.updateMany({
        where: { brandId: brand.id },
        data: { isActive: false }
      });
    } else {
      console.log('No orders found. Deleting products and brand.');
      // Delete product images first to be safe (no cascade on ProductImage?)
      // Wait, ProductImage has onDelete: Cascade
      await prisma.product.deleteMany({
        where: { brandId: brand.id }
      });
      await prisma.brand.delete({
        where: { id: brand.id }
      });
    }
    console.log('Success.');
  } catch (error) {
    console.error(error);
  }
}

main().finally(() => prisma.$disconnect());
