# Activos de marca para imágenes de producto

Estos archivos se superponen de forma determinista después de preparar la imagen del producto. Los modelos generativos no dibujan ni reinterpretan los logotipos.

| Marca | Activo vigente | Tratamiento | Origen |
| --- | --- | --- | --- |
| ADS | `ads-product-logo-blue-catalog.png` | Logotipo azul de catálogo, sin recolorear el repuesto | Recorte preservado del arte ADS publicado en `tmp/ads-research/pagina-31.png` |
| GTI | `gti-product-logo-capsule.svg` | Texto amarillo `#FFD400` dentro de cápsula azul `#073B78` | Tratamiento vectorial aprobado para este catálogo |

`scripts/brand-generated-product-images.mjs` registra el SHA-256 del activo aplicado y `scripts/validate-branded-generated-images.mjs` comprueba el mismo hash, la variante y la coincidencia visual. `ads-product-logo-blue.svg` se conserva como activo histórico, pero no forma parte del pipeline vigente.

Estos distintivos identifican el tratamiento editorial del catálogo. No convierten una recreación referencial en fotografía física del fabricante.
