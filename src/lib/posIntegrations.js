/**
 * Sistema de Integración y Adaptadores para POS y ERPs Colombianos
 * Soporta:
 * - Siigo Nube / Zoe POS
 * - Alegra Colombia (Facturación y POS)
 * - Webhook Universal (Para Helisa, World Office, Servipunto, PosCloud, etc.)
 */

export const POS_PROVIDERS = {
  SIIGO: "siigo",
  ALEGRA: "alegra",
  ZOE_POS: "zoe",
  UNIVERSAL: "universal",
};

/**
 * Normaliza un producto proveniente de cualquier POS colombiano al esquema de la web
 */
export function normalizePosProduct(item, provider = POS_PROVIDERS.UNIVERSAL) {
  let name = "";
  let sku = "";
  let price = 0;
  let stock = 0;
  let description = "";
  let brand = "";
  let category = "";
  let inStock = true;

  if (provider === POS_PROVIDERS.SIIGO || provider === POS_PROVIDERS.ZOE_POS) {
    // Estructura oficial API Siigo v1 (/v1/products)
    name = item.name || item.description || "";
    sku = item.code || item.sku || item.identification || "";
    
    // Siigo maneja precios en prices[].price_list
    if (Array.isArray(item.prices) && item.prices.length > 0) {
      price = parseFloat(item.prices[0]?.price_list?.[0]?.value || item.prices[0]?.value || 0);
    } else {
      price = parseFloat(item.price || item.unit_price || 0);
    }

    stock = parseInt(item.available_quantity ?? item.stock ?? item.quantity ?? 0, 10);
    description = item.description || item.additional_fields?.description || "";
    brand = item.brand || item.additional_fields?.brand || "";
    category = item.account_group?.name || item.category || "";
  } else if (provider === POS_PROVIDERS.ALEGRA) {
    // Estructura oficial API Alegra v1 (/api/v1/items)
    name = item.name || "";
    sku = item.reference || item.item_code || "";
    
    if (Array.isArray(item.price)) {
      price = parseFloat(item.price[0]?.price || 0);
    } else {
      price = parseFloat(item.price || 0);
    }

    if (item.inventory) {
      stock = parseInt(item.inventory.availableQuantity ?? item.inventory.quantity ?? 0, 10);
    } else {
      stock = parseInt(item.stock ?? item.quantity ?? 0, 10);
    }

    description = item.description || "";
    category = item.category?.name || "";
  } else {
    // Formato Universal POS Webhook / CSV / JSON
    name = item.nombre || item.name || item.articulo || item.descripcion || "";
    sku = item.sku || item.codigo || item.referencia || item.code || "";
    price = parseFloat(item.precio || item.price || item.valor || item.pvp || 0);
    stock = parseInt(item.stock ?? item.cantidad ?? item.disponible ?? item.inventario ?? 0, 10);
    description = item.descripcion || item.description || item.detalle || "";
    brand = item.marca || item.brand || "";
    category = item.categoria || item.category || item.grupo || "";
  }

  inStock = stock > 0;

  // Generar un slug único basado en el nombre y SKU
  const rawSlug = (name + (sku ? `-${sku}` : ""))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    name: name.trim(),
    slug: rawSlug || `item-${Date.now()}`,
    sku: sku ? sku.trim() : null,
    price: isNaN(price) ? 0 : price,
    stock: isNaN(stock) ? 0 : Math.max(0, stock),
    inStock,
    description: description.trim(),
    brand: brand.trim(),
    category: category.trim(),
  };
}

/**
 * Cliente para sincronización con Siigo Nube API
 */
export class SiigoApiClient {
  constructor({ username, accessKey, apiBase = "https://api.siigo.com/v1" }) {
    this.username = username || process.env.SIIGO_USERNAME;
    this.accessKey = accessKey || process.env.SIIGO_ACCESS_KEY;
    this.apiBase = apiBase;
    this.token = null;
  }

  async authenticate() {
    if (!this.username || !this.accessKey) {
      throw new Error("Credenciales de Siigo no configuradas (SIIGO_USERNAME y SIIGO_ACCESS_KEY)");
    }

    const res = await fetch(`${this.apiBase}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.username,
        access_key: this.accessKey,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error autenticando con Siigo: ${err}`);
    }

    const data = await res.json();
    this.token = data.access_token;
    return this.token;
  }

  async getProducts({ page = 1, pageSize = 50 } = {}) {
    if (!this.token) await this.authenticate();

    const res = await fetch(`${this.apiBase}/products?page=${page}&page_size=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error obteniendo productos de Siigo: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      results: (data.results || []).map((p) => normalizePosProduct(p, POS_PROVIDERS.SIIGO)),
      pagination: data.pagination || null,
    };
  }

  async createInvoice(orderData) {
    if (!this.token) await this.authenticate();

    // Mapeo básico de orden web a factura de venta Siigo
    const invoicePayload = {
      document: { id: 1 }, // Código de documento estándar en Siigo
      date: new Date().toISOString().split("T")[0],
      customer: {
        identification: orderData.customerDoc || "222222222222", // Consumidor final por defecto
        branch_office: 0,
      },
      items: orderData.items.map((item) => ({
        code: item.sku || item.productId,
        description: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      payments: [
        {
          id: 1, // Efectivo / MercadoPago / Transferencia
          value: orderData.total,
          due_date: new Date().toISOString().split("T")[0],
        },
      ],
    };

    const res = await fetch(`${this.apiBase}/invoices`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoicePayload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Error creando factura en Siigo: ${err}`);
    }

    return await res.json();
  }
}

/**
 * Cliente para sincronización con Alegra API Colombia
 */
export class AlegraApiClient {
  constructor({ user, token, apiBase = "https://api.alegra.com/api/v1" }) {
    this.user = user || process.env.ALEGRA_USER;
    this.token = token || process.env.ALEGRA_TOKEN;
    this.apiBase = apiBase;
  }

  getAuthHeader() {
    if (!this.user || !this.token) {
      throw new Error("Credenciales de Alegra no configuradas (ALEGRA_USER y ALEGRA_TOKEN)");
    }
    const credentials = Buffer.from(`${this.user}:${this.token}`).toString("base64");
    return `Basic ${credentials}`;
  }

  async getProducts({ start = 0, limit = 50 } = {}) {
    const res = await fetch(`${this.apiBase}/items?start=${start}&limit=${limit}`, {
      headers: {
        Authorization: this.getAuthHeader(),
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error obteniendo productos de Alegra: ${res.statusText}`);
    }

    const data = await res.json();
    return (Array.isArray(data) ? data : []).map((p) => normalizePosProduct(p, POS_PROVIDERS.ALEGRA));
  }
}
