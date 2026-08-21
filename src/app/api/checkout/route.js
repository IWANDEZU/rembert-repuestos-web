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

export async function POST(req) {
  const limited = await enforceRateLimit(req, { scope: "checkout", limit: 8, windowMs: 60_000 });
  if (limited) return limited;
  try {
    const session = await getServerSession();
    const body = await req.json();
    const { items, address, paymentMethod = "Pago contra entrega", notes = "" } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "El carrito está vacío" }, { status: 400 });
    }

    if (!address?.fullName || !address?.phone || !address?.street || !address?.city) {
      return NextResponse.json({ message: "Faltan datos obligatorios de envío" }, { status: 400 });
    }

    let subtotal = 0;
    const orderItemsData = [];
    const whatsappItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        include: { images: true, brand: true, category: true, variants: true },
      });
      if (!product) throw new Error(`Producto ${item.id} no encontrado`);
      
      const selectedVariant = item.variantId
        ? product.variants.find((variant) => variant.id === item.variantId)
        : null;
      const itemPrice = selectedVariant?.price ?? product.price;
      subtotal += itemPrice * item.quantity;
      
      const orderItem = {
        productId: product.id,
        productName: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
        price: itemPrice,
        quantity: item.quantity,
        ...(selectedVariant?.id ? { variantId: selectedVariant.id } : {}),
      };
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

    const totalAmount = subtotal;
    const userId = session?.user?.id;
    const fullAddressString = `${address.street}, ${address.city}, ${address.state || ""}${address.zipCode ? ` (${address.zipCode})` : ""}`;

    // Crear el pedido en DB con todos los campos requeridos por el schema Prisma
    const order = await prisma.order.create({
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
    return NextResponse.json(
      { message: "Error interno del servidor", error: error.message },
      { status: 500 }
    );
  }
}
