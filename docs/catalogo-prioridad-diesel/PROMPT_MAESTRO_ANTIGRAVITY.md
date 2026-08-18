# Prompt maestro para Antigravity — catálogo diésel Victor Services

Trabaja sobre el repositorio web de Victor Services y agrega la colección **“Filtros y suspensión diésel”** usando únicamente el paquete de datos ya incluido en el proyecto.

## Archivos autorizados como fuente

- Datos: `src/data/catalogo-prioridad-diesel.json`
- Imágenes: `public/catalogo-prioridad-diesel/`
- Inventario humano: `docs/catalogo-prioridad-diesel/inventario-referencias-faltantes-victor-services.xlsx`
- Diccionario y advertencias: este archivo y los sidecars `*.jpg.metadata.json`

## Reglas obligatorias

1. Antes de modificar, inspecciona la arquitectura, componentes, estilos, rutas y cambios locales existentes. Conserva el diseño y no sobrescribas trabajo ajeno.
2. No inventes referencias, compatibilidades, dimensiones, precios, fotos ni equivalencias. El JSON es la fuente de verdad.
3. Publica imagen solamente cuando `image_status === "lista"`, `image_exact === true` y `web_image` exista. Si el registro está pendiente, usa un estado textual “Foto exacta pendiente” o exclúyelo del escaparate; nunca reutilices otra foto.
4. Usa `reference` como identificador estable y conserva exactamente espacios, guiones y sufijos. Para claves internas puedes crear un slug, pero muestra la referencia original.
5. El precio es **sugerido para web**, no una cotización confirmada. Muéstralo en COP con `Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })` y agrega “Sujeto a disponibilidad y confirmación”. No actives compra directa sin inventario y costo validados.
6. En cada producto muestra: nombre, marca, referencia, categoría, aplicación, motor, posición, ficha técnica, OE/cruces disponibles, precio sugerido y nota de compatibilidad.
7. Incluye un aviso visible: “Confirma compatibilidad por VIN, código de motor, año y tracción antes de comprar o instalar”.
8. Genera `alt` descriptivo con el patrón: `{subtype} {brand} {reference} para {vehicle}`. Usa carga diferida, dimensiones reservadas y formatos sin deformación (`object-fit: contain`).
9. Permite filtrar por categoría, marca, vehículo y estado de foto; permite buscar por referencia, OE y cruce.
10. Añade datos estructurados `Product` únicamente a productos visibles. Usa `sku: reference`, `brand`, `image`, `description` y `offers` solo si el precio está activo; no declares disponibilidad que no esté confirmada.
11. Respeta accesibilidad: navegación por teclado, foco visible, contraste AA, etiquetas de controles y textos alternativos.
12. No descargues nuevas imágenes ni sustituyas las existentes. Conserva los sidecars de metadata aunque no se sirvan al navegador.

## Integración esperada

- Reutiliza los componentes actuales de tarjetas y catálogo si existen.
- Crea una capa de normalización pequeña que lea `manifest.products`; no dupliques manualmente los 15 registros.
- Separa visualmente “Filtros” y “Suspensión”.
- Destaca Toyota Hilux/Fortuner, Ford Ranger/Mazda BT-50 y Volkswagen Amarok como cobertura inicial.
- Para los cuatro productos sin foto exacta, conserva la ficha en datos pero no muestres una imagen genérica.
- Mantén enlaces internos estables y usa un slug derivado de marca + referencia.

## Verificación obligatoria antes de terminar

1. Comprueba que las 11 imágenes listas cargan sin 404 y corresponden a su referencia.
2. Comprueba que las cuatro referencias pendientes no reciben una imagen equivocada.
3. Verifica búsqueda por `W 712/83`, `PU 9008 z`, `USA79356-A` y un número OE.
4. Verifica filtros por categoría y marca.
5. Ejecuta las pruebas, compilación y revisión responsive del proyecto.
6. Informa archivos modificados, pruebas ejecutadas y cualquier referencia que siga pendiente.

## Criterio de éxito

La página muestra el catálogo inicial sin inventar datos, mantiene trazabilidad de fuentes, carga las fotos correctas, permite localizar productos por referencia y deja claramente identificadas las compatibilidades y precios que requieren confirmación.

