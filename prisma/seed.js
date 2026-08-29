const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seeder...')

  if (process.env.NODE_ENV === 'production') {
    throw new Error('El seeder está bloqueado en producción.');
  }

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;
  if (!adminPassword || !customerPassword) {
    throw new Error('Configura SEED_ADMIN_PASSWORD y SEED_CUSTOMER_PASSWORD en el entorno local antes de ejecutar el seeder.');
  }

  // Limpiar BD (opcional en desarrollo)
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.review.deleteMany()
  await prisma.favorite.deleteMany()
  await prisma.productAttribute.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.category.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // 1. Crear usuario Admin
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10)
  const adminUser = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@rembertrepuestos.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  })
  console.log(`👤 Admin creado: ${adminUser.email}`)

  // 2. Crear usuario cliente de prueba
  const hashedUserPassword = await bcrypt.hash(customerPassword, 10)
  const customerUser = await prisma.user.create({
    data: {
      name: 'Cliente Prueba',
      email: 'cliente@rembertrepuestos.com',
      password: hashedUserPassword,
      role: 'USER',
    },
  })
  console.log(`👤 Cliente creado: ${customerUser.email}`)

  // 3. Categorías
  const catDiesel = await prisma.category.create({
    data: { name: 'Lubricantes Diésel', slug: 'lubricantes-diesel', description: 'Aceites para motor diésel' }
  })
  const catMaquinaria = await prisma.category.create({
    data: { name: 'Maquinaria Pesada y Diésel', slug: 'maquinaria-pesada', description: 'Aceites, filtros y lubricantes para camiones, tractomulas y maquinaria de línea amarilla', image: '/maquinaria.png' }
  })
  const catGasolina = await prisma.category.create({
    data: { name: 'Lubricantes Gasolina', slug: 'lubricantes-gasolina', description: 'Aceites para motor a gasolina' }
  })
  const catFiltros = await prisma.category.create({
    data: { name: 'Filtros', slug: 'filtros', description: 'Filtros de aceite, aire y combustible' }
  })
  const catTransmision = await prisma.category.create({
    data: { name: 'Aceite Motor Transmisión', slug: 'transmision', description: 'Aceites para engranajes y transmisión' }
  })
  const catCoolant = await prisma.category.create({
    data: { name: 'Coolant Motor', slug: 'coolant', description: 'Refrigerantes y anticongelantes' }
  })
  const catFrenos = await prisma.category.create({
    data: { name: 'Líquido de Frenos', slug: 'liquido-frenos', description: 'Fluidos para sistemas de frenos' }
  })
  const catFrenosSuspension = await prisma.category.create({
    data: { name: 'Frenos y Suspensión', slug: 'frenos-y-suspension', description: 'Pastillas de freno, discos, amortiguadores y partes de suspensión' }
  })
  const catHidraulico = await prisma.category.create({
    data: { name: 'Aceite Hidráulico', slug: 'hidraulico', description: 'Fluidos para sistemas hidráulicos' }
  })
  const catUrea = await prisma.category.create({
    data: { name: 'Urea Automotriz', slug: 'urea', description: 'Aditivo AdBlue / DEF' }
  })
  const catSiliconas = await prisma.category.create({
    data: { name: 'Siliconas y Sellantes', slug: 'siliconas', description: 'Siliconas RTV, sellantes adhesivos y formadores de empaques para motor y carrocería' }
  })

  // 4. Marcas
  const brandShell = await prisma.brand.create({ data: { name: 'Shell', slug: 'shell' } })
  const brandMobil = await prisma.brand.create({ data: { name: 'Mobil', slug: 'mobil' } })
  const brandCastrol = await prisma.brand.create({ data: { name: 'Castrol', slug: 'castrol' } })
  const brandTerpel = await prisma.brand.create({ data: { name: 'Terpel', slug: 'terpel' } })
  const brandChevron = await prisma.brand.create({ data: { name: 'Chevron', slug: 'chevron' } })
  const brandLiquiMoly = await prisma.brand.create({ data: { name: 'Liqui Moly', slug: 'liqui-moly' } })
  const brandBosch = await prisma.brand.create({ data: { name: 'Bosch', slug: 'bosch' } })
  const brandBlueTec = await prisma.brand.create({ data: { name: 'BlueTec', slug: 'bluetec' } })
  const brandWix = await prisma.brand.create({ data: { name: 'WIX Filters', slug: 'wix' } })
  const brandMazda = await prisma.brand.create({ data: { name: 'Mazda Original', slug: 'mazda' } })
  const brandCoexito = await prisma.brand.create({ data: { name: 'Coéxito', slug: 'coexito' } })
  const brandGlobalOil = await prisma.brand.create({ data: { name: 'Global Oil', slug: 'global-oil' } })
  const brandMaxPower = await prisma.brand.create({ data: { name: 'Max Power', slug: 'max-power' } })
  const brandPetroil = await prisma.brand.create({ data: { name: 'Petroil', slug: 'petroil' } })
  const brandVanssoil = await prisma.brand.create({ data: { name: 'Vanssoil', slug: 'vanssoil' } })
  const brandLubrisol = await prisma.brand.create({ data: { name: 'Lubrisol', slug: 'lubrisol' } })
  const brandACDelco = await prisma.brand.create({ data: { name: 'ACDelco', slug: 'acdelco' } })
  const brandGabriel = await prisma.brand.create({ data: { name: 'Gabriel', slug: 'gabriel' } })
  const brandIncolbest = await prisma.brand.create({ data: { name: 'Incolbest', slug: 'incolbest' } })
  const brandDonsson = await prisma.brand.create({ data: { name: 'Filtros Donsson', slug: 'donsson' } })
  const brandValvoline = await prisma.brand.create({ data: { name: 'Valvoline', slug: 'valvoline' } })
  const brandMotorcraft = await prisma.brand.create({ data: { name: 'Motorcraft', slug: 'motorcraft' } })
  const brandCaterpillar = await prisma.brand.create({ data: { name: 'Caterpillar (CAT)', slug: 'caterpillar' } })
  const brandLoctite = await prisma.brand.create({ data: { name: 'Loctite', slug: 'loctite' } })

  // 5. Productos y Variantes
  const p1 = await prisma.product.create({
    data: {
      name: 'Shell Rimula R4 X 15W-40',
      slug: 'shell-rimula-r4-x-15w40',
      description: 'Aceite de motor de trabajo pesado para diésel.',
      shortDesc: 'Aceite mineral 15W-40',
      price: 120000,
      comparePrice: 135000,
      cost: 90000,
      sku: 'SHL-R4X-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandShell.id,
      images: {
        create: [
          { url: '/14_shell_rimula_r4x_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Tipo', value: 'Mineral' }
        ]
      },
      variants: {
        create: [
          { name: 'Galón', price: 120000, stock: 50, sku: 'SHL-R4X-15W40-GL' },
          { name: 'Cuarto', price: 35000, stock: 100, sku: 'SHL-R4X-15W40-QT' }
        ]
      }
    }
  })

  // Mobil 15W-40 en todas las presentaciones
  const p2_1 = await prisma.product.create({
    data: {
      name: 'Mobil Delvac 1300 Super 15W-40',
      slug: 'mobil-delvac-1300-super-15w40',
      description: 'Aceite mineral premium de alto desempeño para motores diésel de trabajo pesado en camiones, tractomulas, buses y maquinaria de construcción. Cumple especificaciones API CK-4/CJ-4/CI-4 Plus y normas de fabricantes líderes. Excelente protección contra desgaste, depósitos y oxidación.',
      shortDesc: 'Aceite Diésel Multigrado 15W-40 API CK-4',
      price: 145000,
      comparePrice: 160000,
      cost: 110000,
      sku: 'MBL-DEL-1300-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CK-4 / CJ-4 / CI-4 Plus' },
          { name: 'Tipo de Aceite', value: 'Mineral Premium' },
          { name: 'Aplicación', value: 'Motores Diésel de Trabajo Pesado y Maquinaria' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 38000, stock: 120, sku: 'MBL-1300-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 145000, stock: 60, sku: 'MBL-1300-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 680000, stock: 15, sku: 'MBL-1300-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5800000, stock: 5, sku: 'MBL-1300-15W40-55G' }
        ]
      }
    }
  })

  const p2_2 = await prisma.product.create({
    data: {
      name: 'Mobil Delvac MX 15W-40',
      slug: 'mobil-delvac-mx-15w40',
      description: 'Aceite para motores diésel de extra alto rendimiento que proporciona excelente lubricación en motores modernos turbocargados. Protección superior contra espesamiento por hollín y la fricción extrema. API CI-4/CH-4/SL.',
      shortDesc: 'Aceite Diésel Extra Performance 15W-40 API CI-4',
      price: 140000,
      comparePrice: 155000,
      cost: 105000,
      sku: 'MBL-DEL-MX-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CI-4 / CH-4 / SL' },
          { name: 'Tipo de Aceite', value: 'Mineral de Alto Rendimiento' },
          { name: 'Aplicación', value: 'Motores Diésel Turbocargados y Flotas Mixtas' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 36000, stock: 100, sku: 'MBL-MX-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 140000, stock: 50, sku: 'MBL-MX-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 650000, stock: 20, sku: 'MBL-MX-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5500000, stock: 4, sku: 'MBL-MX-15W40-55G' }
        ]
      }
    }
  })

  const p2_3 = await prisma.product.create({
    data: {
      name: 'Mobil Delvac Legend 15W-40 Heavy Duty',
      slug: 'mobil-delvac-legend-15w40',
      description: 'Formulación resistente y probada en campo para el uso en flotas de transporte pesado, maquinaria agrícola y de construcción. Mantiene limpios los componentes internos del motor y extiende el tiempo de servicio.',
      shortDesc: 'Aceite Confiable Trabajo Pesado 15W-40',
      price: 130000,
      comparePrice: 145000,
      cost: 98000,
      sku: 'MBL-DEL-LGD-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CH-4 / CG-4 / SJ' },
          { name: 'Tipo de Aceite', value: 'Mineral Multigrado Confiable' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 34000, stock: 80, sku: 'MBL-LGD-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 130000, stock: 45, sku: 'MBL-LGD-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 620000, stock: 12, sku: 'MBL-LGD-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5200000, stock: 3, sku: 'MBL-LGD-15W40-55G' }
        ]
      }
    }
  })

  const p2_4 = await prisma.product.create({
    data: {
      name: 'Mobil Delvac Extreme 15W-40 Synthetic Blend',
      slug: 'mobil-delvac-extreme-15w40',
      description: 'Aceite semisintético de desempeño extremo para motores diésel modernos que operan en temperaturas elevadas y terrenos difíciles. Brinda máxima protección contra la corrosión y desgaste por abrasión. API CK-4.',
      shortDesc: 'Aceite Semisintético Diésel 15W-40 API CK-4',
      price: 165000,
      comparePrice: 180000,
      cost: 125000,
      sku: 'MBL-DEL-EXT-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CK-4 / CJ-4' },
          { name: 'Tipo de Aceite', value: 'Semisintético (Synthetic Blend)' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 42000, stock: 90, sku: 'MBL-EXT-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 165000, stock: 30, sku: 'MBL-EXT-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 780000, stock: 10, sku: 'MBL-EXT-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6400000, stock: 2, sku: 'MBL-EXT-15W40-55G' }
        ]
      }
    }
  })

  const p2_5_delvac = await prisma.product.create({
    data: {
      name: 'Mobil Delvac Modern 15W-40',
      slug: 'mobil-delvac-modern-15w40',
      description: 'Aceite de tecnología de síntesis para motores diésel modernos de alto rendimiento. Extiende la vida útil de los sistemas de tratamiento de gases de escape DPF y SCR. API CK-4 / CJ-4.',
      shortDesc: 'Aceite Tecnología Sintética Diésel 15W-40',
      price: 148000,
      comparePrice: 165000,
      cost: 112000,
      sku: 'MBL-DEL-MOD-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CK-4 / CJ-4 / SN' },
          { name: 'Tipo de Aceite', value: 'Tecnología Sintética (Synthetic Technology)' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 39000, stock: 100, sku: 'MBL-MOD-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 148000, stock: 55, sku: 'MBL-MOD-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 700000, stock: 14, sku: 'MBL-MOD-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5900000, stock: 4, sku: 'MBL-MOD-15W40-55G' }
        ]
      }
    }
  })

  const p2_6_delvac = await prisma.product.create({
    data: {
      name: 'Mobil Delvac 1 ESP 5W-40 100% Sintético',
      slug: 'mobil-delvac-1-esp-5w40',
      description: 'Aceite 100% sintético de supremo rendimiento para motores diésel de trabajo pesado. Proporciona protección excepcional contra el desgaste a altas temperaturas, ahorra combustible y garantiza máxima fluidez en arranques en frío. API CK-4 / CJ-4.',
      shortDesc: 'Aceite 100% Sintético Diésel 5W-40 API CK-4',
      price: 185000,
      comparePrice: 205000,
      cost: 140000,
      sku: 'MBL-DEL-1ESP-5W40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '5W-40' },
          { name: 'Norma API', value: 'API CK-4 / CJ-4 / CI-4 Plus / SN' },
          { name: 'Tipo de Aceite', value: '100% Sintético (Full Synthetic)' },
          { name: 'Aplicación', value: 'Motores Diésel Carga Pesada en Clima Extremo y Flotas' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 48000, stock: 60, sku: 'MBL-1ESP-5W40-QT' },
          { name: 'Galón (3.785 L)', price: 185000, stock: 30, sku: 'MBL-1ESP-5W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 880000, stock: 8, sku: 'MBL-1ESP-5W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 7200000, stock: 2, sku: 'MBL-1ESP-5W40-55G' }
        ]
      }
    }
  })

  const p2_7_delvac = await prisma.product.create({
    data: {
      name: 'Mobil Delvac Legend 40 Monogrado SAE 40',
      slug: 'mobil-delvac-legend-40-sae40',
      description: 'Aceite monogrado para motores diésel de trabajo pesado en camiones tradicionales, buses urbanos, maquinaria agrícola e instalaciones estacionarias. API CF / SF.',
      shortDesc: 'Aceite Monogrado Diésel SAE 40 API CF',
      price: 115000,
      comparePrice: 130000,
      cost: 85000,
      sku: 'MBL-DEL-LGD-SAE40',
      categoryId: catMaquinaria.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: 'SAE 40 (Monogrado)' },
          { name: 'Norma API', value: 'API CF / SF' },
          { name: 'Tipo de Aceite', value: 'Mineral Monogrado Confiable' },
          { name: 'Aplicación', value: 'Motores Diésel Tradicionales, Buses y Tractores' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 30000, stock: 100, sku: 'MBL-LGD40-QT' },
          { name: 'Galón (3.785 L)', price: 115000, stock: 50, sku: 'MBL-LGD40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 530000, stock: 12, sku: 'MBL-LGD40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 4400000, stock: 3, sku: 'MBL-LGD40-55G' }
        ]
      }
    }
  })

  const p2_5 = await prisma.product.create({
    data: {
      name: 'Mobil Super 1000 15W-40 Gasolina',
      slug: 'mobil-super-1000-15w40',
      description: 'Aceite mineral multiviscoso de alta calidad formulado para brindar protección comprobada a motores a gasolina de vehículos particulares y comerciales ligeros. API SP / SN Plus.',
      shortDesc: 'Aceite Mineral Gasolina 15W-40 API SP',
      price: 125000,
      comparePrice: 140000,
      cost: 92000,
      sku: 'MBL-SUP-1000-15W40',
      categoryId: catGasolina.id,
      brandId: brandMobil.id,
      images: {
        create: [
          { url: '/16_mobil_delvac_1300_super_15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'API SP / SN Plus' },
          { name: 'Tipo de Aceite', value: 'Mineral Premium Gasolina' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 32000, stock: 150, sku: 'MBL-SUP-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 125000, stock: 70, sku: 'MBL-SUP-15W40-GL' },
          { name: 'Garrafa (5 L / 1.32 Gal)', price: 150000, stock: 25, sku: 'MBL-SUP-15W40-5L' }
        ]
      }
    }
  })


  const p3 = await prisma.product.create({
    data: {
      name: 'Terpel Maxter 15W-40',
      slug: 'terpel-maxter-15w40',
      description: 'Aceite de motor diésel altamente resistente, ideal para trabajo pesado en flotas y maquinaria.',
      shortDesc: 'Aceite Mineral 15W-40',
      price: 110000,
      sku: 'TRP-MAX-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandTerpel.id,
      images: {
        create: [
          { url: '/11_terpel_ultrek_15w40_multigrado.png', isMain: true }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto', price: 30000, stock: 150 },
          { name: 'Galón', price: 110000, stock: 80 },
          { name: 'Caneca (5 Gal)', price: 500000, stock: 10 },
          { name: 'Tambor (55 Gal)', price: 4500000, stock: 2 }
        ]
      }
    }
  })

  const p4 = await prisma.product.create({
    data: {
      name: 'Castrol GTX 20W-50',
      slug: 'castrol-gtx-20w50',
      description: 'Protección superior contra los lodos del motor. Ideal para motores a gasolina con alto kilometraje.',
      shortDesc: 'Aceite Mineral 20W-50',
      price: 130000,
      sku: 'CST-GTX-20W50',
      categoryId: catGasolina.id,
      brandId: brandCastrol.id,
      images: {
        create: [
          { url: '/castrol.png', isMain: true }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto', price: 35000, stock: 200 },
          { name: 'Galón', price: 130000, stock: 60 }
        ]
      }
    }
  })

  const p5 = await prisma.product.create({
    data: {
      name: 'Liqui Moly Molygen 5W-40',
      slug: 'liqui-moly-molygen-5w40',
      description: 'Aceite de motor de baja fricción basado en tecnología sintética. Aditivo fluorescente Molygen.',
      shortDesc: 'Aceite Sintético 5W-40',
      price: 395000,
      sku: 'LQM-MOL-5W40',
      categoryId: catGasolina.id,
      brandId: brandLiquiMoly.id,
      images: {
        create: [
          { url: '/liquimoly.png', isMain: true }
        ]
      },
      variants: {
        create: [
          { name: 'Litro', price: 85000, stock: 40 },
          { name: 'Garrafa (5L)', price: 395000, stock: 15 }
        ]
      }
    }
  })

  // Chevron Delo en todas las presentaciones
  const p6_1 = await prisma.product.create({
    data: {
      name: 'Chevron Delo 400 SDE 15W-40',
      slug: 'chevron-delo-400-sde-15w40',
      description: 'Aceite diésel premium con tecnología ISOSYN Advanced para protección extrema de motores diésel de carga pesada, tractomulas, buses y maquinaria de construcción. Excelente resistencia al espesamiento por hollín y control de corrosión. Especificación API CK-4 / CJ-4.',
      shortDesc: 'Aceite Diésel ISOSYN 15W-40 API CK-4',
      price: 142000,
      comparePrice: 158000,
      cost: 108000,
      sku: 'CHV-DEL-400-SDE-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandChevron.id,
      images: {
        create: [
          { url: '/chevron.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CK-4 / CJ-4 / CI-4 Plus' },
          { name: 'Tecnología', value: 'ISOSYN Advanced Technology' },
          { name: 'Aplicación', value: 'Motores Diésel Carga Pesada y Maquinaria' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 37000, stock: 100, sku: 'CHV-400SDE-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 142000, stock: 60, sku: 'CHV-400SDE-15W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 660000, stock: 15, sku: 'CHV-400SDE-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5600000, stock: 5, sku: 'CHV-400SDE-15W40-55G' }
        ]
      }
    }
  })

  const p6_2 = await prisma.product.create({
    data: {
      name: 'Chevron Delo 400 MG 15W-40',
      slug: 'chevron-delo-400-mg-15w40',
      description: 'Aceite multigrado formulado para flotas mixtas y motores diésel con sistemas de control de emisiones EGR y DPF. Excelente protección contra el desgaste de tren de válvulas y limpieza de pistones.',
      shortDesc: 'Aceite Diésel Multigrado 15W-40 API CJ-4',
      price: 136000,
      comparePrice: 150000,
      cost: 102000,
      sku: 'CHV-DEL-400-MG-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandChevron.id,
      images: {
        create: [
          { url: '/chevron.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CJ-4 / CI-4 Plus / SM' },
          { name: 'Aplicación', value: 'Flotas Mixtas y Camiones Diésel' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 35000, stock: 80, sku: 'CHV-400MG-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 136000, stock: 50, sku: 'CHV-400MG-15W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 630000, stock: 12, sku: 'CHV-400MG-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5300000, stock: 4, sku: 'CHV-400MG-15W40-55G' }
        ]
      }
    }
  })

  const p6_3 = await prisma.product.create({
    data: {
      name: 'Chevron Delo Gold Ultra 15W-40',
      slug: 'chevron-delo-gold-ultra-15w40',
      description: 'Aceite de motor diésel de alto rendimiento diseñado para lubricación de motores diésel turbocargados y de aspiración natural en camiones y equipos industriales.',
      shortDesc: 'Aceite Diésel Confiable 15W-40 API CI-4',
      price: 128000,
      comparePrice: 142000,
      cost: 96000,
      sku: 'CHV-DEL-GOLD-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandChevron.id,
      images: {
        create: [
          { url: '/chevron.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CI-4 / CH-4 / SL' },
          { name: 'Tipo de Aceite', value: 'Mineral Rendimiento Ultra' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 33000, stock: 90, sku: 'CHV-GOLD-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 128000, stock: 45, sku: 'CHV-GOLD-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 590000, stock: 10, sku: 'CHV-GOLD-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 4900000, stock: 3, sku: 'CHV-GOLD-15W40-55G' }
        ]
      }
    }
  })

  const p6_4 = await prisma.product.create({
    data: {
      name: 'Chevron Delo 400 ZFX 15W-40 Synthetic Blend',
      slug: 'chevron-delo-400-zfx-15w40',
      description: 'Aceite semisintético de máxima protección diseñado para alargar los intervalos de cambio de aceite en flotas modernas bajo condiciones severas de terreno y carga.',
      shortDesc: 'Aceite Semisintético Diésel 15W-40',
      price: 160000,
      comparePrice: 175000,
      cost: 120000,
      sku: 'CHV-DEL-400-ZFX-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandChevron.id,
      images: {
        create: [
          { url: '/chevron.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad', value: '15W-40' },
          { name: 'Norma API', value: 'CK-4 / CJ-4' },
          { name: 'Tipo de Aceite', value: 'Semisintético (Synthetic Blend)' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 41000, stock: 70, sku: 'CHV-ZFX-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 160000, stock: 35, sku: 'CHV-ZFX-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 750000, stock: 8, sku: 'CHV-ZFX-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6200000, stock: 2, sku: 'CHV-ZFX-15W40-55G' }
        ]
      }
    }
  })

  // Valvoline Premium Blue en todas las presentaciones
  const vpb_1 = await prisma.product.create({
    data: {
      name: 'Valvoline Premium Blue 8600 ES 15W-40',
      slug: 'valvoline-premium-blue-8600-es-15w40',
      description: 'El único aceite para motor diésel avalado exclusivamente por Cummins (The Only One™ Endorsed by Cummins). Formulado con la tecnología patentada Dispersant Polymer Technology (DPT) para control superior del hollín, protección extrema contra desgaste y prevención de depósitos en pistones.',
      shortDesc: 'Aceite Diésel Endorsed by Cummins 15W-40 API CK-4',
      price: 148000,
      comparePrice: 165000,
      cost: 110000,
      sku: 'VAL-PB-8600-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandValvoline.id,
      images: {
        create: [
          { url: '/valvoline-premium-blue.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '15W-40' },
          { name: 'Aval Oficial', value: 'The Only One™ Endorsed by Cummins' },
          { name: 'Aprobación Cummins', value: 'Cummins CES 20086 / CES 20081' },
          { name: 'Norma API', value: 'API CK-4 / CJ-4 / CI-4 Plus / SN' },
          { name: 'Número Base (TBN)', value: '10.0 mg KOH/g (Retención extendida)' },
          { name: 'Aprobaciones OEM', value: 'Detroit Diesel DDF 93K222, Mack EOS-4.5, Volvo VDS-4.5, Caterpillar ECF-3' },
          { name: 'Aplicación', value: 'Motores Cummins ISX15, X15, QSK, QSB, camiones y maquinaria pesada' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 38000, stock: 100, sku: 'VAL-PB8600-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 148000, stock: 60, sku: 'VAL-PB8600-15W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 690000, stock: 15, sku: 'VAL-PB8600-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5850000, stock: 5, sku: 'VAL-PB8600-15W40-55G' }
        ]
      }
    }
  })

  const vpb_2 = await prisma.product.create({
    data: {
      name: 'Valvoline Premium Blue 7900 15W-40',
      slug: 'valvoline-premium-blue-7900-15w40',
      description: 'Aceite de motor diésel de trabajo pesado de alta calidad diseñado para brindar una lubricación avanzada en motores modernos con sistemas EGR y DPF. Desarrollado en conjunto con Cummins.',
      shortDesc: 'Aceite Diésel Trabajo Pesado 15W-40 API CJ-4',
      price: 138000,
      comparePrice: 152000,
      cost: 104000,
      sku: 'VAL-PB-7900-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandValvoline.id,
      images: {
        create: [
          { url: '/valvoline-premium-blue.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '15W-40' },
          { name: 'Aprobación Cummins', value: 'Cummins CES 20081' },
          { name: 'Norma API', value: 'API CJ-4 / CI-4 Plus / SL' },
          { name: 'Aprobaciones OEM', value: 'MB 228.31, MAN M 3575, Caterpillar ECF-3' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 36000, stock: 80, sku: 'VAL-PB7900-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 138000, stock: 50, sku: 'VAL-PB7900-15W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 640000, stock: 12, sku: 'VAL-PB7900-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5400000, stock: 4, sku: 'VAL-PB7900-15W40-55G' }
        ]
      }
    }
  })

  const vpb_3 = await prisma.product.create({
    data: {
      name: 'Valvoline Premium Blue Extra 15W-40',
      slug: 'valvoline-premium-blue-extra-15w40',
      description: 'Formulación de alta resistencia al estrés mecánico y alta temperatura para motores diésel de transporte pesado, flota mixta y tractores de maquinaria agrícola.',
      shortDesc: 'Aceite Diésel Confiable 15W-40 API CI-4+',
      price: 130000,
      comparePrice: 145000,
      cost: 98000,
      sku: 'VAL-PB-EXT-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandValvoline.id,
      images: {
        create: [
          { url: '/valvoline-premium-blue.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '15W-40' },
          { name: 'Norma API', value: 'API CI-4 Plus / CH-4 / SL' },
          { name: 'Aprobaciones OEM', value: 'Cummins CES 20078, Volvo VDS-3, Mack EO-N' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 34000, stock: 90, sku: 'VAL-PBEXT-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 130000, stock: 45, sku: 'VAL-PBEXT-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 600000, stock: 10, sku: 'VAL-PBEXT-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5000000, stock: 3, sku: 'VAL-PBEXT-15W40-55G' }
        ]
      }
    }
  })

  const vpb_4 = await prisma.product.create({
    data: {
      name: 'Valvoline Premium Blue One Solution 9200 15W-40',
      slug: 'valvoline-premium-blue-one-solution-9200-15w40',
      description: 'Lubricante universal de flota diseñado para ser utilizado en motores Diésel, Gas Natural (GNC/GNL) y Gasolina. Aprobación exclusiva Cummins CES 20092 para motores a gas.',
      shortDesc: 'Aceite Flota Única Diésel & Gas Natural 15W-40',
      price: 165000,
      comparePrice: 180000,
      cost: 122000,
      sku: 'VAL-PB-9200-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandValvoline.id,
      images: {
        create: [
          { url: '/valvoline-premium-blue.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '15W-40' },
          { name: 'Aprobación Cummins Gas', value: 'Cummins CES 20092 (Gas Natural GNC/GNL)' },
          { name: 'Aprobación Cummins Diésel', value: 'Cummins CES 20086' },
          { name: 'Norma API', value: 'API CK-4 / CJ-4 / SN' },
          { name: 'Aplicación', value: 'Flotas con motores a Gas Natural y Diésel de Trabajo Pesado' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 42000, stock: 70, sku: 'VAL-PB9200-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 165000, stock: 35, sku: 'VAL-PB9200-15W40-GL' },
          { name: 'Caneca (5 Gal / 18.9 L)', price: 770000, stock: 8, sku: 'VAL-PB9200-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6300000, stock: 2, sku: 'VAL-PB9200-15W40-55G' }
        ]
      }
    }
  })

  const vpb_5_25w60 = await prisma.product.create({
    data: {
      name: 'Valvoline Cummins All Fleet Extra 25W-60 Diésel',
      slug: 'valvoline-cummins-all-fleet-extra-25w60',
      description: 'Aceite diésel de alta viscosidad formulado especialmente para motores de trabajo pesado con alto kilometraje u horas de operación severas. Mantienen la presión óptima de aceite, sella tolerancias desgastadas y reduce sensiblemente el consumo de lubricante a elevadas temperaturas.',
      shortDesc: 'Aceite Diésel Alta Viscosidad 25W-60',
      price: 135000,
      comparePrice: 150000,
      cost: 98000,
      sku: 'VAL-AFE-25W60',
      categoryId: catMaquinaria.id,
      brandId: brandValvoline.id,
      images: {
        create: [
          { url: '/valvoline-25w60.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '25W-60 (Alta Viscosidad / Alto Kilometraje)' },
          { name: 'Presentación Envase', value: 'Tarro / Galón Verde Distintivo Valvoline Cummins Original' },
          { name: 'Norma API', value: 'API CF-4 / CF / SL' },
          { name: 'Aprobaciones OEM', value: 'Cummins CES 20075, Detroit Diesel DDC 93K215' },
          { name: 'Aplicación Principal', value: 'Motores Diésel de Carga Pesada con alto kilometraje, tractomulas, buses y volquetas' },
          { name: 'Beneficios', value: 'Incrementa la presión de aceite, sella anillos desgastados y disminuye la emisión de humo azul' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 35000, stock: 120, sku: 'VAL-25W60-QT' },
          { name: 'Galón (3.785 L)', price: 135000, stock: 70, sku: 'VAL-25W60-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 620000, stock: 15, sku: 'VAL-25W60-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 5100000, stock: 5, sku: 'VAL-25W60-55G' }
        ]
      }
    }
  })

  // Motorcraft Heavy Duty Diesel
  const mtc_1 = await prisma.product.create({
    data: {
      name: 'Motorcraft Super Duty Diesel Motor Oil 15W-40',
      slug: 'motorcraft-super-duty-diesel-15w40',
      description: 'Aceite formulado oficialmente por Ford Motor Company para motores Ford PowerStroke Turbo Diésel (6.7L, 6.0L, 7.3L) y flotas diésel de trabajo pesado. Aprobación oficial Ford WSS-M2C171-F1 y API CK-4.',
      shortDesc: 'Aceite Diésel Ford Super Duty 15W-40 API CK-4',
      price: 155000,
      comparePrice: 170000,
      cost: 115000,
      sku: 'MTC-SD-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandMotorcraft.id,
      images: {
        create: [
          { url: '/motorcraft-diesel-15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '15W-40' },
          { name: 'Aprobación Ford', value: 'Ford WSS-M2C171-F1 (Aprobado Oficial PowerStroke)' },
          { name: 'Norma API', value: 'API CK-4 / CJ-4 / CI-4 Plus / SN' },
          { name: 'Aprobaciones OEM', value: 'Cummins CES 20086, Detroit Diesel DDF 93K222, Mack EOS-4.5, Volvo VDS-4.5' },
          { name: 'Aplicación', value: 'Motores Ford PowerStroke (F-250, F-350, F-450) y camiones diésel de trabajo pesado' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 40000, stock: 100, sku: 'MTC-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 155000, stock: 60, sku: 'MTC-15W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 720000, stock: 12, sku: 'MTC-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6100000, stock: 4, sku: 'MTC-15W40-55G' }
        ]
      }
    }
  })

  const mtc_2 = await prisma.product.create({
    data: {
      name: 'Motorcraft Full Synthetic Heavy Duty Diesel Motor Oil 5W-40',
      slug: 'motorcraft-full-synthetic-diesel-5w40',
      description: 'Aceite 100% sintético de máxima protección para motores diésel bajo condiciones extremas de carga y temperatura. Brinda máxima fluidez en arranques en frío y estabilidad térmica superior. API CK-4 / WSS-M2C171-F1.',
      shortDesc: 'Aceite 100% Sintético Diésel 5W-40 Ford',
      price: 195000,
      comparePrice: 215000,
      cost: 145000,
      sku: 'MTC-SYN-5W40',
      categoryId: catMaquinaria.id,
      brandId: brandMotorcraft.id,
      images: {
        create: [
          { url: '/motorcraft-diesel-15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '5W-40 (Full Synthetic)' },
          { name: 'Aprobación Ford', value: 'Ford WSS-M2C171-F1' },
          { name: 'Norma API', value: 'API CK-4 / CJ-4 / SN' },
          { name: 'Tipo de Aceite', value: '100% Sintético (Full Synthetic)' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 50000, stock: 80, sku: 'MTC-5W40-QT' },
          { name: 'Galón (3.785 L)', price: 195000, stock: 30, sku: 'MTC-5W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 920000, stock: 6, sku: 'MTC-5W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 7600000, stock: 2, sku: 'MTC-5W40-55G' }
        ]
      }
    }
  })

  // Caterpillar (CAT) Heavy Machinery Fluids
  const cat_1 = await prisma.product.create({
    data: {
      name: 'CAT DEO 15W-40 Caterpillar Diesel Engine Oil',
      slug: 'cat-deo-15w40',
      description: 'Aceite genuino desarrollado exclusivamente por Caterpillar para motores diésel de maquinaria pesada, excavadoras, retroexcavadoras, cargadores frontales, tractores de oruga D6/D8/D9 y camiones mineros CAT. Cumple con la especificación extrema Caterpillar ECF-3 y API CK-4.',
      shortDesc: 'Aceite Genuino Maquinaria Pesada CAT 15W-40',
      price: 168000,
      comparePrice: 185000,
      cost: 126000,
      sku: 'CAT-DEO-15W40',
      categoryId: catMaquinaria.id,
      brandId: brandCaterpillar.id,
      images: {
        create: [
          { url: '/cat-deo-15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '15W-40' },
          { name: 'Presentación Envase', value: 'Tarro / Galón Negro Distintivo Caterpillar CAT DEO Original' },
          { name: 'Norma Caterpillar', value: 'Cat ECF-3 / Cat ECF-2 / Cat ECF-1-a' },
          { name: 'Norma API', value: 'API CK-4 / CJ-4 / CI-4 Plus' },
          { name: 'Aplicación Maquinaria', value: 'Excavadoras CAT 320/330, Cargadores CAT 950/966, Tractores D6R/D8T, Motores CAT C7, C9, C13, C15' },
          { name: 'Beneficio Principal', value: 'Extiende la vida útil de inyectores HEUI y previene depósitos en turbocargadores bajo severa temperatura' }
        ]
      },
      variants: {
        create: [
          { name: 'Cuarto (946 ml / 1/4 Gal)', price: 44000, stock: 100, sku: 'CAT-DEO-15W40-QT' },
          { name: 'Galón (3.785 L)', price: 168000, stock: 60, sku: 'CAT-DEO-15W40-GL' },
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 790000, stock: 15, sku: 'CAT-DEO-15W40-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6600000, stock: 5, sku: 'CAT-DEO-15W40-55G' }
        ]
      }
    }
  })

  const cat_2 = await prisma.product.create({
    data: {
      name: 'CAT HYDO Advanced 10W Aceite Hidráulico Maquinaria',
      slug: 'cat-hydo-advanced-10w',
      description: 'El fluido hidráulico de más alto rendimiento diseñado por Caterpillar para sistemas hidráulicos de alta presión en excavadoras y maquinaria amarilla. Permite un intervalo de cambio de hasta 6.000 horas de operación.',
      shortDesc: 'Aceite Hidráulico Premium Maquinaria CAT 10W',
      price: 160000,
      comparePrice: 175000,
      cost: 118000,
      sku: 'CAT-HYDO-10W',
      categoryId: catHidraulico.id,
      brandId: brandCaterpillar.id,
      images: {
        create: [
          { url: '/cat-deo-15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: '10W' },
          { name: 'Norma Caterpillar', value: 'Cat HYDO Advanced' },
          { name: 'Duración', value: 'Hasta 6.000 horas de operación' },
          { name: 'Aplicación', value: 'Sistemas hidráulicos de excavadoras, cargadores y maquinaria de construcción' }
        ]
      },
      variants: {
        create: [
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 750000, stock: 15, sku: 'CAT-HYDO-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6200000, stock: 4, sku: 'CAT-HYDO-55G' }
        ]
      }
    }
  })

  const cat_3 = await prisma.product.create({
    data: {
      name: 'CAT TDTO SAE 30 Aceite Mandos Finales y Transmisión',
      slug: 'cat-tdto-sae30',
      description: 'Aceite especial para mandos finales, transmisiones de servoshift y frenos húmedos en maquinaria pesada Caterpillar. Formulado para resistir extremas cargas de choque y deslizamiento.',
      shortDesc: 'Aceite Mandos Finales y Transmisión CAT SAE 30',
      price: 172000,
      comparePrice: 190000,
      cost: 128000,
      sku: 'CAT-TDTO-SAE30',
      categoryId: catTransmision.id,
      brandId: brandCaterpillar.id,
      images: {
        create: [
          { url: '/cat-deo-15w40.png', isMain: true }
        ]
      },
      attributes: {
        create: [
          { name: 'Viscosidad SAE', value: 'SAE 30' },
          { name: 'Norma Caterpillar', value: 'Cat TO-4 / Allison C-4' },
          { name: 'Aplicación', value: 'Transmisiones Power Shift, Mandos Finales y Frenos Húmedos CAT' }
        ]
      },
      variants: {
        create: [
          { name: 'Caneca / Paila (5 Gal / 18.9 L)', price: 795000, stock: 10, sku: 'CAT-TDTO-5G' },
          { name: 'Tambor (55 Gal / 208 L)', price: 6800000, stock: 3, sku: 'CAT-TDTO-55G' }
        ]
      }
    }
  })

  const p7 = await prisma.product.create({
    data: {
      name: 'Mobilube HD 80W-90',
      slug: 'mobilube-hd-80w90',
      description: 'Aceite de engranajes de alto desempeño para transmisiones.',
      shortDesc: 'Aceite Transmisión 80W-90',
      price: 135000,
      categoryId: catTransmision.id,
      brandId: brandMobil.id,
      images: { create: [{ url: '/transmision.png', isMain: true }] },
      variants: { create: [{ name: 'Galón', price: 135000, stock: 30 }] }
    }
  })

  const p8 = await prisma.product.create({
    data: {
      name: 'Terpel Coolant Larga Vida',
      slug: 'terpel-coolant-larga-vida',
      description: 'Refrigerante anticorrosivo listo para usar en todo tipo de motores.',
      shortDesc: 'Refrigerante Motor',
      price: 45000,
      categoryId: catCoolant.id,
      brandId: brandTerpel.id,
      images: { create: [{ url: '/coolant.png', isMain: true }] },
      variants: { create: [{ name: 'Galón', price: 45000, stock: 100 }] }
    }
  })

  const p9 = await prisma.product.create({
    data: {
      name: 'Bosch DOT 4',
      slug: 'bosch-dot-4',
      description: 'Líquido de frenos de alta seguridad y punto de ebullición elevado.',
      shortDesc: 'Líquido de Frenos DOT 4',
      price: 25000,
      categoryId: catFrenos.id,
      brandId: brandBosch.id,
      images: { create: [{ url: '/frenos-liq.png', isMain: true }] },
      variants: { create: [{ name: 'Frasco (500ml)', price: 25000, stock: 80 }] }
    }
  })

  const p10 = await prisma.product.create({
    data: {
      name: 'Shell Tellus S2 MX 68',
      slug: 'shell-tellus-s2-mx-68',
      description: 'Fluido hidráulico industrial de alto rendimiento.',
      shortDesc: 'Aceite Hidráulico ISO 68',
      price: 350000,
      categoryId: catHidraulico.id,
      brandId: brandShell.id,
      images: { create: [{ url: '/shell-balde-negro.png', isMain: true }] },
      variants: { create: [{ name: 'Caneca (5 Gal)', price: 350000, stock: 20 }, { name: 'Tambor (55 Gal)', price: 3100000, stock: 5 }] }
    }
  })

  const p11 = await prisma.product.create({
    data: {
      name: 'BlueTec AdBlue Urea Automotriz 32.5%',
      slug: 'bluetec-adblue',
      description: 'Solución de urea para sistemas SCR en motores diésel para reducción de emisiones.',
      shortDesc: 'Urea Automotriz DEF',
      price: 60000,
      categoryId: catUrea.id,
      brandId: brandBlueTec.id,
      images: { create: [{ url: '/urea.png', isMain: true }] },
      variants: { create: [{ name: 'Garrafa (2.5 Gal)', price: 60000, stock: 150 }] }
    }
  })



  const n1 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite WIX WL7570', slug: 'wix-wl7570', description: 'Filtro de aceite original WIX.', shortDesc: 'WIX Aceite', price: 21000, categoryId: catFiltros.id, brandId: brandWix.id,
      images: { create: [{ url: '/01_wix_wl7570_filtro_aceite.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 21000, stock: 40 }] }
    }
  })
  const n2 = await prisma.product.create({
    data: {
      name: 'Filtro de Aire WIX WA9906', slug: 'wix-wa9906', description: 'Filtro de aire de alto rendimiento WIX.', shortDesc: 'WIX Aire', price: 28000, categoryId: catFiltros.id, brandId: brandWix.id,
      images: { create: [{ url: '/02_wix_wa9906_filtro_aire.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 28000, stock: 30 }] }
    }
  })
  const n3 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite WIX WL7070', slug: 'wix-wl7070', description: 'Filtro de aceite compacto WIX.', shortDesc: 'WIX Aceite', price: 19000, categoryId: catFiltros.id, brandId: brandWix.id,
      images: { create: [{ url: '/03_wix_wl7070_filtro_aceite.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 19000, stock: 35 }] }
    }
  })
  const n4 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite WIX WL7506', slug: 'wix-wl7506', description: 'Filtro de aceite estándar WIX.', shortDesc: 'WIX Aceite', price: 20000, categoryId: catFiltros.id, brandId: brandWix.id,
      images: { create: [{ url: '/04_wix_wl7506_filtro_aceite.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 20000, stock: 25 }] }
    }
  })
  const n5 = await prisma.product.create({
    data: {
      name: 'Filtro Aceite Pesado WIX 51820', slug: 'wix-51820', description: 'Filtro de aceite para línea pesada WIX.', shortDesc: 'WIX Pesado', price: 45000, categoryId: catFiltros.id, brandId: brandWix.id,
      images: { create: [{ url: '/05_wix_51820_filtro_aceite_pesado.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 45000, stock: 15 }] }
    }
  })
  const n6 = await prisma.product.create({
    data: {
      name: 'Filtro Aire Mazda P53N-13-3A0', slug: 'mazda-p53n-13-3a0', description: 'Filtro de aire genuino Mazda.', shortDesc: 'Mazda Original', price: 65000, categoryId: catFiltros.id, brandId: brandMazda.id,
      images: { create: [{ url: '/06_mazda_p53n_13_3a0_filtro_aire.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 65000, stock: 10 }] }
    }
  })
  const n7 = await prisma.product.create({
    data: {
      name: 'Filtro Cabina Coéxito COAC-305', slug: 'coexito-coac-305', description: 'Filtro de cabina Coéxito para mantener el interior libre de polen.', shortDesc: 'Coéxito Cabina', price: 22000, categoryId: catFiltros.id, brandId: brandCoexito.id,
      images: { create: [{ url: '/07_auto_coexito_coac_305_filtro_cabina.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 22000, stock: 40 }] }
    }
  })
  const n8 = await prisma.product.create({
    data: {
      name: 'Filtro Cabina Coéxito COAC-095', slug: 'coexito-coac-095', description: 'Filtro de cabina de alta calidad.', shortDesc: 'Coéxito Cabina', price: 23000, categoryId: catFiltros.id, brandId: brandCoexito.id,
      images: { create: [{ url: '/08_auto_coexito_coac_095_filtro_cabina.png', isMain: true }] }, variants: { create: [{ name: 'Unidad', price: 23000, stock: 35 }] }
    }
  })

  // Terpel Ultrek (Maquinaria Pesada y Diésel)
  const n9 = await prisma.product.create({
    data: {
      name: 'Terpel Ultrek Pro 15W-40 CK-4', slug: 'terpel-ultrek-pro-ck4', description: 'Aceite de tecnología sintética para los motores diésel más exigentes y maquinaria pesada.', shortDesc: 'Terpel Ultrek Pro', price: 135000, categoryId: catMaquinaria.id, brandId: brandTerpel.id,
      images: { create: [{ url: '/09_terpel_ultrek_15w40_pro_ck4.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 135000, stock: 30 }] }
    }
  })
  const n10 = await prisma.product.create({
    data: {
      name: 'Terpel Ultrek Plus 15W-40', slug: 'terpel-ultrek-plus', description: 'Protección superior para flotas mixtas y camiones de carga.', shortDesc: 'Terpel Ultrek Plus', price: 125000, categoryId: catMaquinaria.id, brandId: brandTerpel.id,
      images: { create: [{ url: '/10_terpel_ultrek_15w40_plus.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 125000, stock: 40 }] }
    }
  })
  const n11 = await prisma.product.create({
    data: {
      name: 'Terpel Ultrek Multigrado 15W-40', slug: 'terpel-ultrek-multigrado', description: 'Aceite mineral confiable para trabajo pesado en maquinaria.', shortDesc: 'Terpel Ultrek', price: 115000, categoryId: catMaquinaria.id, brandId: brandTerpel.id,
      images: { create: [{ url: '/11_terpel_ultrek_15w40_multigrado.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 115000, stock: 50 }] }
    }
  })

  // Terpel Oiltec
  const n12 = await prisma.product.create({
    data: {
      name: 'Terpel Oiltec Titanio 10W-40', slug: 'terpel-oiltec-titanio-10w40', description: 'Aceite con titanio líquido para máxima protección en motores a gasolina.', shortDesc: 'Oiltec Titanio', price: 105000, categoryId: catGasolina.id, brandId: brandTerpel.id,
      images: { create: [{ url: '/12_terpel_oiltec_10w40_titanio.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 105000, stock: 35 }] }
    }
  })
  const n13 = await prisma.product.create({
    data: {
      name: 'Terpel Oiltec Titanio 10W-30', slug: 'terpel-oiltec-titanio-10w30', description: 'Aceite liviano con titanio para mejor ahorro de combustible.', shortDesc: 'Oiltec Titanio', price: 105000, categoryId: catGasolina.id, brandId: brandTerpel.id,
      images: { create: [{ url: '/13_terpel_oiltec_10w30_titanio.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 105000, stock: 25 }] }
    }
  })

  // Castrol CRB
  const n14 = await prisma.product.create({
    data: {
      name: 'Castrol CRB Multi 15W-40 CK-4', slug: 'castrol-crb-multi-15w40', description: 'Aceite diésel multipropósito de alto rendimiento y vida útil prolongada.', shortDesc: 'Castrol CRB Multi', price: 130000, categoryId: catDiesel.id, brandId: brandCastrol.id,
      images: { create: [{ url: '/15_castrol_crb_multi_15w40_ck4.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 130000, stock: 30 }] }
    }
  })

  // Nuevos productos nacionales
  const n15 = await prisma.product.create({
    data: {
      name: 'Global Oil Max 20W-50', slug: 'global-oil-max-20w50', description: 'Aceite de motor de alta calidad fabricado en Colombia.', shortDesc: 'Global Oil 20W-50', price: 95000, categoryId: catGasolina.id, brandId: brandGlobalOil.id,
      images: { create: [{ url: '/prod_global_oil_max.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 95000, stock: 40 }] }
    }
  })
  const n16 = await prisma.product.create({
    data: {
      name: 'Max Power Heavy Duty 15W-40', slug: 'max-power-hd-15w40', description: 'Lubricante para trabajo pesado con especificaciones técnicas rigurosas.', shortDesc: 'Max Power 15W-40', price: 110000, categoryId: catMaquinaria.id, brandId: brandMaxPower.id,
      images: { create: [{ url: '/prod_max_power_hd.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 110000, stock: 30 }] }
    }
  })
  const n17 = await prisma.product.create({
    data: {
      name: 'Petroil Diésel SAE 40', slug: 'petroil-diesel-sae40', description: 'Aceite monogrado para motores diésel tradicionales y tractores.', shortDesc: 'Petroil SAE 40', price: 85000, categoryId: catMaquinaria.id, brandId: brandPetroil.id,
      images: { create: [{ url: '/prod_petroil_diesel.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 85000, stock: 50 }] }
    }
  })
  const n18 = await prisma.product.create({
    data: {
      name: 'Vanssoil Industrial Gear 220', slug: 'vanssoil-industrial-gear-220', description: 'Aceite industrial para engranajes fabricado nacionalmente.', shortDesc: 'Vanssoil Engranajes', price: 125000, categoryId: catTransmision.id, brandId: brandVanssoil.id,
      images: { create: [{ url: '/prod_vanssoil_gear.png', isMain: true }] }, variants: { create: [{ name: 'Caneca (5 Gal)', price: 600000, stock: 10 }] }
    }
  })
  const n19 = await prisma.product.create({
    data: {
      name: 'Lubrisol Heavy Duty Diésel 15W-40', slug: 'lubrisol-heavy-duty-diesel-15w40', description: 'Aceite de alta protección y resistencia térmica para motores diésel de trabajo pesado, camiones y maquinaria.', shortDesc: 'Lubrisol Diésel 15W-40', price: 105000, categoryId: catMaquinaria.id, brandId: brandLubrisol.id,
      images: { create: [{ url: '/prod_lubrisol_moto.png', isMain: true }] }, variants: { create: [{ name: 'Galón', price: 105000, stock: 40 }] }
    }
  })

  // Productos de Frenos y Suspensión (Repositorio 1)
  const fs1 = await prisma.product.create({
    data: {
      name: 'Pastillas de Freno ACDelco Ceramic Premium',
      slug: 'acdelco-pastillas-freno-ceramic-01',
      description: 'Pastillas de freno cerámicas ACDelco de alto desempeño. Excelente disipación de calor, bajo nivel de polvo y silencio total en frenada.',
      shortDesc: 'ACDelco Cerámica',
      price: 145000,
      sku: 'ACD-PAS-CRM-01',
      categoryId: catFrenosSuspension.id,
      brandId: brandACDelco.id,
      images: { create: [{ url: '/acdelco-pastillas-freno-01.jpg', isMain: true }] },
      variants: { create: [{ name: 'Juego Delantero', price: 145000, stock: 25 }] }
    }
  })

  const fs2 = await prisma.product.create({
    data: {
      name: 'Pastillas de Freno ACDelco Heavy Duty',
      slug: 'acdelco-pastillas-freno-hd-02',
      description: 'Pastillas de freno reforzadas ACDelco para vehículos de trabajo y SUV. Máxima respuesta de frenado bajo condiciones exigentes.',
      shortDesc: 'ACDelco Heavy Duty',
      price: 130000,
      sku: 'ACD-PAS-HD-02',
      categoryId: catFrenosSuspension.id,
      brandId: brandACDelco.id,
      images: { create: [{ url: '/acdelco-pastillas-freno-02.jpg', isMain: true }] },
      variants: { create: [{ name: 'Juego Delantero', price: 130000, stock: 30 }] }
    }
  })

  const fs3 = await prisma.product.create({
    data: {
      name: 'Amortiguador Gabriel Gas-SLX',
      slug: 'gabriel-amortiguador-gas-slx',
      description: 'Amortiguador Gabriel presurizado con nitrógeno gas para un control óptimo de suspensión y mayor adherencia al terreno.',
      shortDesc: 'Gabriel Gas-SLX',
      price: 185000,
      sku: 'GAB-AMR-SLX-01',
      categoryId: catFrenosSuspension.id,
      brandId: brandGabriel.id,
      images: { create: [{ url: '/gabriel-amortiguador-01.png', isMain: true }] },
      variants: { create: [{ name: 'Unidad', price: 185000, stock: 20 }] }
    }
  })

  const fs4 = await prisma.product.create({
    data: {
      name: 'Amortiguador Gabriel FleetLine Reforzado',
      slug: 'gabriel-amortiguador-fleetline',
      description: 'Amortiguador de diseño pesado Gabriel FleetLine. Diseñado para ofrecer durabilidad prolongada en camionetas y vans de carga.',
      shortDesc: 'Gabriel FleetLine',
      price: 210000,
      sku: 'GAB-AMR-FLT-02',
      categoryId: catFrenosSuspension.id,
      brandId: brandGabriel.id,
      images: { create: [{ url: '/gabriel-amortiguador-02.png', isMain: true }] },
      variants: { create: [{ name: 'Unidad', price: 210000, stock: 15 }] }
    }
  })

  const fs5 = await prisma.product.create({
    data: {
      name: 'Partes de Suspensión Gabriel System',
      slug: 'gabriel-suspension-system-01',
      description: 'Componente integral de suspensión Gabriel para un guiado preciso del eje y amortiguación de oscilaciones del chasis.',
      shortDesc: 'Gabriel Suspensión',
      price: 160000,
      sku: 'GAB-SUS-SYS-01',
      categoryId: catFrenosSuspension.id,
      brandId: brandGabriel.id,
      images: { create: [{ url: '/gabriel-suspension-01.png', isMain: true }] },
      variants: { create: [{ name: 'Unidad', price: 160000, stock: 18 }] }
    }
  })

  const fs6 = await prisma.product.create({
    data: {
      name: 'Pastillas de Freno Incolbest XT-Premium',
      slug: 'incolbest-pastillas-freno-xt',
      description: 'Pastillas para freno Incolbest de fabricación colombiana, formulación 100% libre de asbesto con alta resistencia al calor.',
      shortDesc: 'Incolbest XT',
      price: 98000,
      sku: 'INC-PAS-XT-01',
      categoryId: catFrenosSuspension.id,
      brandId: brandIncolbest.id,
      images: { create: [{ url: '/incolbest-pastillas-menu.png', isMain: true }] },
      variants: { create: [{ name: 'Juego', price: 98000, stock: 40 }] }
    }
  })

  const fs7 = await prisma.product.create({
    data: {
      name: 'Discos de Freno Ventilados Incolbest Pro',
      slug: 'incolbest-discos-freno-ventilados',
      description: 'Discos de freno ventilados Incolbest fabricados bajo especificaciones de equipo original para disipación térmica máxima.',
      shortDesc: 'Incolbest Discos',
      price: 175000,
      sku: 'INC-DIS-PRO-01',
      categoryId: catFrenosSuspension.id,
      brandId: brandIncolbest.id,
      images: { create: [{ url: '/incolbest-discos-menu.png', isMain: true }] },
      variants: { create: [{ name: 'Par de Discos', price: 175000, stock: 15 }] }
    }
  })

  // 6. Productos Filtros Donsson (Línea Livianos y Trabajo Pesado)
  const don1 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite Donsson LFP7070',
      slug: 'donsson-lfp7070',
      description: 'Filtro de aceite Donsson para Chevrolet Spark GT y Beat 1.2L. Excelente eficiencia de filtración de partículas y protección constante en la lubricación del motor.',
      shortDesc: 'Spark GT / Beat (Aceite)',
      price: 16000,
      sku: 'DON-LFP7070',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aceite.jpg', isMain: true }] },
      attributes: {
        create: [
          { name: 'Tipo de Filtro', value: 'Aceite Sellado' },
          { name: 'Compatibilidad', value: 'Chevrolet Spark 1.0L, Spark GT 1.2L, Beat' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 16000, stock: 50, sku: 'DON-LFP7070-UN' },
          { name: 'Caja x 12 Unidades', price: 180000, stock: 10, sku: 'DON-LFP7070-CX' }
        ]
      }
    }
  })

  const don2 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite Donsson LFP3603',
      slug: 'donsson-lfp3603',
      description: 'Filtro de aceite reforzado Donsson para motores Renault Duster, Logan, Sandero, Stepway y Clio 1.6L / 2.0L.',
      shortDesc: 'Renault Duster/Logan (Aceite)',
      price: 17500,
      sku: 'DON-LFP3603',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aceite.jpg', isMain: true }] },
      attributes: {
        create: [
          { name: 'Tipo de Filtro', value: 'Aceite Sellado' },
          { name: 'Compatibilidad', value: 'Renault Duster, Logan, Sandero, Clio, Megane' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 17500, stock: 60, sku: 'DON-LFP3603-UN' },
          { name: 'Caja x 12 Unidades', price: 195000, stock: 12, sku: 'DON-LFP3603-CX' }
        ]
      }
    }
  })

  const don3 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite Donsson LFP1402',
      slug: 'donsson-lfp1402',
      description: 'Filtro de aceite compacto Donsson para Kia Picanto ION y Hyundai i10. Retiene micro-contaminantes para prolongar el aceite del motor.',
      shortDesc: 'Kia Picanto ION / i10 (Aceite)',
      price: 16500,
      sku: 'DON-LFP1402',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aceite.jpg', isMain: true }] },
      attributes: {
        create: [
          { name: 'Tipo de Filtro', value: 'Aceite' },
          { name: 'Compatibilidad', value: 'Kia Picanto ION, Hyundai i10, Accent' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 16500, stock: 40, sku: 'DON-LFP1402-UN' }
        ]
      }
    }
  })

  const don4 = await prisma.product.create({
    data: {
      name: 'Filtro de Aceite Donsson LFP58',
      slug: 'donsson-lfp58',
      description: 'Filtro de aceite Donsson de alta precisión para gama Mazda 2, Mazda 3 Skyactiv y Allegro.',
      shortDesc: 'Mazda 2 / 3 (Aceite)',
      price: 19000,
      sku: 'DON-LFP58',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aceite.jpg', isMain: true }] },
      attributes: {
        create: [
          { name: 'Tipo de Filtro', value: 'Aceite' },
          { name: 'Compatibilidad', value: 'Mazda 2, Mazda 3, CX-30, Allegro' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 19000, stock: 45, sku: 'DON-LFP58-UN' }
        ]
      }
    }
  })

  const don5 = await prisma.product.create({
    data: {
      name: 'Filtro de Aire Donsson AFP3146',
      slug: 'donsson-afp3146',
      description: 'Filtro de aire para Chevrolet Spark GT 1.2L Donsson. Mantiene un flujo de aire limpio optimizando el consumo de combustible.',
      shortDesc: 'Spark GT (Aire)',
      price: 20000,
      sku: 'DON-AFP3146',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aire.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 20000, stock: 35, sku: 'DON-AFP3146-UN' }
        ]
      }
    }
  })

  const don6 = await prisma.product.create({
    data: {
      name: 'Filtro de Aire Donsson AFP3554',
      slug: 'donsson-afp3554',
      description: 'Filtro de aire motor para Renault Duster 1.6L y 2.0L 16V Donsson. Filtración plisada de alta capacidad para retención de polvo.',
      shortDesc: 'Renault Duster (Aire)',
      price: 26000,
      sku: 'DON-AFP3554',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aire.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 26000, stock: 30, sku: 'DON-AFP3554-UN' }
        ]
      }
    }
  })

  const don7 = await prisma.product.create({
    data: {
      name: 'Filtro de Combustible Donsson FFP7355',
      slug: 'donsson-ffp7355',
      description: 'Filtro de combustible diésel Donsson para Toyota Hilux D-4D 2.5L / 3.0L y Fortuner. Retiene partículas impidiendo desgaste de inyectores.',
      shortDesc: 'Toyota Hilux / Fortuner (Diésel)',
      price: 48000,
      sku: 'DON-FFP7355',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aceite.jpg', isMain: true }] },
      attributes: {
        create: [
          { name: 'Tipo de Filtro', value: 'Combustible Diésel' },
          { name: 'Compatibilidad', value: 'Toyota Hilux 2.5L/3.0L, Fortuner' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 48000, stock: 25, sku: 'DON-FFP7355-UN' }
        ]
      }
    }
  })

  const don8 = await prisma.product.create({
    data: {
      name: 'Filtro Cabina Donsson CFP31068',
      slug: 'donsson-cfp31068',
      description: 'Filtro de aire de cabina / aire acondicionado para Renault Duster, Oroch y Logan II. Mantiene el ambiente interno purificado.',
      shortDesc: 'Renault Duster/Logan (Cabina)',
      price: 27000,
      sku: 'DON-CFP31068',
      categoryId: catFiltros.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/filtro-aire.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 27000, stock: 20, sku: 'DON-CFP31068-UN' }
        ]
      }
    }
  })

  const don9 = await prisma.product.create({
    data: {
      name: 'Filtro Aceite Pesado Donsson LFP-3000',
      slug: 'donsson-lfp3000',
      description: 'Filtro de aceite para trabajo pesado Donsson para motores Cummins N14, ISM, M11 e ISX en camiones Kenworth T800, International y Freightliner.',
      shortDesc: 'Cummins N14/ISM/ISX (Aceite Pesado)',
      price: 52000,
      sku: 'DON-LFP3000',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/05_wix_51820_filtro_aceite_pesado.png', isMain: true }] },
      attributes: {
        create: [
          { name: 'Aplicación', value: 'Motores Cummins N14, ISM, ISX' },
          { name: 'Tipo de Filtro', value: 'Aceite Flujo Total Lube' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 52000, stock: 30, sku: 'DON-LFP3000-UN' },
          { name: 'Caja x 6 Unidades', price: 295000, stock: 8, sku: 'DON-LFP3000-CX' }
        ]
      }
    }
  })

  const don10 = await prisma.product.create({
    data: {
      name: 'Filtro Aceite Combinado Venturi Donsson LFP-9009',
      slug: 'donsson-lfp9009',
      description: 'Filtro de aceite bypass/flujo combinado Venturi Donsson para motores Cummins ISX15 y X15 en tractomulas Kenworth T880, T680 e International ProStar.',
      shortDesc: 'Cummins ISX15 / X15 (Aceite Venturi)',
      price: 85000,
      sku: 'DON-LFP9009',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/05_wix_51820_filtro_aceite_pesado.png', isMain: true }] },
      attributes: {
        create: [
          { name: 'Tecnología', value: 'Combinado Flujo Total / By-pass Venturi' },
          { name: 'Compatibilidad', value: 'Motores Cummins ISX15, X15, QSX15' }
        ]
      },
      variants: {
        create: [
          { name: 'Unidad', price: 85000, stock: 25, sku: 'DON-LFP9009-UN' },
          { name: 'Caja x 6 Unidades', price: 480000, stock: 5, sku: 'DON-LFP9009-CX' }
        ]
      }
    }
  })

  const don11 = await prisma.product.create({
    data: {
      name: 'Filtro Separador Agua Donsson FSP-1280',
      slug: 'donsson-fsp1280',
      description: 'Filtro separador de agua y combustible diésel Donsson para motores Cummins 6BT, ISC e ISL en camiones Chevrolet Kodiak, Ford Cargo y volquetas.',
      shortDesc: 'Cummins 6BT / ISC (Separador Agua)',
      price: 45000,
      sku: 'DON-FSP1280',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/catalogo-filtros-donsson/donsson-fsp1280-separador.jpg', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 45000, stock: 35, sku: 'DON-FSP1280-UN' }
        ]
      }
    }
  })

  const don12 = await prisma.product.create({
    data: {
      name: 'Filtro Separador Agua Donsson FSP-19727 Con Válvula',
      slug: 'donsson-fsp19727',
      description: 'Filtro separador agua-combustible Donsson con drenaje para tractomulas Kenworth, Freightliner Columbia / Cascadia e International.',
      shortDesc: 'Tractomulas Kenworth/Freightliner (Separador)',
      price: 65000,
      sku: 'DON-FSP19727',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/catalogo-filtros-donsson/donsson-fsp19727-separador.jpg', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 65000, stock: 20, sku: 'DON-FSP19727-UN' }
        ]
      }
    }
  })

  const don13 = await prisma.product.create({
    data: {
      name: 'Filtro Aire Pesado Primario Donsson AFP-25544',
      slug: 'donsson-afp25544',
      description: 'Filtro de aire pesado primario Donsson para camiones International 4300, Durastar y motores DT466, MaxxForce 7/9.',
      shortDesc: 'International 4300 (Aire Pesado)',
      price: 145000,
      sku: 'DON-AFP25544',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/catalogo-filtros-donsson/donsson-afp25544-aire.jpg', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 145000, stock: 15, sku: 'DON-AFP25544-UN' }
        ]
      }
    }
  })

  const don14 = await prisma.product.create({
    data: {
      name: 'Filtro Aire Cilíndrico Donsson AFP-25708',
      slug: 'donsson-afp25708',
      description: 'Filtro de aire pesado cilíndrico Donsson de alto flujo para tractomulas Kenworth T800, W900 y Freightliner Columbia.',
      shortDesc: 'Kenworth T800 / Freightliner (Aire Pesado)',
      price: 185000,
      sku: 'DON-AFP25708',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/catalogo-filtros-donsson/donsson-afp25708-aire.jpg', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 185000, stock: 12, sku: 'DON-AFP25708-UN' }
        ]
      }
    }
  })

  const don15 = await prisma.product.create({
    data: {
      name: 'Filtro Hidráulico Donsson HFP-6510',
      slug: 'donsson-hfp6510',
      description: 'Filtro hidráulico industrial Donsson para excavadoras, retroexcavadoras y cargadores Caterpillar, Komatsu y JCB.',
      shortDesc: 'Maquinaria CAT / Komatsu / JCB (Hidráulico)',
      price: 98000,
      sku: 'DON-HFP6510',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/catalogo-filtros-donsson/donsson-hfp6510-hidraulico.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 98000, stock: 18, sku: 'DON-HFP6510-UN' }
        ]
      }
    }
  })

  const don16 = await prisma.product.create({
    data: {
      name: 'Filtro Refrigerante Coolant Donsson WFP-2075',
      slug: 'donsson-wfp2075',
      description: 'Filtro acondicionador de agua y refrigerante Donsson para motores diésel de trabajo pesado Cummins N14/ISX y Detroit Serie 60.',
      shortDesc: 'Cummins / Detroit (Filtro Refrigerante)',
      price: 38000,
      sku: 'DON-WFP2075',
      categoryId: catMaquinaria.id,
      brandId: brandDonsson.id,
      images: { create: [{ url: '/catalogo-filtros-donsson/donsson-wfp2075-coolant.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Unidad', price: 38000, stock: 25, sku: 'DON-WFP2075-UN' }
        ]
      }
    }
  })

  const brandKixx = await prisma.brand.create({ data: { name: 'KIXX', slug: 'kixx' } })

  const kixx1 = await prisma.product.create({
    data: {
      name: 'Aceite Motor Kixx G1 10W-40',
      slug: 'kixx-g1-10w40',
      description: 'Aceite de motor semisintético de alta calidad para vehículos a gasolina. Proporciona protección avanzada y rendimiento confiable.',
      shortDesc: 'Aceite semisintético para motor a gasolina',
      price: 0,
      sku: 'KIXX-G1-10W40',
      categoryId: catGasolina.id,
      brandId: brandKixx.id,
      images: { create: [{ url: '/cuarto.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Cuarto', price: 0, stock: 10, sku: 'KIXX-G1-10W40-CTO' },
          { name: 'Galón', price: 0, stock: 5, sku: 'KIXX-G1-10W40-GAL' }
        ]
      }
    }
  })

  const kixx2 = await prisma.product.create({
    data: {
      name: 'Aceite Motor Kixx HD1 15W-40 CI-4',
      slug: 'kixx-hd1-15w40',
      description: 'Aceite para motores diésel de trabajo pesado, formulado para camiones y tractomulas. Alta protección contra el desgaste.',
      shortDesc: 'Aceite pesado para motor diésel (Camiones)',
      price: 0,
      sku: 'KIXX-HD1-15W40',
      categoryId: catDiesel.id,
      brandId: brandKixx.id,
      images: { create: [{ url: '/balde-negro.png', isMain: true }] },
      variants: {
        create: [
          { name: 'Balde', price: 0, stock: 8, sku: 'KIXX-HD1-15W40-BALDE' },
          { name: 'Tambor', price: 0, stock: 2, sku: 'KIXX-HD1-15W40-TAMBOR' }
        ]
      }
    }
  })

  const loctite593 = await prisma.product.create({
    data: {
      name: 'Loctite SI 593 Sellante Adhesivo Silicona RTV Negra (70ml)',
      slug: 'loctite-si-593-silicona-rtv-negra-70ml',
      description: 'Sellante adhesivo de silicona RTV negra Loctite SI 593 Henkel (70 ml / 71 g, IDH: 285951). Silicona de uso profesional de vulcanización a temperatura ambiente. Sella, adhiere y aísla metales, vidrio, caucho y plásticos. Resistente a la humedad, intemperie y fluidos automotrices.',
      shortDesc: 'Silicona RTV Negra 70ml / 71g Henkel',
      price: 28000,
      sku: 'LOC-SI593-BLK-70ML',
      categoryId: catSiliconas.id,
      brandId: brandLoctite.id,
      images: { create: [{ url: '/catalogo-siliconas-automotrices/loctite-si-593-negra-70ml.png', isMain: true }] },
      attributes: {
        create: [
          { name: 'Color', value: 'Negro' },
          { name: 'Contenido', value: '70 ml (71 g)' },
          { name: 'Tipo', value: 'Silicona RTV Sellante' }
        ]
      },
      variants: {
        create: [
          { name: 'Tubo 70ml', price: 28000, stock: 45, sku: 'LOC-SI593-BLK-70ML-UN' }
        ]
      }
    }
  })

  const loctite596 = await prisma.product.create({
    data: {
      name: 'Loctite SI 596 Formador de Juntas Silicona Roja RTV Alta Temperatura (70ml)',
      slug: 'loctite-si-596-silicona-rtv-roja-70ml',
      description: 'Silicona roja RTV para altas temperaturas (hasta 315°C) Loctite SI 596 Henkel (70 ml / 71 g, IDH: 285956). Formador de juntas flexible y resistente a la presión para motores, múltiples, bombas de agua y tapas de válvulas.',
      shortDesc: 'Silicona Roja RTV Alta Temperatura 315°C',
      price: 29000,
      sku: 'LOC-SI596-RED-70ML',
      categoryId: catSiliconas.id,
      brandId: brandLoctite.id,
      images: { create: [{ url: '/catalogo-siliconas-automotrices/loctite-si-596-roja-70ml.png', isMain: true }] },
      attributes: {
        create: [
          { name: 'Color', value: 'Rojo' },
          { name: 'Temperatura máx.', value: '315°C' },
          { name: 'Contenido', value: '70 ml (71 g)' },
          { name: 'Tipo', value: 'Formador de Juntas RTV' }
        ]
      },
      variants: {
        create: [
          { name: 'Tubo 70ml', price: 29000, stock: 35, sku: 'LOC-SI596-RED-70ML-UN' }
        ]
      }
    }
  })

  const acdelcoDexCool = await prisma.product.create({
    data: {
      name: 'Líquido Refrigerante ACDelco DEX-COOL 50/50 Prediluido Galón (4L)',
      slug: 'refrigerante-acdelco-dex-cool-50-50-galon-4l',
      description: 'Refrigerante y anticongelante original ACDelco DEX-COOL Extended Life 50/50 prediluido listo para usar (Galón / 4 Litros, Ref. GM 88863336). Fórmula OAT orgánica color naranja de larga duración (hasta 5 años o 240.000 km). Protección avanzada contra corrosión, ebullición y cavitación en radiadores de aluminio para Chevrolet, GM y vehículos multimarca.',
      shortDesc: 'Refrigerante DEX-COOL 50/50 Galón (4L) ACDelco',
      price: 62000,
      comparePrice: 72000,
      sku: 'ACD-DEXCOOL-88863336-4L',
      categoryId: catCoolant.id,
      brandId: brandACDelco.id,
      images: { create: [{ url: '/acdelco-dex-cool-50-50-galon.png', isMain: true }] },
      attributes: {
        create: [
          { name: 'Color', value: 'Naranja' },
          { name: 'Fórmula', value: 'OAT Orgánica 50/50 Prediluido' },
          { name: 'Contenido', value: 'Galón (4 Litros / 1.06 Gal)' },
          { name: 'Referencia GM', value: '88863336' }
        ]
      },
      variants: {
        create: [
          { name: 'Galón 4L', price: 62000, stock: 30, sku: 'ACD-DEXCOOL-88863336-GL' }
        ]
      }
    }
  })

  console.log(`📦 Productos creados: lubricantes, filtros, frenos/suspensión, radiadores, refrigerante ACDelco DEX-COOL y siliconas Loctite.`)

  console.log('✅ Seeding completado con éxito.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
