import Image from "next/image";

export default function BrandLogo({ width = 230, height = 62, className = "" }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: "inline-flex", alignItems: "center" }}>
      <Image
        src="/logo-rembert-v5.png"
        alt="Rembert Repuestos BCA"
        width={width}
        height={height}
        priority
        quality={90}
        style={{
          width: "auto",
          height: `${height}px`,
          maxHeight: `${height}px`,
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
