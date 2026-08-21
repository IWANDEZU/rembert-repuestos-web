export default function manifest() {
  return {
    name: "REMBERT | Repuestos Automotrices, Lubricantes & Radiadores",
    short_name: "REMBERT",
    description:
      "Venta de repuestos automotrices, lubricantes, filtros y radiadores en Barrancabermeja, Colombia.",
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
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
