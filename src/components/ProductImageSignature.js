import Image from "next/image";

export default function ProductImageSignature({ product, compact = false }) {
  return (
    <span
      aria-label="Imagen presentada por REMBERT"
      style={{
        position: "absolute",
        top: compact ? "6px" : "10px",
        left: compact ? "6px" : "10px",
        display: "grid",
        placeItems: "center",
        width: compact ? "24px" : "34px",
        height: compact ? "24px" : "34px",
        padding: "2px",
        background: "rgba(255,255,255,0.9)",
        border: "1px solid rgba(15,23,42,0.16)",
        borderRadius: "50%",
        boxShadow: "0 2px 9px rgba(15,23,42,0.2)",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <Image
        src="/icon.png"
        alt="REMBERT"
        width={compact ? 20 : 28}
        height={compact ? 20 : 28}
        style={{ width: compact ? "20px" : "28px", height: compact ? "20px" : "28px", objectFit: "contain" }}
      />
    </span>
  );
}
