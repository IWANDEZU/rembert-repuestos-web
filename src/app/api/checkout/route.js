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
import { enforceRateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

class CheckoutConflictError extends Error {}

const cleanText = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

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

    const customer = {
      fullName: cleanText(address?.fullName, 120),
      phone: cleanText(address?.phone, 30),
      email: cleanText(address?.email, 180),
      street: cleanText(address?.street, 240),
      city: cleanText(address?.city, 100),
      state: cleanText(address?.state, 100),
      zipCode: cleanText(address?.zipCode, 20),
    };
    const safeNotes = cleanText(notes, 1000);
    const safePaymentMethod = cleanText(paymentMethod, 40) || "Pago contra entrega";

    if (!customer.fullName || !customer.phone || !customer.street || !customer.city) {
      return NextResponse.json({ message: "Faltan datos obligatorios de envío" }, { status: 400 });
    }

    const normalizedItems = [];
    const seenSkus = new Set();
    for (const item of items) {
      const sku = cleanText(item?.sku, 120);
      const requestedQuantity = Number(item?.quantity);
      if (!sku || !Number.isInteger(requestedQuantity) || requestedQuantity < 1 || requestedQuantity > 99) {
        return NextResponse.json({ message: "Hay una cantidad de producto inválida" }, { status: 400 });
      }
      const key = `${sku.toUpperCase()}:${item.variantId || "base"}`;
      if (seenSkus.has(key)) {
        return NextResponse.json({ message: "El carrito contiene referencias duplicadas" }, { status: 400 });
      }
      seenSkus.add(key);
      normalizedItems.push({ sku, quantity: requestedQuantity, variantId: cleanText(item.variantId, 80) || null, image: cleanText(item.image, 500) });
    }

    const userId = session?.user?.id;
    const fullAddressString = `${customer.street}, ${customer.city}, ${customer.state}${customer.zipCode ? ` (${customer.zipCode})` : ""}`;

    const checkoutResult = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];
      const whatsappItems = [];

      for (const item of normalizedItems) {
        const product = await tx.product.findUnique({
          where: { sku: item.sku },
          include: { images: true, brand: true, category: true, variants: true },
        });
        if (!product) throw new CheckoutConflictError(`La referencia ${item.sku} no está sincronizada. Solicita confirmación por WhatsApp.`);

        const selectedVariant = item.variantId
          ? product.variants.find((variant) => variant.id === item.variantId)
          : null;
        if (item.variantId && !selectedVariant) {
          throw new CheckoutConflictError(`La presentación solicitada de ${product.name} ya no está disponible.`);
        }

        const itemPrice = selectedVariant?.price ?? product.price;
        if (!Number.isFinite(itemPrice) || itemPrice <= 0) {
          throw new CheckoutConflictError(`${product.name} requiere cotización antes de confirmar el pedido.`);
        }

        if (selectedVariant) {
          const reserved = await tx.variant.updateMany({
            where: { id: selectedVariant.id, stock: { gte: item.quantity }, product: { isActive: true } },
            data: { stock: { decrement: item.quantity } },
          });
          if (reserved.count !== 1) throw new CheckoutConflictError(`No hay existencias suficientes de ${product.name}.`);
        } else {
          const reserved = await tx.product.updateMany({
            where: { id: product.id, isActive: true, inStock: true, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (reserved.count !== 1) throw new CheckoutConflictError(`No hay existencias suficientes de ${product.name}.`);
          if (product.stock === item.quantity) {
            await tx.product.update({ where: { id: product.id }, data: { inStock: false } });
          }
        }

        const orderItem = {
          productId: product.id,
          productName: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
          price: itemPrice,
          quantity: item.quantity,
          ...(selectedVariant?.id ? { variantId: selectedVariant.id } : {}),
        };
        subtotal += itemPrice * item.quantity;
        orderItemsData.push(orderItem);
        whatsappItems.push({
          ...orderItem,
          slug: product.slug,
          sku: selectedVariant?.sku || product.sku,
          brand: product.brand?.name,
          category: product.category?.name,
          image: item.image || getProductDisplayImage(product),
        });
      }

      const order = await tx.order.create({
        data: {
          customerName: customer.fullName,
          customerEmail: customer.email || session?.user?.email || "sin-correo@rembertrepuestos.com",
          customerPhone: customer.phone,
          address: fullAddressString,
          subtotal,
          totalAmount: subtotal,
          paymentMethod: safePaymentMethod,
          status: "PENDING",
          userId: userId || null,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
      return { order, subtotal, whatsappItems };
    });
    const { order, subtotal: totalAmount, whatsappItems } = checkoutResult;

    // Guardar dirección si el usuario está autenticado
    if (userId) {
      try {
        await prisma.address.create({
          data: {
            userId,
            title: "Dirección de Envío",
            fullName: customer.fullName,
            phone: customer.phone,
            street: customer.street,
            city: customer.city,
            state: customer.state,
            zipCode: customer.zipCode,
          },
        });
      } catch (addrErr) {
        console.warn("No se pudo guardar la dirección asociada:", addrErr.message);
      }
    }

    // Generar formato estructurado para WhatsApp y Email
    const orderNumberStr = order.id.slice(-6).toUpperCase();

    const whatsappText = generateWhatsAppOrderText({
      orderNumber: orderNumberStr,
      customer,
      items: whatsappItems,
      totalAmount,
      paymentMethod: safePaymentMethod,
      notes: safeNotes,
    });

    const emailContent = generateEmailOrderContent({
      orderNumber: orderNumberStr,
      customer,
      items: whatsappItems,
      totalAmount,
      paymentMethod: safePaymentMethod,
      notes: safeNotes,
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
    if (error instanceof CheckoutConflictError) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: "No fue posible registrar el pedido. Inténtalo de nuevo." }, { status: 500 });
  }
}
