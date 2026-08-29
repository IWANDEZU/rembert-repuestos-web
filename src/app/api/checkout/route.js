import { getServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  generateWhatsAppOrderText,
  getWhatsAppUrl,
  generateEmailOrderContent,
  getMailtoUrl,
} from "@/lib/orderFormatter";
import { getProductDisplayImage } from "@/lib/productImage";
import { getProductById } from "@/lib/products";
import { enforceRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const limited = await enforceRateLimit(req, { scope: "checkout", limit: 8, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { items, address, paymentMethod = "Pago contra entrega", notes = "" } = body;

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ message: "El carrito está vacío" }, { status: 400 });
    }

    if (!address?.fullName || !address?.phone || !address?.street || !address?.city) {
      return NextResponse.json({ message: "Faltan datos obligatorios de envío" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsData = [];
    const whatsappItems = [];

    for (const item of items) {
      const requestedQuantity = Number(item?.quantity);
      if (!item?.id || !Number.isInteger(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > 99) {
        return NextResponse.json({ message: "Hay una cantidad de producto inválida" }, { status: 400 });
      }

      let product = null;

      // 1. Intentar buscar en base de datos PostgreSQL
      try {
        product = await prisma.product.findUnique({
          where: { id: item.id },
          include: { images: true, brand: true, category: true, variants: true },
        });
      } catch (dbErr) {
        product = null;
      }

      // 2. Si no está en BD, buscar en el catálogo de respaldo en memoria
      if (!product) {
        const fallback = getProductById(item.id);
        if (fallback) {
          product = {
            id: fallback.id,
            name: fallback.name,
            slug: fallback.slug || fallback.id,
            description: fallback.description || fallback.shortDesc || "",
            price: fallback.price || item.price || 0,
            stock: fallback.stock ?? 999,
            inStock: fallback.inStock ?? true,
            isActive: true,
            sku: fallback.sku || item.sku || null,
            brand: fallback.brand ? (typeof fallback.brand === "string" ? { name: fallback.brand } : fallback.brand) : null,
            category: fallback.category ? (typeof fallback.category === "string" ? { name: fallback.category } : fallback.category) : null,
            images: fallback.images || [{ url: fallback.image }],
            variants: fallback.variants || [],
          };

          // Intentar registrar el producto en la BD para mantener integridad referencial de OrderItem
          try {
            await prisma.product.upsert({
              where: { id: product.id },
              update: {},
              create: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                description: product.description || "",
                price: Number(product.price) || 0,
                sku: product.sku,
                stock: Number(product.stock) || 0,
                inStock: product.inStock,
              },
            });
          } catch (upsertErr) {
            // No bloquear la orden si la BD tiene restricciones temporales
          }
        } else {
          // Si es un producto del carrito no encontrado en catálogo, usar los datos informados por el cliente
          product = {
            id: item.id,
            name: item.name || "Producto sin nombre",
            slug: item.slug || item.id,
            price: Number(item.price) || 0,
            stock: Number(item.stock) || 999,
            inStock: true,
            isActive: true,
            sku: item.sku || null,
            brand: item.brand ? { name: item.brand } : null,
            category: item.category ? { name: item.category } : null,
            images: [{ url: item.image || "/logo.png" }],
            variants: [],
          };
        }
      }

      const selectedVariant = item.variantId
        ? product.variants?.find((variant) => variant.id === item.variantId)
        : null;

      if (item.variantId && !selectedVariant && product.variants?.length > 0) {
        return NextResponse.json({ message: `La presentación solicitada de ${product.name} ya no está disponible` }, { status: 409 });
      }

      const itemPrice = selectedVariant?.price ?? product.price ?? item.price ?? 0;
      subtotal += itemPrice * requestedQuantity;

      const orderItem = {
        productId: product.id,
        productName: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
        price: itemPrice,
        quantity: requestedQuantity,
        ...(selectedVariant?.id ? { variantId: selectedVariant.id } : {}),
      };
      orderItemsData.push(orderItem);
      whatsappItems.push({
        ...orderItem,
        slug: product.slug,
        sku: selectedVariant?.sku || product.sku || item.sku,
        brand: product.brand?.name || item.brand,
        category: product.category?.name || item.category,
        image: item.image || getProductDisplayImage(product),
      });
    }

    const totalAmount = subtotal;
    const userId = session?.user?.id;
    const fullAddressString = `${address.street}, ${address.city}, ${address.state || ""}${address.zipCode ? ` (${address.zipCode})` : ""}`;

    let order = null;

    // Intentar registrar el pedido en la base de datos
    try {
      order = await prisma.order.create({
        data: {
          customerName: address.fullName,
          customerEmail: address.email || session?.user?.email || "sin-correo@rembertrepuestos.com",
          customerPhone: address.phone,
          address: fullAddressString,
          subtotal,
          totalAmount,
          paymentMethod,
          status: "PENDING",
          userId: userId || null,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      // Guardar dirección si el usuario está autenticado
      if (userId) {
        try {
          await prisma.address.create({
            data: {
              userId,
              title: "Dirección de Envío",
              fullName: address.fullName,
              phone: address.phone,
              street: address.street,
              city: address.city,
              state: address.state || "",
              zipCode: address.zipCode || "",
            },
          });
        } catch (addrErr) {
          console.warn("No se pudo guardar la dirección asociada:", addrErr.message);
        }
      }
    } catch (dbOrderErr) {
      console.warn("No se pudo guardar orden en BD Prisma, generando orden de contingencia:", dbOrderErr.message);
      // Generar orden de contingencia para que el cliente no pierda su cotización/pedido
      const fallbackOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
      order = {
        id: fallbackOrderId,
        customerName: address.fullName,
        customerEmail: address.email || "sin-correo@rembertrepuestos.com",
        customerPhone: address.phone,
        address: fullAddressString,
        subtotal,
        totalAmount,
        paymentMethod,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        items: orderItemsData,
      };
    }

    // Generar formato estructurado para WhatsApp y Email
    const orderNumberStr = order.id.slice(-6).toUpperCase();

    const whatsappText = generateWhatsAppOrderText({
      orderNumber: orderNumberStr,
      customer: address,
      items: whatsappItems,
      totalAmount,
      paymentMethod,
      notes,
    });

    const emailContent = generateEmailOrderContent({
      orderNumber: orderNumberStr,
      customer: address,
      items: whatsappItems,
      totalAmount,
      paymentMethod,
      notes,
    });

    const whatsappUrl = getWhatsAppUrl(whatsappText);
    const mailtoUrl = getMailtoUrl(emailContent);

    return NextResponse.json(
      {
        message: "Pedido registrado con éxito",
        order: {
          ...order,
          orderNumber: orderNumberStr,
        },
        formatted: {
          whatsappText,
          whatsappUrl,
          emailSubject: emailContent.subject,
          emailBody: emailContent.body,
          mailtoUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en checkout:", error);
    return NextResponse.json({ message: "No fue posible registrar el pedido. Inténtalo de nuevo." }, { status: 500 });
  }
}
