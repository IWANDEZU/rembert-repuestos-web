# Política técnica de compatibilidad del catálogo

La marca del vehículo por sí sola **nunca** confirma que un repuesto sirva. Una
aplicación se publica como verificada solo cuando existe una referencia de
fabricante y una fuente técnica que relaciona esa referencia con el vehículo.

## Estados permitidos

- `verified`: referencia fabricante exacta con una o más aplicaciones
  estructuradas en `fitments`.
- `conditional`: referencia real con información incompleta o variaciones que
  todavía exigen revisar el catálogo vigente y el VIN.
- `family`: familia de piezas o código interno `-COT`. No es una pieza universal
  ni se debe vender como un SKU físico.

## Datos mínimos por sistema

- Frenos: marca, modelo, año, motor, eje, sistema/caliper, ABS, diámetro y FMSI/OE.
- Suspensión/dirección: eje, lado, superior/inferior, tipo de suspensión,
  material, cono/rosca, anclajes y OE.
- Filtros: código de motor, rosca o forma, medidas, válvulas, caudal y OE.
- Embrague/transmisión: motor, caja, diámetro, estrías, volante y OE.
- Eléctrico/encendido: motor, conector, tensión, señal, ubicación y OE.
- Refrigeración: motor, caja, aire acondicionado, medidas, bocas, presión y OE.
- Fluidos: especificación del manual; el color o la marca comercial no bastan.

## Reglas de publicación

1. No usar `Compatible con` para listas de marcas, modelos orientativos o
   familias comerciales.
2. No presentar un código interno REMBERT como referencia del fabricante.
3. No combinar lado izquierdo/derecho, eje delantero/trasero o motor 1.6/2.0
   cuando el catálogo usa códigos distintos.
4. Si la foto corresponde a una familia y no al número publicado, marcarla como
   ilustrativa y exigir comprobar el número impreso en el empaque.
5. Las aplicaciones se vuelven a validar cuando el fabricante actualiza su
   catálogo; el VIN y la referencia OE prevalecen sobre una coincidencia visual.

## Estructura de datos

```js
{
  referenceType: "manufacturer",
  fitmentStatus: "verified",
  fitments: [{
    make: "Renault",
    model: "Duster",
    engine: "1.6 gasolina",
    years: "desde 2011",
    position: "eje delantero"
  }],
  fitmentRequirements: ["VIN", "año", "motor", "eje", "sistema de freno"],
  fitmentSource: "Fabricante — catálogo o boletín técnico"
}
```

Para familias de cotización usar `referenceType: "internal-quote"` y
`fitmentStatus: "family"`; nunca agregar `fitments` como si fueran aplicaciones
confirmadas.
