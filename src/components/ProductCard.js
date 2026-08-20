"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";

export default function ProductCard({ product, onExpand, isFavorite = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/login");
      return;
    }

    setIsUpdatingFav(true);
    const prevFavorite = favorite;
    setFavorite(!favorite);

    try {
      if (prevFavorite) {
        await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
      }
    } catch (error) {
      console.error("Error al actualizar favorito", error);
      setFavorite(prevFavorite);
    } finally {
      setIsUpdatingFav(false);
    }
  };

  const imageUrl = getProductDisplayImage(product);
  const compatibilityAttribute = Array.isArray(product.attributes)
    ? product.attributes.find((attribute) =>
        ["modelos compatibles", "modelos orientativos"].includes(String(attribute.name || "").toLowerCase())
      )
    : null;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price > 0 ? product.price : 0,
        image: imageUrl,
        brand: product.brand?.name || product.brand || "REMBERT",
        category: product.category?.name || product.category || "Repuestos automotrices",
        sku: product.sku || "",
        slug: product.slug || product.id,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const quoteUrl = getWhatsAppUrl(
    generateWhatsAppProductText({ product, image: imageUrl, quantity: 1 })
  );

  const handleViewExpanded = (e) => {
    e.preventDefault();
    if (onExpand) {
      onExpand();
    } else {
      router.push(`/producto/${product.slug || product.id}`);
    }
  };

  return (
    <article
      className="product-card hover-card"
    >
      <div
        className="product-card__media"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "185px",
          minHeight: "185px",
          overflow: "hidden",
        }}
      >
        <a
          href={`/producto/${product.slug || product.id}`}
          className="product-card__media-link"
          aria-label={`Ver ${product.name}`}
          style={{ position: "relative", display: "block", width: "100%", height: "100%" }}
        >
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 260px"
            unoptimized={imageUrl.startsWith("/api/imagen-referencia")}
            loading="lazy"
            decoding="async"
            className="product-card__image"
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        </a>

        <button
          type="button"
          onClick={toggleFavorite}
          disabled={isUpdatingFav}
          title={favorite ? "Remover de favoritos" : "Guardar en favoritos"}
          aria-label={favorite ? "Remover de favoritos" : "Guardar en favoritos"}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            zIndex: 10,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={favorite ? "#e63946" : "none"}
            stroke={favorite ? "#e63946" : "#666"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="18"
            height="18"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <button
          type="button"
          onClick={handleViewExpanded}
          title="Ver ficha técnica"
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            background: "#111111",
            color: "var(--primary-color)",
            border: "1px solid #333",
            borderRadius: "16px",
            padding: "4px 8px",
            fontSize: "0.72rem",
            fontWeight: "bold",
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          Ficha técnica
        </button>
      </div>

      <h3
        style={{
          fontSize: "0.98rem",
          fontWeight: "700",
          marginBottom: "0.25rem",
          lineHeight: "1.35",
          color: "#111111",
          minHeight: "2.6rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        <a href={`/producto/${product.slug || product.id}`} style={{ color: "inherit", textDecoration: "none" }}>
          {product.name}
        </a>
      </h3>

      <p style={{ color: "#5A6A80", fontSize: "0.82rem", marginBottom: "0.35rem", fontWeight: "500" }}>
        {product.brand?.name || product.brand || "Rembert Repuestos BCA"}
      </p>

      {compatibilityAttribute?.value && (
        <p style={{ color: "#334155", fontSize: "0.78rem", lineHeight: "1.35", marginBottom: "0.55rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          <strong>Compatible:</strong> {compatibilityAttribute.value}
        </p>
      )}

      <div style={{ marginBottom: "0.65rem" }}>
        <span className="product-reference">
          Ref. {product.sku || (product.id ? `REM-${String(product.id).slice(-6).toUpperCase()}` : "REM-BCA")}
        </span>
      </div>

      <p style={{ fontSize: "1.25rem", fontWeight: "800", color: "#111111", marginBottom: "0.85rem" }}>
        {product.price > 0 ? (
          <span>
            <span style={{ color: "#B8860B", fontSize: "1rem", marginRight: "2px" }}>$</span>
            {Number(product.price).toLocaleString("es-CO")}
          </span>
        ) : (
          <span style={{ color: "#B8860B", fontSize: "0.95rem" }}>Precio bajo cotización</span>
        )}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
        <button
          type="button"
          onClick={handleViewExpanded}
          style={{
            padding: "0.5rem 0.6rem",
            fontSize: "0.8rem",
            fontWeight: "700",
            width: "100%",
            cursor: "pointer",
            border: "1px solid #E2E8F0",
            background: "#F1F5F9",
            color: "#334155",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
        >
          🔍 Vista ampliada
        </button>

        {product.price > 0 && product.inStock !== false && (product.stock ?? 1) > 0 && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn--primary"
            style={{
              padding: "0.65rem 0.8rem",
              fontSize: "0.85rem",
              fontWeight: "800",
              width: "100%",
              border: "none",
              background: added ? "#16A34A" : "var(--primary-color)",
              color: added ? "#FFFFFF" : "#111111",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            {added ? "✓ Agregado al carrito" : "🛒 Agregar al carrito"}
          </button>
        )}

        <a
          href={quoteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn product-card__whatsapp-quote"
          style={{
            padding: "0.55rem 0.8rem",
            fontSize: "0.82rem",
            fontWeight: "bold",
            width: "100%",
            background: "#25D366",
            color: "#071b0d",
            border: "none",
            borderRadius: "6px",
            textAlign: "center",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            transition: "opacity 0.2s ease",
          }}
        >
          💬 Cotizar por WhatsApp
        </a>
      </div>
    </article>
  );
}
