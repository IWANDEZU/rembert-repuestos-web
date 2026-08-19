"use client";

import { useCart } from "@/components/CartContext";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

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
  const canBuy = product.inStock && product.price > 0;

  const imageUrl = getProductDisplayImage(product);

  const handleAddToCart = () => {
    if (!canBuy) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageUrl,
        brand: product.brand?.name || product.brand || "Victor Services",
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

  return (
    <article
      style={{
        background: "var(--card-dark)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--border-radius)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "#fff",
          height: "180px",
          borderRadius: "8px",
          marginBottom: "0.8rem",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          position: "relative",
        }}
      >
        <a
          href={`/producto/${product.slug || product.id}`}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}
        >
          <Image
            src={imageUrl}
            alt={product.images?.[0]?.alt || product.name}
            width={640}
            height={480}
            unoptimized={imageUrl.startsWith("/api/imagen-referencia")}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
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
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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

        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            title="Ver ficha técnica"
            style={{
              position: "absolute",
              bottom: "6px",
              right: "6px",
              background: "rgba(0, 0, 0, 0.86)",
              color: "var(--primary-color)",
              border: "1px solid #444",
              borderRadius: "16px",
              padding: "4px 8px",
              fontSize: "0.72rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Ficha técnica
          </button>
        )}
      </div>

      <h3 style={{ fontSize: "0.92rem", marginBottom: "0.25rem", flexGrow: 1, lineHeight: "1.3" }}>
        <a href={`/producto/${product.slug || product.id}`} style={{ color: "inherit", textDecoration: "none" }}>
          {product.name}
        </a>
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: "0.25rem" }}>
        {product.brand?.name || product.brand || "Victor Services"}
      </p>
      {product.sku && <p className="product-reference" style={{ marginBottom: "0.6rem" }}>Ref. {product.sku}</p>}

      <p style={{ fontSize: "1.15rem", fontWeight: "bold", color: "var(--primary-color)", marginBottom: "0.8rem" }}>
        {product.price > 0 ? copFormatter.format(product.price) : "Precio bajo cotización"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "auto" }}>
        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            style={{
              padding: "0.4rem 0.6rem",
              fontSize: "0.78rem",
              fontWeight: "bold",
              width: "100%",
              cursor: "pointer",
              border: "1px solid #444",
              background: "#1c1c1c",
              color: "#ccc",
              borderRadius: "6px",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
            }}
          >
            Vista ampliada
          </button>
        )}

        {canBuy ? (
          <>
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn btn--primary"
              style={{
                padding: "0.6rem 0.8rem",
                fontSize: "0.85rem",
                fontWeight: "bold",
                width: "100%",
                border: "none",
                background: added ? "#28a745" : "var(--primary-color)",
                color: added ? "#fff" : "#000",
                borderRadius: "6px",
                transition: "background-color 0.2s ease",
              }}
            >
              {added ? "Agregado" : "Agregar al carrito"}
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
                marginTop: "0.45rem",
                background: "#25D366",
                color: "#071b0d",
                border: "none",
                borderRadius: "6px",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              💬 Cotizar por WhatsApp
            </a>
          </>
        ) : (
          <a
            href={quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary"
            style={{ padding: "0.6rem 0.8rem", fontSize: "0.85rem", width: "100%" }}
          >
            Cotizar por WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
