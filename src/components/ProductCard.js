"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getProductCompatibility } from "@/lib/productCompatibility";

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
  const compatibilityText = getProductCompatibility(product);

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
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        borderRadius: "14px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        position: "relative",
      }}
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
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 3,
            transition: "transform 0.2s ease",
          }}
        >
          <span style={{ fontSize: "1rem", color: favorite ? "#EF4444" : "#94A3B8" }}>
            {favorite ? "❤️" : "🤍"}
          </span>
        </button>

        <a
          href={`/producto/${product.slug || product.id}`}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(0, 0, 0, 0.9)",
            color: "#FFF",
            borderRadius: "999px",
            padding: "3px 8px",
            fontSize: "0.68rem",
            fontWeight: "bold",
            textDecoration: "none",
            zIndex: 2,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Ficha técnica
        </a>
      </div>

      <div style={{ margin: "0.75rem 0 0.5rem" }}>
        <h3
          style={{
            fontSize: "0.95rem",
            fontWeight: "700",
            color: "#1E293B",
            lineHeight: "1.3",
            marginBottom: "0.35rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.5rem",
          }}
        >
          <a
            href={`/producto/${product.slug || product.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </a>
        </h3>

        {product.brand && (
          <span style={{ fontSize: "0.78rem", fontWeight: "600", color: "#64748B", display: "block" }}>
            {typeof product.brand === "string" ? product.brand : product.brand.name}
          </span>
        )}

        {compatibilityText ? (
          <p
            style={{
              fontSize: "0.74rem",
              color: "#475569",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              padding: "4px 6px",
              marginTop: "0.35rem",
              lineHeight: "1.25",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={compatibilityText}
          >
            <strong>Compatible con:</strong> {compatibilityText}
          </p>
        ) : null}

        {product.sku && (
          <span
            style={{
              fontSize: "0.7rem",
              fontFamily: "monospace",
              color: "#664d03",
              background: "#fff3cd",
              padding: "2px 6px",
              borderRadius: "4px",
              display: "inline-block",
              marginTop: "0.25rem",
            }}
          >
            Ref. {product.sku}
          </span>
        )}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
        <p style={{ fontSize: "1.25rem", fontWeight: "800", color: "#111111", marginBottom: "0.65rem" }}>
          {product.price > 0 ? (
            <span>
              <span style={{ color: "#B8860B", fontSize: "1rem", marginRight: "2px" }}>$</span>
              {Number(product.price).toLocaleString("es-CO")}
            </span>
          ) : (
            <span style={{ color: "#B8860B", fontSize: "0.95rem" }}>Precio bajo cotización</span>
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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

          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-add-to-cart"
            style={{
              padding: "0.65rem 0.8rem",
              fontSize: "0.85rem",
              fontWeight: "800",
              width: "100%",
              borderRadius: "8px",
              border: added ? "1.5px solid #16A34A" : "1.5px solid #FFD700",
              background: added ? "#16A34A" : "#111111",
              color: added ? "#FFFFFF" : "#FFD700",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              cursor: "pointer",
              boxShadow: added ? "0 0 10px rgba(22, 163, 74, 0.5)" : "0 2px 8px rgba(0, 0, 0, 0.4)",
              transition: "all 0.22s ease",
            }}
          >
            {added ? (
              <>
                <span>✓</span>
                <span>¡Agregado al carrito!</span>
              </>
            ) : (
              <>
                <span style={{ color: "#FFD700", fontSize: "1rem" }}>🛒</span>
                <span>Añadir al carrito</span>
              </>
            )}
          </button>

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
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              textAlign: "center",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
              transition: "opacity 0.2s ease, transform 0.2s ease",
            }}
          >
            <WhatsAppIcon size={17} color="#FFFFFF" />
            <span>COTIZAR POR WHATSAPP</span>
          </a>
        </div>
      </div>
    </article>
  );
}
