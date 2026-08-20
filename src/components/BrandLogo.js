import Image from "next/image";

export default function BrandLogo({ width = 240, height = 60, className = "" }) {
  return (
    <div className={`brand-logo-container ${className}`} style={{ display: "inline-flex", alignItems: "center" }}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 540 135" 
        width={width} 
        height={height}
        style={{ width: "auto", height: "100%", maxHeight: `${height}px`, display: "block" }}
        aria-label="Rembert Repuestos BCA"
      >
        <defs>
          <linearGradient id="rembertYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFDD00" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
        </defs>

        {/* Isotipo R estilizado en Amarillo y Corte Deportivo */}
        <g transform="translate(10, 10)">
          <path d="M 0 32 L 28 4 L 28 115 L 0 115 Z" fill="url(#rembertYellow)" />
          <path d="M 36 4 L 84 4 C 106 4, 118 16, 118 36 C 118 52, 107 63, 90 67 L 118 115 L 85 115 L 61 71 L 36 71 L 36 115 L 36 4 Z M 36 24 L 36 51 L 76 51 C 88 51, 93 45, 93 37.5 C 93 30, 88 24, 76 24 Z" fill="url(#rembertYellow)" />
        </g>

        {/* REMBERT en Blanco */}
        <text 
          x="142" 
          y="65" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif" 
          fontWeight="900" 
          fontSize="52" 
          fill="#FFFFFF" 
          letterSpacing="2"
        >
          REMBERT
        </text>

        {/* REPUESTOS BCA en Amarillo */}
        <text 
          x="143" 
          y="107" 
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif" 
          fontWeight="900" 
          fontSize="29.5" 
          fill="url(#rembertYellow)" 
          letterSpacing="3"
        >
          REPUESTOS BCA
        </text>
      </svg>
    </div>
  );
}
