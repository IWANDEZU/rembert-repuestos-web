# Catálogo GTI integrado en REMBERT

Fecha de revisión: 30 de agosto de 2026.

## Alcance publicado

- 464 referencias GTI AUTOPARTS publicadas: 48 con existencia y 416 referencias externas como **Sin existencia · consultar**.
- Las 48 disponibles se muestran primero y permanecen separadas del catálogo para cotización, que comienza en la página 3 del filtro GTI.
- Línea principal: puntas de eje, tulipas lado caja y componentes homocinéticos para automóviles.
- Marcas de vehículo cubiertas por las referencias del inventario: Renault, Chevrolet, Daewoo, Kia, Hyundai y Mazda.
- Cada ficha muestra posición, aplicación orientativa, estrías/configuración conocida y controles obligatorios de compatibilidad.
- El precio y la existencia de las 48 disponibles siguen viniendo del inventario; las 416 externas tienen precio y stock en cero y no permiten agregarse al carrito.

## Política de compatibilidad

Una punta de eje o tulipa no se asigna solo por apariencia. Antes del despacho se deben contrastar:

1. VIN, marca, modelo, año y motor.
2. Caja manual/automática y código de transmisión.
3. Lado y posición: rueda/caja, izquierdo/derecho.
4. Cantidad de estrías internas y externas.
5. Diámetro del sello y medidas de montaje.
6. Presencia de ABS y número de dientes de la corona.
7. Referencia legible en la etiqueta GTI o cruce OE vigente.

Las fichas `verified` cuentan con una coincidencia documental explícita de referencia y aplicación. Las fichas `conditional` conservan la aplicación registrada en inventario, pero exigen validación de todos los datos anteriores.

## Política de imagen exacta

- Una fotografía física sólo se clasifica como tal cuando la fuente identifica la referencia GTI exacta y la geometría coincide con el producto descrito.
- Cuando no existe foto física autorizada, se admite una recreación referencial claramente rotulada. No cuenta como foto real, no demuestra autenticidad GTI y no sustituye la validación de etiqueta, medidas, estrías, lado o ABS.
- Las recreaciones muestran únicamente el componente principal, materiales naturales y fondo blanco. No incorporan cables, sensores, corona ABS, accesorios ni contenido de kit sin evidencia estructurada.
- La cápsula GTI amarilla sobre azul se añade después del render desde `/brands/gti-product-logo-capsule.svg`; no se solicita al modelo generativo.
- Estado al corte: 300 fichas con fotografía física o de fuente y 164 con recreación referencial. Diez de las 164 tienen existencia y son prioridad para recibir fotografía física.
- El manifiesto vigente está en `/public/catalogo-generated-branded/manifest.json`; los controles se ejecutan con `npm run catalog:brand-generated-images:check`, `npm run catalog:gti-images:check` y `npm run catalog:gti-images:integrity`.

## Fuentes técnicas consultadas

- GTI Autoparts / distribuidor en Colombia: <https://dispartes.com/gtiautoparts/>
- Catálogo colombiano de puntas y ejes GTI: <https://fliphtml5.com/spaxu/ahxl/REPUESTOS_PUNTAS_Y_EJES/>
- Catálogo alterno: <https://dokument.pub/dl/repuestos-puntas-y-ejes-flipbook-pdf>
- GTI01-038: <https://www.importadorasasociadas.com/punta-eje-lado-rueda-renault-logan-2006-2015-sandero-2009-2015-stepway-2009-2015-7850-gti01-038/p>
- GTI01-064: <https://www.importadorasasociadas.com/punta-eje-lado-rueda-renault-duster-2012-2021-8065-gti01-064/p>
- GTI01-028: <https://www.importadorasasociadas.com/punta-eje-lado-caja-derecha-renault-logan-2006-2015-sandero-2009-2015-stepway-2009-2015-8084-gti01-028/p>
- GTI01-102: <https://www.mercadolibre.com.co/punta-eje-lado-rueda-renault-sandero-stepway-logan-23x22/up/MCOU3077976680>
- GTI04-128: <https://www.mercadolibre.com.co/punta-eje-lado-rueda-chevrolet-spark-cronos-23x21-con-abs-40/up/MCOU3301683684>

Los marketplaces se usan como evidencia secundaria de producto y aplicación. La venta final siempre queda condicionada al catálogo vigente, la etiqueta física y el VIN.
