export default function manifest() {
  return {
    name: "Victor Services | Lubricantes y Filtros",
    short_name: "Victor Services",
    description:
      "Venta de lubricantes y filtros para motores diésel y gasolina en Barrancabermeja, Colombia.",
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
