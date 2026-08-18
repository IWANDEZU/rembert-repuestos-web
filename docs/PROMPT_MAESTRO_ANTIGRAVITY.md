# Prompt maestro para Antigravity

```text
Trabaja dentro del repositorio E:\VICTOR SERVICES\victor-services.

OBJETIVO
Integrar correctamente la nueva biblioteca de filtros Partmo en la página web de Victor Services, respetando la arquitectura y el diseño existentes, sin borrar ni sobrescribir cambios actuales del usuario.

REGLAS OBLIGATORIAS
1. Lee primero AGENTS.md completo y las guías locales de Next.js 16 relacionadas con imágenes, App Router y metadata dentro de node_modules/next/dist/docs/.
2. Revisa el estado actual del repositorio antes de editar. La rama contiene cambios no confirmados: consérvalos y trabaja alrededor de ellos.
3. No descargues imágenes remotas ni generes imágenes nuevas. Usa exclusivamente los archivos locales ubicados en:
   public/catalogo-filtros-diesel/
4. La fuente de verdad para nombre, referencia, categoría, descripción, imagen y texto alternativo es:
   src/data/catalogo-filtros-diesel.json
   También existe el módulo:
   src/data/catalogoFiltrosDiesel.js
5. No intentes reconocer productos visualmente ni deducir referencias a partir de píxeles. Relaciona cada producto por su campo id y usa la ruta image indicada en el manifiesto.
6. Solo muestra productos con status === "ready" e image no nulo. Las referencias AD-9001, PMX-750R y A-1259 no tienen imagen original; mantenlas fuera de las galerías visuales o muéstralas como “imagen pendiente”, nunca con la foto de otro producto.
7. No inventes precios, existencias, compatibilidades, aplicaciones, especificaciones ni equivalencias. Si el modelo actual exige precio, usa null y muestra “Consultar precio” mediante una condición explícita. No uses 0 como precio.
8. Conserva el texto alt exacto del manifiesto. Cada PNG mide 1200 x 1200 px y contiene metadatos internos de producto.

IMPLEMENTACIÓN SOLICITADA
A. Integra el catálogo en la sección /catalogo sin eliminar los productos actuales.
B. Añade una categoría principal “Filtros diésel Partmo” y filtros secundarios para:
   - Filtros de aceite
   - Filtros hidráulicos
   - Filtros de combustible
   - Separadores agua/combustible
   - Filtros de aire
C. Implementa búsqueda por nombre, reference, equivalentReference y descripción, normalizando mayúsculas, espacios y guiones.
D. Usa next/image con src local, alt del manifiesto, width={1200}, height={1200}, sizes apropiado y lazy loading para tarjetas que no estén en la primera vista.
E. Evita renderizar las 139 imágenes a la vez. Usa paginación o carga progresiva, con una primera carga aproximada de 12 a 24 productos.
F. Mantén una relación de aspecto cuadrada, object-fit: contain y fondo blanco. No recortes las etiquetas ni deformes los productos.
G. En la ficha individual incluye como mínimo: nombre, marca Partmo, referencia, equivalencia cuando exista, descripción, categoría e imagen. Si hay botón de compra, desactívalo hasta contar con precio e inventario validados y ofrece “Consultar disponibilidad”.
H. Si la aplicación usa src/lib/products.js como catálogo principal, crea un adaptador claro en vez de copiar manualmente 142 objetos. Preserva los productos existentes y concatena únicamente registros compatibles.
I. Añade metadata SEO por ficha con title y description basados en name, reference y description; no uses nombres de archivo como texto visible.
J. Mantén accesibilidad: alt descriptivo, navegación por teclado, estados de carga claros y contraste suficiente.

PATRÓN DE IMPORTACIÓN RECOMENDADO
import { filtrosDieselConImagen } from '@/data/catalogoFiltrosDiesel';

PATRÓN DE IMAGEN RECOMENDADO
<Image
  src={producto.image}
  alt={producto.alt}
  width={producto.width}
  height={producto.height}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="h-full w-full object-contain"
/>

CRITERIOS DE ACEPTACIÓN
- Las 139 imágenes válidas cargan desde rutas locales sin errores 404.
- A-105 muestra partmo-a-105-filtro-aceite.png y nunca otra referencia.
- La búsqueda “A-105” devuelve el producto correcto.
- La búsqueda por una equivalencia también devuelve el producto relacionado.
- Las tres referencias sin imagen no reciben imágenes incorrectas.
- La página funciona en móvil, tableta y escritorio.
- No se alteran archivos gráficos originales ni sus metadatos.
- No se inventan precios ni stock.
- npm run lint y npm run build terminan correctamente.
- Entrega un resumen final de archivos modificados, decisiones tomadas y pruebas ejecutadas.

Antes de terminar, abre visualmente al menos una tarjeta de cada categoría y comprueba que la foto, el nombre y la referencia coincidan con el manifiesto.
```
