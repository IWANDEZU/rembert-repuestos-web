export default function manifest() {
  return {
    name: "Rembert Repuestos BCA | Lubricantes y Filtros",
    short_name: "Rembert BCA",
    description:
      "Venta de lubricantes, filtros, frenos y repuestos automotrices en Barrancabermeja, Colombia.",
    start_url: "/",
    display: "standalone",
    background_color: "#101010",
    theme_color: "#101010",
    lang: "es",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
