"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { getProductDisplayImage, isDynamikProduct } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ProductCompatibilityPanel from "@/components/ProductCompatibilityPanel";
import { getProductReferenceLabel } from "@/lib/productCompatibility";
import ProductImageSignature from "@/components/ProductImageSignature";

export default function ProductCard({ product, onExpand, isFavorite = false, isRepeated = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isUpdatingFav, setIsUpdatingFav] = useState(false);
  const [unavailableImageUrl, setUnavailableImageUrl] = useState("");
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
  const isDynamik = isDynamikProduct(product);
  const isGeneratedReference = product.imageStatus === "generated-reference-image";
  const referenceLabel = getProductReferenceLabel(product);
  const canBuy = Boolean(product.inStock && Number(product.stock) > 0 && Number(product.price) > 0);

  const isImageUnavailable = unavailableImageUrl === imageUrl;

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
      <div
        className={`product-card__media ${isRepeated ? "product-card__media--repeated" : ""}`}
        style={
          isRepeated
            ? {
                border: "2px solid #EF4444",
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
              }
            : {}
        }
      >
        <Link
          href={`/producto/${product.slug || product.id}`}
          className="product-card__media-link"
          aria-label={`Ver ${product.name}`}
          style={{ position: "relative", display: "block", width: "100%", height: "100%" }}
        >
          {!imageUrl || isImageUnavailable ? (
            <span
              role="status"
              style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: "16px", textAlign: "center", color: "#475569", fontSize: "0.78rem", fontWeight: 700, background: "#F8FAFC" }}
            >
              Foto real pendiente de validación
            </span>
          ) : (
            <Image
              src={imageUrl}
              alt={product.images?.[0]?.alt || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 260px"
              quality={isDynamik ? 100 : undefined}
              unoptimized={isDynamik || imageUrl.startsWith("/api/imagen-referencia")}
              onError={() => setUnavailableImageUrl(imageUrl)}
              loading="lazy"
              decoding="async"
              className="product-card__image"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          )}
          <ProductImageSignature product={product} compact />
          {isGeneratedReference && (
            <span
              role="note"
              style={{ position: "absolute", left: "6px", bottom: "6px", zIndex: 3, borderRadius: "999px", background: "#1E293B", color: "#F8FAFC", padding: "4px 7px", fontSize: "0.64rem", fontWeight: 800, letterSpacing: "0.01em" }}
            >
              Ilustración IA · no verificada
            </span>
          )}
        </Link>



        <button
          type="button"
          onClick={toggleFavorite}
          disabled={isUpdatingFav}
          title={favorite ? "Remover de favoritos" : "Guardar en favoritos"}
          aria-label={favorite ? "Remover de favoritos" : "Guardar en favoritos"}
          style={{
            position: "absolute",
            top: "6px",
            right: "6px",
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
            zIndex: 3,
            transition: "transform 0.2s ease",
          }}
        >
          <span style={{ fontSize: "0.95rem", color: favorite ? "#EF4444" : "#94A3B8" }}>
            {favorite ? "❤️" : "🤍"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleViewExpanded}
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            background: "rgba(0, 0, 0, 0.88)",
            color: "var(--primary-color)",
            borderRadius: "999px",
            padding: "3px 8px",
            fontSize: "clamp(0.64rem, 1.8vw, 0.70rem)",
            fontWeight: "800",
            border: "1px solid rgba(255,215,0,0.4)",
            cursor: "pointer",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          🔍 Ficha
        </button>
      </div>

      <div style={{ margin: "0.45rem 0 0.3rem", display: "flex", flexDirection: "column", gap: "2px" }}>
        <h3
          className="product-card__title"
          style={{
            fontSize: "clamp(0.82rem, 2.2vw, 0.90rem)",
            fontWeight: "700",
            color: "#FFFFFF",
            lineHeight: "1.25",
            marginBottom: "0.15rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "2.3em",
            textWrap: "balance",
          }}
        >
          <Link
            href={`/producto/${product.slug || product.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {product.name}
          </Link>
        </h3>

        {product.brand && (
          <span
            style={{
              fontSize: "clamp(0.68rem, 1.8vw, 0.74rem)",
              fontWeight: "800",
              color: "#94A3B8",
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.03em",
            }}
          >
            {typeof product.brand === "string" ? product.brand : product.brand.name}
          </span>
        )}

        <div style={{ marginTop: "0.2rem" }}>
          <ProductCompatibilityPanel product={product} compact dark />
        </div>

        {product.sku && (
          <div style={{ marginTop: "0.25rem" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontWeight: "700",
                color: "#FFD700",
                background: "rgba(255, 215, 0, 0.1)",
                border: "1px solid rgba(255, 215, 0, 0.3)",
                padding: "2px 6px",
                borderRadius: "4px",
                display: "inline-block",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              {referenceLabel}: {product.sku}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "0.35rem" }}>
        <p style={{ fontSize: "clamp(1.05rem, 3vw, 1.20rem)", fontWeight: "900", color: "#FFFFFF", marginBottom: "0.45rem" }}>
          {product.price > 0 ? (
            <span>
              <span style={{ color: "#FFD700", fontSize: "0.90rem", marginRight: "2px" }}>$</span>
              {Number(product.price).toLocaleString("es-CO")}
            </span>
          ) : (
            <span style={{ color: "#FFD700", fontSize: "0.82rem" }}>{product.availabilityLabel || "Precio bajo cotización"}</span>
          )}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {canBuy ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-add-to-cart"
              style={{
                padding: "0.48rem 0.65rem",
                fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
                fontWeight: "800",
                width: "100%",
                minHeight: "36px",
                borderRadius: "6px",
                border: added ? "1.5px solid #16A34A" : "1.5px solid #FFD700",
                background: added ? "#16A34A" : "#0A0A0A",
                color: added ? "#FFFFFF" : "#FFD700",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                cursor: "pointer",
                boxShadow: added ? "0 0 10px rgba(22, 163, 74, 0.5)" : "0 2px 6px rgba(0, 0, 0, 0.5)",
                transition: "all 0.2s ease",
              }}
            >
              {added ? (
                <><span>✓</span><span>¡Agregado!</span></>
              ) : (
                <><span style={{ color: "#FFD700", fontSize: "0.90rem" }}>🛒</span><span>Añadir al carrito</span></>
              )}
            </button>
          ) : (
            <div className="product-card__quote-notice product-card__quote-notice--dark" style={{ padding: "0.4rem 0.5rem", fontSize: "0.72rem" }}>
              {product.availabilityLabel || "Validamos referencia y precio antes de vender"}
            </div>
          )}

          <a
            href={quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn product-card__whatsapp-quote"
            style={{
              padding: "0.45rem 0.65rem",
              fontSize: "clamp(0.68rem, 1.9vw, 0.76rem)",
              fontWeight: "700",
              width: "100%",
              minHeight: "34px",
              background: "#25D366",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              textAlign: "center",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              boxShadow: "0 2px 6px rgba(37, 211, 102, 0.25)",
              transition: "opacity 0.2s ease",
            }}
          >
            <WhatsAppIcon size={14} color="#FFFFFF" />
            <span>COTIZAR POR WHATSAPP</span>
          </a>
        </div>
      </div>
    </article>
  );
}
