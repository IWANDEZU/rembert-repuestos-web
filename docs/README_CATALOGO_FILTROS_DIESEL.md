# Catálogo de filtros diésel - Victor Services

Colección preparada a partir de `98590929-Catalogo-de-Filtros-Diesel.pdf` para integrarse en el proyecto Next.js de Victor Services.

## Entregables

- `public/catalogo-filtros-diesel/`: 139 imágenes PNG listas para web, 1200 x 1200 px, fondo blanco y encuadre uniforme.
- `src/data/catalogo-filtros-diesel.json`: manifiesto completo de 142 productos.
- `src/data/catalogoFiltrosDiesel.js`: exportación lista para importar en componentes React/Next.js.
- `docs/catalogo-filtros-diesel.csv`: inventario legible en Excel.
- `docs/fuentes/98590929-Catalogo-de-Filtros-Diesel.pdf`: fuente original preservada.
- `docs/PROMPT_MAESTRO_ANTIGRAVITY.md`: instrucciones de integración para Antigravity.

## Metadatos y reconocimiento

Cada PNG contiene metadatos internos `Title`, `ProductName`, `Brand`, `Reference`, `EquivalentReference`, `Category`, `Description`, `AltText`, `Keywords`, `SourcePDF`, `SourcePage`, `AssetId`, `AssetURL` y `Processing`.

El nombre del archivo también es semántico y estable. Ejemplo:

`partmo-a-105-filtro-aceite.png`

Antigravity no necesita inferir el producto desde los píxeles: debe leer el manifiesto JSON y usar `id`, `reference`, `name`, `image` y `alt` como fuente de verdad.

## Resultado de extracción

- Productos detectados: 142.
- Imágenes extraídas y preparadas: 139.
- Referencias sin imagen incrustada en el PDF: `AD-9001`, `PMX-750R` y `A-1259`.

Las tres referencias sin imagen permanecen en el manifiesto con `status: "missing-source-image"` e `image: null`. No deben recibir imágenes inventadas ni asignadas por similitud.

## Mejora aplicada

Las imágenes se extrajeron directamente de los objetos gráficos del PDF. Se aplicó una mejora conservadora y reproducible: recorte del fondo comprimido, ajuste leve de contraste/color, enfoque moderado, ampliación Lanczos y lienzo blanco uniforme.

Se realizó una prueba de mejora generativa sobre A-105, pero se descartó porque modificó texto secundario de la etiqueta. Ninguna imagen generada por IA forma parte de esta colección final.

## Uso técnico

```js
import { filtrosDieselConImagen } from '@/data/catalogoFiltrosDiesel';
```

Para imágenes ubicadas en `public`, la ruta del manifiesto se usa directamente:

```jsx
<Image
  src={producto.image}
  alt={producto.alt}
  width={producto.width}
  height={producto.height}
/>
```

No inventar precios, existencias, aplicaciones ni equivalencias adicionales. Esos datos requieren validación comercial de Victor Services.
