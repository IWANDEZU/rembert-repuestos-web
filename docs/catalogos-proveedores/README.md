# Repositorio visual de proveedores — automóviles

Este directorio documenta las imágenes de catálogo en `public/catalogo-proveedores/` y su estado técnico. Cada JPEG es una visual de catálogo generada, con la marca de agua R de REMBERT y un comentario JPEG embebido; no simula empaque ni logotipo de fabricante.

## Reglas de publicación

- **Verificada**: existe una referencia y aplicación publicada por fabricante o distribuidor identificable. Aun así se valida VIN antes del despacho.
- **Condicionada**: hay aplicación comercial, pero se requiere confirmar posición, anclajes, motor o número de parte.
- **Familia**: ilustra una línea de la marca; no debe ofrecerse como compatibilidad específica.
- **Pendiente**: no se publica una ficha de producto ni una imagen que pueda inducir una compatibilidad inexistente.

## Cobertura actual

| Marca | Estado | Producto / referencia | Aplicación visible |
| --- | --- | --- | --- |
| GTI | Familia | Tijera de suspensión | Cotización por VIN; no universal |
| ADS | Verificada | 56540-02000, brazo axial | Hyundai Atos 1.0 / 1.1, 1997–2014 |
| TNK | Verificada | NC050A, terminal exterior | Nissan Qashqai II, 2013–2021 |
| Gabriel | Familia | Amortiguador automóvil | Confirmar eje, lado, anclajes y VIN |
| KMX | Familia | Pastillas KMX Friction | Confirmar mordaza, eje y VIN |
| Rowen | Condicionada | Amortiguador | Hyundai i10; Kia Picanto Eko / Morning |
| CTR | Verificada | GY1628G | Hyundai i10 (PA), 2008–2013, trasero |
| Verke | Pendiente para autos | — | La evidencia localizada es de vehículo comercial; no se publicó como repuesto para automóvil |
| Safeti | Pendiente | — | Hace falta ficha de proveedor y referencia automotriz trazable |

Las fuentes detalladas, campos técnicos, identificadores y restricciones están en `metadata.json`.
