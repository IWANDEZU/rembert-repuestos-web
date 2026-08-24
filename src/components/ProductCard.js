"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ProductCompatibilityPanel from "@/components/ProductCompatibilityPanel";
import { getProductReferenceLabel } from "@/lib/productCompatibility";

export default function ProductCard({ product, onExpand, isFavorite = false, imagePriority = false }) {
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
      const response = prevFavorite
        ? await fetch("/api/favorites", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        })
        : await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
      });
      if (!response.ok) throw new Error("No fue posible actualizar el favorito");
    } catch (error) {
      console.error("Error al actualizar favorito", error);
      setFavorite(prevFavorite);
    } finally {
      setIsUpdatingFav(false);
    }
  };

  const imageUrl = getProductDisplayImage(product);
  const referenceLabel = getProductReferenceLabel(product);
  const canBuy = Boolean(product.inStock && Number(product.stock) > 0 && Number(product.price) > 0);

  const handleAddToCart = () => {
    if (!canBuy) return;
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
        stock: product.stock,
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
    <article className="product-card hover-card">
      <div className="product-card__media">
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
            loading={imagePriority ? "eager" : "lazy"}
            fetchPriority={imagePriority ? "high" : "auto"}
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
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 3,
            transition: "transform 0.2s ease",
          }}
        >
          <span style={{ fontSize: "1rem", color: favorite ? "#EF4444" : "#94A3B8" }}>
            {favorite ? "❤️" : "🤍"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleViewExpanded}
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(0, 0, 0, 0.88)",
            color: "var(--primary-color)",
            borderRadius: "999px",
            padding: "3px 9px",
            fontSize: "0.68rem",
            fontWeight: "bold",
            border: "1px solid rgba(255,215,0,0.35)",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          🔍 Ficha
        </button>
      </div>

      <div style={{ margin: "0.5rem 0 0.35rem" }}>
        <h3
          style={{
            fontSize: "0.88rem",
            fontWeight: "700",
            color: "#FFFFFF",
            lineHeight: "1.3",
            marginBottom: "0.25rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.4em",
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
          <span
            style={{
              fontSize: "0.74rem",
              fontWeight: "700",
              color: "#94A3B8",
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              marginBottom: "0.2rem",
            }}
          >
            {typeof product.brand === "string" ? product.brand : product.brand.name}
          </span>
        )}

        <div style={{ marginTop: "0.25rem" }}>
          <ProductCompatibilityPanel product={product} compact dark />
        </div>

        {product.sku && (
          <div style={{ marginTop: "0.3rem" }}>
            <span
              style={{
                fontSize: "0.7rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontWeight: "700",
                color: "#FFD700",
                background: "rgba(255, 215, 0, 0.1)",
                border: "1px solid rgba(255, 215, 0, 0.3)",
                padding: "2px 6px",
                borderRadius: "4px",
                display: "inline-block",
                letterSpacing: "0.02em",
              }}
            >
              {referenceLabel}: {product.sku}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "0.4rem" }}>
        <p style={{ fontSize: "1.18rem", fontWeight: "800", color: "#FFFFFF", marginBottom: "0.5rem" }}>
          {product.price > 0 ? (
            <span>
              <span style={{ color: "#FFD700", fontSize: "0.95rem", marginRight: "2px" }}>$</span>
              {Number(product.price).toLocaleString("es-CO")}
            </span>
          ) : (
            <span style={{ color: "#FFD700", fontSize: "0.88rem" }}>Precio bajo cotización</span>
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {canBuy ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-add-to-cart"
              style={{
                padding: "0.52rem 0.75rem",
                fontSize: "0.82rem",
                fontWeight: "800",
                width: "100%",
                borderRadius: "7px",
                border: added ? "1.5px solid #16A34A" : "1.5px solid #FFD700",
                background: added ? "#16A34A" : "#0A0A0A",
                color: added ? "#FFFFFF" : "#FFD700",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                cursor: "pointer",
                boxShadow: added ? "0 0 10px rgba(22, 163, 74, 0.5)" : "0 2px 8px rgba(0, 0, 0, 0.6)",
                transition: "all 0.2s ease",
              }}
            >
              {added ? (
                <><span>✓</span><span>¡Agregado!</span></>
              ) : (
                <><span style={{ color: "#FFD700", fontSize: "0.95rem" }}>🛒</span><span>Añadir al carrito</span></>
              )}
            </button>
          ) : (
            <div className="product-card__quote-notice product-card__quote-notice--dark" style={{ padding: "0.45rem 0.6rem", fontSize: "0.74rem" }}>
              Validamos referencia y precio antes de vender
            </div>
          )}

          <a
            href={quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn product-card__whatsapp-quote"
            style={{
              padding: "0.48rem 0.75rem",
              fontSize: "0.78rem",
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
              gap: "6px",
              boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
              transition: "opacity 0.2s ease",
            }}
          >
            <WhatsAppIcon size={15} color="#FFFFFF" />
            <span>COTIZAR POR WHATSAPP</span>
          </a>
        </div>
      </div>
    </article>
  );
}
