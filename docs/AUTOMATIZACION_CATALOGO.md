# Automatización segura del catálogo

## Regla operativa

- Procesar entre 1 y 10 productos por lote.
- Usar máximo 3 fuentes HTTPS por producto.
- No publicar una familia visual como compatibilidad exacta.
- No inventar OEM, años, motor, precio ni existencia.
- La imagen de entrada debe ser una fotografía real de mínimo 500×500 px.
- El logo de fabricante debe provenir de un archivo oficial y el medallón REMBERT se aplica automáticamente.

## Cargar un lote

1. Copiar `docs/catalog-import.example.json` y completar los datos verificados.
2. Ejecutar:

   `npm run catalog:import -- E:\ruta\lote.json`

3. Validar:

   `npm run catalog:check`

4. Revisar visualmente los WebP en `public/catalogo-automatizado/`.
5. Enviar los cambios a la rama `cloudflare-migration`. El workflow validará y desplegará Cloudflare automáticamente.

## Resultados

- Imagen cuadrada WebP 1200×1200, fondo blanco, pieza completa con `contain`.
- Logo oficial arriba a la izquierda y REMBERT abajo a la derecha.
- Metadatos EXIF básicos, manifest de fuentes y ficha generada en `src/data/automatedCatalogProducts.js`.
- Productos sin precio confirmado quedan en cotización y sin existencia inventada.

## Protección contra errores y bucles

- Caché local por hash de URL en `.catalog-cache/`.
- Una descarga por recurso y máximo 3 redirecciones.
- Límite de 15 MB por imagen y tiempo de espera de 15 segundos.
- Rechazo de SKU/slug duplicado, hosts locales, HTTP inseguro y compatibilidad vaga.
- Escritura del catálogo solo después de validar y procesar todo el lote.
