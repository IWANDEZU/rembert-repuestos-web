const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Agregando marca KIXX...')
  
  // Buscar categorías
  let catGasolina = await prisma.category.findUnique({ where: { slug: 'lubricantes-gasolina' } })
  let catDiesel = await prisma.category.findUnique({ where: { slug: 'lubricantes-diesel' } })

  if (!catGasolina || !catDiesel) {
    console.error('Categorías no encontradas. Asegúrate de que las categorías existen.')
    process.exit(1)
  }

  // Crear marca KIXX
  const brandKixx = await prisma.brand.upsert({
    where: { slug: 'kixx' },
    update: {},
    create: { name: 'KIXX', slug: 'kixx' }
  })

  console.log('Agregando productos KIXX...')

  // Producto Autos
  await prisma.product.upsert({
    where: { slug: 'kixx-g1-10w40' },
    update: {},
    create: {
      name: 'Aceite Motor Kixx G1 10W-40',
      slug: 'kixx-g1-10w40',
      description: 'Aceite de motor semisintético de alta calidad para vehículos a gasolina. Proporciona protección avanzada y rendimiento confiable.',
      shortDesc: 'Aceite semisintético para motor a gasolina',
      price: 0,
      sku: 'KIXX-G1-10W40',
      categoryId: catGasolina.id,
      brandId: brandKixx.id,
      images: { create: [{ url: '/cuarto.webp', isMain: true }] },
      variants: {
        create: [
          { name: 'Cuarto', price: 0, stock: 10, sku: 'KIXX-G1-10W40-CTO' },
          { name: 'Galón', price: 0, stock: 5, sku: 'KIXX-G1-10W40-GAL' }
        ]
      }
    }
  })

  // Producto Camiones
  await prisma.product.upsert({
    where: { slug: 'kixx-hd1-15w40' },
    update: {},
    create: {
      name: 'Aceite Motor Kixx HD1 15W-40 CI-4',
      slug: 'kixx-hd1-15w40',
      description: 'Aceite para motores diésel de trabajo pesado, formulado para camiones y tractomulas. Alta protección contra el desgaste.',
      shortDesc: 'Aceite pesado para motor diésel (Camiones)',
      price: 0,
      sku: 'KIXX-HD1-15W40',
      categoryId: catDiesel.id,
      brandId: brandKixx.id,
      images: { create: [{ url: '/balde-negro.webp', isMain: true }] },
      variants: {
        create: [
          { name: 'Balde', price: 0, stock: 8, sku: 'KIXX-HD1-15W40-BALDE' },
          { name: 'Tambor', price: 0, stock: 2, sku: 'KIXX-HD1-15W40-TAMBOR' }
        ]
      }
    }
  })

  console.log('¡Productos KIXX agregados correctamente!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
