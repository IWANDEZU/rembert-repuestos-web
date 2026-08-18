/**
 * Formateador de pedidos para WhatsApp y Correo Electrónico
 * Victor Services - Barrancabermeja
 */

export const DESTINATION_WHATSAPP = "573108737354";
export const DESTINATION_EMAIL = "contacto@victorservices.com";
const configuredSiteOrigin = process.env.NEXT_PUBLIC_SITE_URL;
export const SITE_ORIGIN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(configuredSiteOrigin || "")
  ? configuredSiteOrigin.replace(/\/$/, "")
  : "https://www.victorservicesas.com";

/**
 * Convierte una ruta de imagen o producto en una URL pública absoluta.
 * WhatsApp no puede adjuntar un archivo usando wa.me, pero sí puede abrir
 * el enlace público de la foto para que el asesor vea exactamente el artículo.
 */
export function toAbsoluteUrl(value) {
  if (!value || typeof value !== "string") return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `${SITE_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
}

export function getProductPath(item = {}) {
  if (item.productPath) return item.productPath;
  const slug = item.slug || item.product?.slug || item.id || item.product?.id;
  return slug ? `/producto/${encodeURIComponent(slug)}` : "";
}

export function getProductImageUrl(item = {}) {
  const image =
    item.image ||
    item.images?.[0]?.url ||
    item.product?.images?.[0]?.url ||
    item.web_image ||
    item.product?.image;
  return toAbsoluteUrl(image);
}

/**
 * Formatea un precio en pesos colombianos (COP)
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

/**
 * Mensaje para cotizar un producto individual desde una tarjeta o ficha.
 */
export function generateWhatsAppProductText({
  product = {},
  quantity = 1,
  image = "",
  variant = null,
  price,
  extraDetails = "",
}) {
  const productName = product.name || product.productName || product.product?.name || "Producto";
  const reference = variant?.sku || product.sku || product.reference || product.id || "Por confirmar";
  const brand = product.brand?.name || product.brandName || product.brand || "Victor Services";
  const category = product.category?.name || product.categoryName || product.category || "Repuestos automotrices";
  const photoUrl = getProductImageUrl({ ...product, image: image || product.image });
  const productUrl = toAbsoluteUrl(getProductPath(product));
  const selectedName = variant?.name ? `${productName} (${variant.name})` : productName;
  const lines = [
    "Hola Victor Services, deseo cotizar este producto:",
    `*${quantity}x ${selectedName}*`,
    `Referencia: ${reference}`,
    `Marca: ${brand}`,
    `Categoría: ${category}`,
  ];

  const selectedPrice = price ?? variant?.price ?? product.price;
  if (selectedPrice > 0) lines.push(`Precio mostrado: ${formatCurrency(selectedPrice)}`);
  if (photoUrl) lines.push(`📷 Foto del producto: ${photoUrl}`);
  if (productUrl) lines.push(`🔗 Ficha del producto: ${productUrl}`);
  if (extraDetails && extraDetails.trim()) lines.push(extraDetails.trim());
  lines.push("Por favor confirma disponibilidad, compatibilidad y despacho.");
  return lines.join("\n");
}

/**
 * Genera el texto estructurado para WhatsApp
 */
export function generateWhatsAppOrderText({
  orderNumber,
  customer = {},
  items = [],
  totalAmount = 0,
  paymentMethod = "Pago contra entrega",
  notes = "",
}) {
  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let message = `🛒 *NUEVO PEDIDO - VICTOR SERVICES*\n`;
  message += `=================================\n`;
  if (orderNumber) {
    message += `📋 *Pedido N°:* #${orderNumber}\n`;
  }
  message += `📅 *Fecha:* ${dateStr}\n\n`;

  message += `👤 *DATOS DEL CLIENTE*\n`;
  message += `• *Nombre:* ${customer.fullName || "No especificado"}\n`;
  message += `• *Teléfono:* ${customer.phone || "No especificado"}\n`;
  if (customer.email) {
    message += `• *Email:* ${customer.email}\n`;
  }
  
  const addressParts = [customer.street, customer.city, customer.state].filter(Boolean);
  if (addressParts.length > 0) {
    message += `📍 *Dirección:* ${addressParts.join(", ")}\n`;
  }
  if (customer.zipCode) {
    message += `• *Cód. Postal:* ${customer.zipCode}\n`;
  }

  message += `\n📦 *DETALLE DEL PEDIDO*\n`;
  items.forEach((item, index) => {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = item.price || item.unitPrice || 0;
    const itemTotal = unitPrice * quantity;
    const name = item.name || item.productName || item.product?.name || "Producto";
    const reference = item.sku || item.reference || item.product?.sku;
    const brand = item.brand?.name || item.brandName || item.brand || item.product?.brand?.name;
    const category = item.category?.name || item.categoryName || item.category || item.product?.category?.name;
    const photoUrl = getProductImageUrl(item);
    const productUrl = toAbsoluteUrl(getProductPath(item));
    message += `${index + 1}. *${name}*\n`;
    message += `   Cantidad: ${quantity} x ${formatCurrency(unitPrice)}\n`;
    message += `   Subtotal: ${formatCurrency(itemTotal)}\n`;
    if (reference) message += `   Referencia: ${reference}\n`;
    if (brand) message += `   Marca: ${brand}\n`;
    if (category) message += `   Categoría: ${category}\n`;
    if (photoUrl) message += `   📷 Foto: ${photoUrl}\n`;
    if (productUrl) message += `   🔗 Producto: ${productUrl}\n`;
  });

  message += `\n=================================\n`;
  message += `💰 *TOTAL A PAGAR:* ${formatCurrency(totalAmount)}\n`;
  message += `💳 *Método de Pago:* ${paymentMethod}\n`;

  if (notes && notes.trim()) {
    message += `📝 *Notas:* ${notes.trim()}\n`;
  }

  message += `=================================\n`;
  message += `¡Hola! Quisiera confirmar la disponibilidad y envío de este pedido.`;

  return message;
}

/**
 * Genera el enlace directo a WhatsApp
 */
export function getWhatsAppUrl(text, phone = DESTINATION_WHATSAPP) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
}

/**
 * Genera el cuerpo y asunto estructurado para Correo Electrónico
 */
export function generateEmailOrderContent({
  orderNumber,
  customer = {},
  items = [],
  totalAmount = 0,
  paymentMethod = "Pago contra entrega",
  notes = "",
}) {
  const subject = `Nuevo Pedido ${orderNumber ? `#${orderNumber} ` : ""}- Victor Services`;

  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let body = `SOLICITUD DE NUEVO PEDIDO - VICTOR SERVICES\n`;
  body += `==================================================\n`;
  if (orderNumber) {
    body += `Número de Pedido: #${orderNumber}\n`;
  }
  body += `Fecha: ${dateStr}\n\n`;

  body += `INFORMACIÓN DEL CLIENTE:\n`;
  body += `- Nombre Completo: ${customer.fullName || "No especificado"}\n`;
  body += `- Teléfono / Celular: ${customer.phone || "No especificado"}\n`;
  body += `- Correo Electrónico: ${customer.email || "No especificado"}\n`;
  body += `- Dirección: ${customer.street || "No especificada"}\n`;
  body += `- Ciudad: ${customer.city || "No especificada"}\n`;
  body += `- Departamento: ${customer.state || "No especificado"}\n`;
  if (customer.zipCode) {
    body += `- Código Postal: ${customer.zipCode}\n`;
  }

  body += `\nPRODUCTOS SOLICITADOS:\n`;
  body += `--------------------------------------------------\n`;
  items.forEach((item, index) => {
    const itemTotal = (item.price || item.unitPrice || 0) * item.quantity;
    const name = item.name || item.productName || item.product?.name || "Producto";
    body += `${index + 1}. ${name}\n`;
    body += `   Cantidad: ${item.quantity} | Valor unitario: ${formatCurrency(item.price || item.unitPrice)} | Subtotal: ${formatCurrency(itemTotal)}\n`;
  });

  body += `--------------------------------------------------\n`;
  body += `TOTAL GENERAL: ${formatCurrency(totalAmount)}\n`;
  body += `Método de Pago Preferido: ${paymentMethod}\n`;

  if (notes && notes.trim()) {
    body += `\nNotas Adicionales:\n${notes.trim()}\n`;
  }

  body += `==================================================\n`;
  body += `Mensaje enviado desde la tienda online Victor Services.`;

  return { subject, body };
}

/**
 * Genera enlace de mailto para el correo
 */
export function getMailtoUrl({
  to = DESTINATION_EMAIL,
  subject = "",
  body = "",
}) {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
