"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const MEDIA_ITEMS = [
  {
    id: "video-comercial",
    type: "video",
    src: "/flyers/rembert-comercial-8s.mp4",
    title: "Comercial Oficial Rembert Repuestos",
    subtitle: "38 Años de Calidad y Confianza Automotriz",
    badge: "🎬 VIDEO OFICIAL",
    ctaLabel: "Explorar Catálogo",
    ctaHref: "/catalogo",
    duration: 8000,
  },
  {
    id: "flyer-promo-rembert",
    type: "image",
    src: "/flyers/flyer-promo-rembert.png",
    title: "Todo para tu Vehículo al Mejor Precio",
    subtitle: "Repuestos originales y alternativos garantizados",
    badge: "🏷️ FLYER PROMOCIONAL",
    ctaLabel: "Cotizar por WhatsApp",
    ctaHref: "https://wa.me/573102420490?text=Hola%2C%20quisiera%20cotizar%20repuestos%20vistos%20en%20el%20flyer.",
    duration: 6000,
  },
  {
    id: "flyer-embragues-dynamik",
    type: "image",
    src: "/flyers/flyer-embragues-dynamik.png",
    title: "Kits de Embrague DYNAMIK",
    subtitle: "Prensa, Disco y Balinera con Máximo Rendimiento",
    badge: "⚙️ LÍNEA DYNAMIK",
    ctaLabel: "Ver Línea DYNAMIK",
    ctaHref: "/marcas/dynamik",
    duration: 6000,
  },
  {
    id: "banner-suspension",
    type: "image",
    src: "/banners/rembert-banner-promocional-suspension-v4.jpg",
    title: "Suspensión, Amortiguadores y Frenos",
    subtitle: "Seguridad y estabilidad para todas las marcas",
    badge: "🛞 SUSPENSIÓN & FRENOS",
    ctaLabel: "Ver Suspensión",
    ctaHref: "/catalogo?category=frenos-y-suspension",
    duration: 6000,
  },
  {
    id: "banner-productos",
    type: "image",
    src: "/banners/rembert-banner-promocional-productos-v2.jpg",
    title: "Filtros, Lubricantes y Eléctricos",
    subtitle: "Stock disponible para entrega inmediata y envíos",
    badge: "📦 STOCK NACIONAL",
    ctaLabel: "Ver Catálogo Completo",
    ctaHref: "/catalogo",
    duration: 6000,
  },
];

export default function HeroMediaShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const currentItem = MEDIA_ITEMS[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % MEDIA_ITEMS.length);
    setProgress(0);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + MEDIA_ITEMS.length) % MEDIA_ITEMS.length);
    setProgress(0);
  }, []);

  // Control de reproducción automática y barra de progreso
  useEffect(() => {
    if (isPaused) return undefined;

    const duration = currentItem.duration || 6000;
    const intervalMs = 100;
    const increment = (intervalMs / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, currentItem.duration, handleNext]);

  // Si la diapositiva actual es video, asegurar reproducción automática sin sonido
  useEffect(() => {
    if (currentItem.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Reproducción bloqueada por políticas del navegador
      });
    }
  }, [currentIndex, currentItem.type]);

  return (
    <div
      className="hero-media-showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Galería promocional de videos y flyers"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "460px",
        height: "440px",
        margin: "0 auto",
        borderRadius: "16px",
        overflow: "hidden",
        background: "linear-gradient(145deg, #181A20 0%, #0D0E12 100%)",
        border: "2px solid rgba(255, 215, 0, 0.4)",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 215, 0, 0.15)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Contenedor del Medio (Video o Imagen) */}
      <div style={{ position: "relative", width: "100%", flex: 1, overflow: "hidden", background: "#000000" }}>
        {currentItem.type === "video" ? (
          <video
            ref={videoRef}
            src={currentItem.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <Image
            src={currentItem.src}
            alt={currentItem.title}
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            priority={currentIndex === 0}
            style={{
              objectFit: "contain",
              display: "block",
              transition: "transform 0.4s ease",
            }}
          />
        )}

        {/* Badge Superior Tipo Chip */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 10,
            background: "rgba(10, 10, 10, 0.85)",
            backdropFilter: "blur(6px)",
            color: "#FFD700",
            border: "1px solid rgba(255, 215, 0, 0.4)",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.72rem",
            fontWeight: "800",
            letterSpacing: "0.5px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFD700", display: "inline-block", animation: "pulse 1.5s infinite" }} />
          <span>{currentItem.badge}</span>
        </div>

        {/* Contador Diapositivas */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.75)",
            color: "#E2E8F0",
            padding: "3px 8px",
            borderRadius: "12px",
            fontSize: "0.72rem",
            fontWeight: "700",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {currentIndex + 1} / {MEDIA_ITEMS.length}
        </div>

        {/* Flechas de Navegación Manual */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Contenido anterior"
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 15,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            fontSize: "1.1rem",
            fontWeight: "900",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFD700";
            e.currentTarget.style.color = "#111111";
            e.currentTarget.style.borderColor = "#FFD700";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.65)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          ‹
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente contenido"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 15,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(4px)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            fontSize: "1.1rem",
            fontWeight: "900",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#FFD700";
            e.currentTarget.style.color = "#111111";
            e.currentTarget.style.borderColor = "#FFD700";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0, 0, 0, 0.65)";
            e.currentTarget.style.color = "#FFFFFF";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          ›
        </button>
      </div>

      {/* Pie de Información y Botón de Acción */}
      <div
        style={{
          padding: "10px 14px 12px",
          background: "linear-gradient(180deg, #111317 0%, #08090B 100%)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <h4
              style={{
                margin: 0,
                fontSize: "0.88rem",
                fontWeight: "800",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentItem.title}
            </h4>
            <p
              style={{
                margin: "1px 0 0",
                fontSize: "0.74rem",
                color: "#94A3B8",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentItem.subtitle}
            </p>
          </div>

          <Link
            href={currentItem.ctaHref}
            target={currentItem.ctaHref.startsWith("http") ? "_blank" : undefined}
            rel={currentItem.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
            style={{
              flexShrink: 0,
              background: "linear-gradient(135deg, #FFD700 0%, #D4A000 100%)",
              color: "#111111",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "0.76rem",
              fontWeight: "900",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 8px rgba(212, 160, 0, 0.35)",
              whiteSpace: "nowrap",
            }}
          >
            <span>{currentItem.ctaLabel}</span>
            <span>→</span>
          </Link>
        </div>

        {/* Barra de Progreso y Mini-Píldoras */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {MEDIA_ITEMS.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                }}
                aria-label={`Ir al contenido ${idx + 1}: ${item.title}`}
                style={{
                  flex: 1,
                  height: "4px",
                  borderRadius: "2px",
                  background: isActive ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isActive && (
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "#FFD700",
                      borderRadius: "2px",
                      transition: "width 0.1s linear",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
