# Auditoría de imágenes GTI Autoparts — 2026-08-26

## Criterio de publicación

- Una foto se considera utilizable solo cuando la fuente identifica la referencia GTI exacta y la pieza coincide con lado de montaje, tipo, accesorios visibles y, cuando aplica, corona ABS.
- Una pieza visualmente parecida no se acepta como sustituto.
- No se genera la geometría de una junta, tulipa, eje, estriado o corona ABS sin una fotografía real de esa misma referencia.
- Las fotos aprobadas se publican sobre fondo blanco. Las fichas sin evidencia muestran un estado vacío de **Foto real pendiente**, nunca una pieza genérica.

## Resultado público después de incorporar el catálogo externo

- Fichas GTI publicadas: **464**.
- Referencias con existencia, separadas al inicio: **48**.
- Referencias externas sin existencia, consultar: **416**.
- Referencias exactas con imagen directa trazable: **32**.
- Versiones web derivadas retiradas por posible alteración visual: **2**.
- Foto real pendiente entre las disponibles: **16**.
- Foto real pendiente en el catálogo externo: **416**.
- Pendientes totales de foto exacta: **432**.
- Galerías con composición generada secundaria: **0**.
- Fichas GTI con ilustración genérica o pieza generada sin fuente exacta: **0**.

## Fotos reales aprobadas

| Referencia | Comprobación visual | Estado |
| --- | --- | --- |
| GTI01-028 | Tulipa / punta lado caja derecha; cuerpo tipo trípode y guardapolvo separados; fondo blanco | Aprobada con validación final de etiqueta y medidas |
| GTI01-038 | Punta lado rueda; junta, guardapolvo, grasa, seguros y abrazaderas; fondo blanco | Aprobada con validación final de etiqueta y medidas |
| GTI01-064 | Punta lado rueda Duster; junta, guardapolvo, grasa y abrazaderas; fondo blanco | Aprobada con validación final de etiqueta y medidas |
| GTI01-102 | Punta lado rueda 23 × 22 declarada; cuerpo de junta sobre fondo blanco | Aprobada con validación final de etiqueta y medidas |
| GTI04-128 | Punta lado rueda con corona ABS visible; guardapolvo, grasa, seguros y abrazaderas; fondo blanco | Aprobada con validación final de 40 dientes y medidas |
| GTI04-035 | Punta lado rueda Optra/Astra 33 × 23; corona ABS de 47 dientes, guardapolvo y accesorios sobre fondo blanco | Foto directa enlazada desde ficha exacta Imotriz y contrastada con Mercado Libre |
| GTI04-066 | Tulipa lado caja Spark GT 22 × 20; grabado GTI04-066+, guardapolvo, abrazaderas, seguros y grasa visibles | Foto original directa de publicación exacta GTI04-066+ |
| GTI01-027 | Punta lado rueda Logan 21 × 21; cuerpo completo, pin interno y fondo blanco | Foto directa de publicación GTI01-027+ |
| GTI04-002 | Punta lado rueda Corsa / Racer / Cielo / Lanos 22 × 30; cuerpo completo sobre fondo blanco | Foto directa de publicación GTI04-002+ |
| GTI04-046 | Punta lado rueda Aveo Korea 22 × 22; corona ABS de 47 dientes visible | Foto directa de publicación GTI04-046+ |
| GTI04-141 | Punta lado rueda Spark GT / Beat; cuerpo completo y corona ABS visible | Foto directa de ficha SKU GTI04-141 |
| GTI04-110 | Tulipa lado caja izquierda Tracker automática 27 × 23; kit completo, grabado GTI, triceta, guardapolvo, abrazaderas, seguros y grasa visibles | Foto original directa de ficha exacta Imotriz; publicada sin reconstrucción generativa |
| GTI04-114 | Tulipa lado caja izquierda Onix 1.4 automático 22 × 30; tulipa y triceta completas sobre fondo blanco | Foto original directa de publicación exacta GTI04-114+; publicada sin reconstrucción generativa |
| GTI04-125 | Punta lado rueda Sonic mecánico 25 × 31; junta completa y guardapolvo íntegro sobre fondo blanco | Foto original directa de publicación que identifica marca GTI y referencia GTI04-125 |
| GTI06-001 | Punta lado rueda Accent / Verna / Gyro / Vision / i25 25 × 22; pieza completa | Foto directa de publicación GTI06-001+ |
| GTI06-003 | Punta lado rueda Hyundai Atos 25 × 20; junta, tuerca, guardapolvo, abrazaderas, seguro y grasa visibles | Foto original directa de ficha exacta Imotriz |
| GTI06-100 | Punta lado rueda i25 / Rio Spice 25 × 22; corona ABS de 44 dientes visible | Foto directa de publicación GTI06-100+ |

## Referencias disponibles sin foto exacta publicada

Estas referencias conservan la ficha técnica, pero muestran **Foto real pendiente** hasta recibir una imagen física o de fabricante con trazabilidad exacta:

El listado vigente se genera automáticamente en `PENDIENTES_FOTO_EXACTA_2026-08-26.md`. Después de publicar GTI04-066, GTI06-003 y GTI04-125 quedan **16** referencias disponibles pendientes.

## Control persistente por sesión

- Este archivo es el registro maestro para iniciar cada revisión GTI.
- El listado exhaustivo de 432 pendientes se conserva en `PENDIENTES_FOTO_EXACTA_2026-08-26.md` y se regenera con `node scripts/audit-gti-publication.mjs`.
- Al comienzo de cada sesión se debe comprobar la lista contra `src/data/gtiProducts.js` y `src/data/gti-quote-catalog.json`.
- Una referencia sólo sale de pendientes cuando existe una fotografía identificada por el código GTI exacto o una foto física propia con etiqueta legible.
- Fuente de inventario archivada en `docs/fuentes/INVENTARIO GENERAL POR LINEAS.pdf`.

## Fuentes contrastadas

- Página de marca GTI Autoparts / Dispartes: https://dispartes.com/gtiautoparts/
- Catálogo colombiano de puntas y ejes GTI, publicado en 2019: https://fliphtml5.com/spaxu/ahxl/REPUESTOS_PUNTAS_Y_EJES/
- Fichas de Importadoras Asociadas para GTI01-028, GTI01-038 y GTI01-064.
- Fichas comerciales colombianas identificadas por referencia exacta para GTI01-102 y GTI04-128.
- Publicaciones de Mercado Libre Colombia identificadas por referencia exacta para GTI01-027, GTI04-002, GTI04-046, GTI06-001 y GTI06-100.
- Las antiguas versiones generativas de GTI04-110 y GTI04-114 permanecen descartadas. Se publicaron copias de las fotografías originales exactas, sin alterar geometría, grabado ni accesorios.
- La antigua versión generativa de GTI06-003 permanece descartada; se publicó la fotografía original exacta sin reconstrucción.
- Las versiones web aisladas de GTI01-092 y GTI06-081 siguen retiradas: una imagen procesada no garantiza identidad geométrica 100 %.
- Aldauto Colombia para la ficha SKU GTI04-141 y su fotografía de producto completa.

El catálogo de 2019 sirve para contrastar referencias y descripciones, pero no contiene fotografías individuales suficientes para certificar las fichas que aún están pendientes.
