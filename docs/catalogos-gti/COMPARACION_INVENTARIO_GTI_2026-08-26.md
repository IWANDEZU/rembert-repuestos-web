# Comparación del inventario REMBERT con el catálogo GTI - 2026-08-26

## Fuente examinada

- Archivo: `docs/fuentes/INVENTARIO GENERAL POR LINEAS.pdf`
- Corte del informe: 21 de agosto de 2026.
- Extensión revisada: 476 páginas.
- Método: extracción completa del texto, búsqueda de referencias GTI normalizadas y revisión visual de las páginas con coincidencias.

## Resultado exacto

El inventario contiene una referencia de fabricante GTI explícita que no estaba en `src/data/gtiProducts.js`:

| Página | Núm. listado | Código interno | Referencia | Descripción del inventario | Existencia | Precio de venta | Acción |
| --- | ---: | --- | --- | --- | ---: | ---: | --- |
| 74 | 2936 | 24110-02200 | GTI06-052 | Eje izquierdo Kia Picanto 24 × 25 | 1 | $453.748 | Incorporada como eje homocinético izquierdo Kia Picanto I/II |

La descripción fue contrastada con una ficha comercial de la referencia `GTI06-052+`, que la identifica como eje homocinético izquierdo para Kia Picanto I/II y marca GTI.

## Coincidencias no usadas como nuevas referencias

El documento también contiene descripciones como tulipa Spark, Tracker, Atos, Eon, Onix y Rio Spice. No se crearon referencias GTI nuevas a partir de esos textos porque la columna **Marca** está vacía y la mayoría no incluye código de fabricante. Se mantienen únicamente como señales para una futura conciliación física por etiqueta, VIN, estrías y lado.

Las apariciones de “Spark GTI”, “Aveo GTI” o “Racer GTI” no se interpretaron automáticamente como marca GTI: en esos renglones el término puede formar parte del nombre histórico del vehículo o de una captura abreviada.

## Estado de imagen de la nueva referencia

- `GTI06-052`: **Foto real pendiente**.
- No se encontró una imagen exacta y trazable que pueda publicarse con seguridad.
- La ficha usa el estado vacío estándar; no muestra un eje genérico de Kia Picanto.

El listado completo y vigente de referencias sin foto se conserva en `AUDITORIA_IMAGENES_2026-08-26.md` y debe revisarse al inicio de cada sesión de trabajo GTI.
