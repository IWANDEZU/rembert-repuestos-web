# Plan de imágenes reales del catálogo

## Objetivo

Sustituir únicamente una referencia visual por una fotografía real cuya referencia pueda trazarse. No se cambia precio, existencia, compatibilidad ni el resto de la ficha de producto.

## Ahorro de tokens y control de calidad

1. La cola se genera localmente a partir de datos ya disponibles; no se usa IA para listar, ordenar ni deduplicar productos.
2. Se prioriza primero `photo-pending`, después stock disponible y, al final, imágenes de familia. Cada consulta sugerida usa marca, SKU y nombre para reducir ambigüedad.
3. La investigación humana o automatizada se limita a lotes de 10 SKU exactos. Una fuente sirve para confirmar la referencia; una segunda solo se solicita cuando la primera no es oficial o no muestra el producto.
4. Solo se importan fotografías propias, del fabricante o de un distribuidor autorizado con autorización de uso. No se publica una imagen parecida ni una generación artificial como si fuera la pieza exacta.
5. La descarga se almacena por hash en `.catalog-cache`, por lo que revalidar un lote no repite tráfico ni contexto.

## Operación

Generar la primera cola de fotos exactas pendientes, sin escribir archivos:

```powershell
npm run catalog:image-audit -- --status photo-pending --limit 10 --format markdown
```

Completar un lote basado en `docs/product-image-update.example.json` y validarlo sin cambios:

```powershell
npm run catalog:image-update -- E:\ruta\lote-imagenes.json
```

Aplicar solo las imágenes ya verificadas:

```powershell
npm run catalog:image-update -- E:\ruta\lote-imagenes.json --apply
npm run catalog:image-audit -- --status photo-pending --limit 10 --format markdown
npm run lint
```

El importador exige HTTPS para fuentes web, limita cada lote a 10 productos, rechaza SKU inexistentes y duplicados, valida mínimo 500×500 px, limita descarga a 15 MB y conserva la procedencia y el hash SHA-256. El único cambio de catálogo que produce es la imagen del SKU indicado.

## Regla adicional para GTI

Las tarjetas GTI sólo se actualizan si el lote declara, y el responsable revisa, los cinco controles siguientes: `exact_reference_confirmed`, `usage_authorized`, `source_type` (`own`, `manufacturer` o `authorized-distributor`), `source_image_clean` y `reference_evidence`. Un hallazgo en `docs/catalogos-gti/gti-source-candidates-full.json` es únicamente una pista documental: nunca habilita una publicación por sí mismo.

Para solicitar o reunir las fotos faltantes sin volver a listar el catálogo, genere la cola CSV local:

```powershell
npm run catalog:gti-photo-request
```

La salida prioriza las referencias disponibles y las agrupa en lotes de 10. Una vez recibida una foto autorizada, cada fila se convierte en un lote JSON de `catalog:image-update`; ese importador rechaza cualquier GTI que no declare todos los controles anteriores.

## Referencias generadas cuando no exista foto original

Si no hay foto original autorizada, se puede publicar una **imagen generada de referencia**. No cuenta como foto real ni como prueba de identidad física: se marca en el archivo, en la tarjeta y en la ficha; siempre exige confirmar etiqueta GTI, medidas y VIN antes de vender.

El flujo sólo acepta archivos generados locales, no reemplaza una foto real y conserva el prompt y SHA-256 de la fuente. Valide primero el lote y aplíquelo sólo después de revisar cada composición:

```powershell
npm run catalog:gti-generated-image -- E:\ruta\lote-generado.json
npm run catalog:gti-generated-image -- E:\ruta\lote-generado.json --apply
npm run catalog:gti-images:check
```

Cada fila del lote contiene `sku`, `image_source` (ruta absoluta al resultado), y `generation_prompt`. El renderizador añade de forma determinista el SKU y el aviso “Imagen generada de referencia · no es foto original”; por eso el texto crítico no depende de que el modelo lo dibuje bien.

Si el rastreador ya encontró fichas con coincidencia documental, puede preparar borradores bloqueados (sin descargar ni publicar fotos):

```powershell
npm run catalog:gti-candidate-drafts
```

Los borradores se guardan en `docs/catalogos-gti/borradores-fotos-candidatas/`. Son seguros por defecto: `usage_authorized` y `source_image_clean` quedan en `false`, por lo que el importador los rechazará hasta completar la revisión humana.
