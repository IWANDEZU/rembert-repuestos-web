import Image from "next/image";

export default function BrandLogo({ width = 285, height = 105, className = "" }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: "inline-flex", alignItems: "center" }}>
      <Image
        src="/logo-rembert-v5.png"
        alt="Rembert Repuestos BCA"
        width={width}
        height={height}
        priority
        quality={95}
        style={{
          width: "auto",
          height: `${height}px`,
          maxHeight: `${height}px`,
          maxWidth: "100%",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}
