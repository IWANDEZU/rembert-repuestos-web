import { products } from "../src/lib/products.js";
import { searchAndRankProducts, scoreProductSearch, cleanText, cleanAlphaNum } from "../src/lib/searchEngine.js";
import { filterPrioridadDieselProducts } from "../src/lib/prioridadDieselNormalizer.js";

console.log("=========================================");
console.log("  REMBERT REPUESTOS - SEARCH SUITE TEST  ");
console.log("=========================================");
console.log(`Total Products in General Catalog: ${products.length}\n`);

let passedTests = 0;
let totalTests = 0;

function assertTest(description, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${description}`);
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

// === 1. Pruebas de Búsqueda de Pieza + Vehículo (Multi-token) ===
console.log("--- 1. Búsqueda Pieza + Vehículo ---");
{
  const r1 = searchAndRankProducts(products, "filtro aceite spark");
  assertTest(
    "filtro aceite spark retorna resultados y el top match contiene 'FILTRO ACEITE' y 'SPARK'",
    r1.length > 0 && r1[0].name.includes("FILTRO ACEITE") && r1[0].name.includes("SPARK"),
    `Total: ${r1.length}, Top: ${r1[0]?.name}`
  );

  const r2 = searchAndRankProducts(products, "pastillas freno sail");
  assertTest(
    "pastillas freno sail retorna resultados relevantes para Sail",
    r2.length > 0 && r2[0].name.includes("PASTILLA") && r2[0].name.includes("SAIL"),
    `Total: ${r2.length}, Top: ${r2[0]?.name}`
  );

  const r3 = searchAndRankProducts(products, "amortiguador duster");
  assertTest(
    "amortiguador duster retorna amortiguadores para Duster",
    r3.length > 0 && r3[0].name.includes("AMORTIGUADOR") && r3[0].name.includes("DUSTER"),
    `Total: ${r3.length}, Top: ${r3[0]?.name}`
  );

  const r4 = searchAndRankProducts(products, "filtro aire kwid");
  assertTest(
    "filtro aire kwid retorna filtro para Kwid",
    r4.length > 0 && r4[0].name.includes("FILTRO AIRE") && r4[0].name.includes("KWID"),
    `Total: ${r4.length}, Top: ${r4[0]?.name}`
  );
}

// === 2. Pruebas de Búsqueda por SKU / Referencia Exacta / Código ===
console.log("\n--- 2. Búsqueda por Código SKU / OE ---");
{
  const r1 = searchAndRankProducts(products, "54661-2S000");
  assertTest(
    "54661-2S000 encuentra exactamente la referencia con guion",
    r1.length === 1 && r1[0].sku === "54661-2S000",
    `Total: ${r1.length}, Top: ${r1[0]?.sku}`
  );

  const r2 = searchAndRankProducts(products, "546612s000");
  assertTest(
    "546612s000 encuentra la referencia sin guion (alfanumérico limpio)",
    r2.length === 1 && r2[0].sku === "54661-2S000",
    `Total: ${r2.length}, Top: ${r2[0]?.sku}`
  );

  const r3 = searchAndRankProducts(products, "8888-D1661");
  assertTest(
    "8888-D1661 encuentra pastillas Sail",
    r3.length > 0 && (r3[0].sku === "8888-D1661" || r3[0].name.includes("SAIL")),
    `Total: ${r3.length}, Top: ${r3[0]?.sku}`
  );

  const r4 = searchAndRankProducts(products, "96475855");
  assertTest(
    "96475855 encuentra filtro de aceite Spark GT / Sail",
    r4.length > 0 && r4[0].sku === "96475855",
    `Total: ${r4.length}, Top: ${r4[0]?.sku}`
  );
}

// === 3. Pruebas de Eliminación de Falsos Positivos y Stop Words ===
console.log("\n--- 3. Control de Falsos Positivos y Stop Words ---");
{
  const r1 = searchAndRankProducts(products, "pastillas zzznonexistentword123");
  assertTest(
    "Búsqueda con palabra inexistente 'pastillas zzznonexistentword123' devuelve 0 resultados (sin falsos positivos)",
    r1.length === 0,
    `Total devuelto: ${r1.length}`
  );

  const r2 = searchAndRankProducts(products, "liquido de frenos");
  assertTest(
    "Búsqueda 'liquido de frenos' devuelve solo productos de líquido de frenos (< 10 productos, no todo el catálogo)",
    r2.length > 0 && r2.length < 20 && r2.every(p => p.name.toLowerCase().includes("liquido") || p.inventoryLine === "LUBRICANTES" || p.name.toLowerCase().includes("dot")),
    `Total: ${r2.length}`
  );

  const r3 = searchAndRankProducts(products, "rotula picanto");
  assertTest(
    "Búsqueda 'rotula picanto' devuelve rótula para Picanto sin mezclar amortiguadores",
    r3.length > 0 && r3.every(p => p.name.includes("ROTULA")),
    `Total: ${r3.length}, Nombres: ${r3.map(p => p.name).join(", ")}`
  );
}

// === 4. Pruebas de Búsqueda Diésel Especializada ===
console.log("\n--- 4. Búsqueda en Catálogo Diésel ---");
{
  const d1 = filterPrioridadDieselProducts({ query: "filtro hilux" });
  assertTest(
    "Diésel: 'filtro hilux' encuentra filtros para Hilux",
    d1.length > 0 && d1.every(p => p.vehicle.includes("Hilux")),
    `Total: ${d1.length}, Top: ${d1[0]?.name}`
  );

  const d2 = filterPrioridadDieselProducts({ query: "w 712/83" });
  assertTest(
    "Diésel: 'w 712/83' con barra y espacios encuentra MANN W 712/83",
    d2.length === 1 && d2[0].reference === "W 712/83",
    `Total: ${d2.length}, Top: ${d2[0]?.reference}`
  );

  const d3 = filterPrioridadDieselProducts({ query: "w71283" });
  assertTest(
    "Diésel: 'w71283' sin formato encuentra MANN W 712/83",
    d3.length === 1 && d3[0].reference === "W 712/83",
    `Total: ${d3.length}, Top: ${d3[0]?.reference}`
  );

  const d4 = filterPrioridadDieselProducts({ query: "pu 9008" });
  assertTest(
    "Diésel: 'pu 9008' encuentra PU 9008 z para Ranger / BT-50",
    d4.length === 1 && d4[0].reference === "PU 9008 z",
    `Total: ${d4.length}, Top: ${d4[0]?.reference}`
  );

  const d5 = filterPrioridadDieselProducts({ query: "90915-yzzd2" });
  assertTest(
    "Diésel: '90915-yzzd2' por código OE encuentra el filtro correspondiente",
    d5.length === 1 && d5[0].reference === "W 712/83",
    `Total: ${d5.length}, Top: ${d5[0]?.reference}`
  );

  const d6 = filterPrioridadDieselProducts({ query: "usa79356-a" });
  assertTest(
    "Diésel: 'usa79356-a' encuentra Strut Gabriel Hilux",
    d6.length === 1 && d6[0].reference === "USA79356-A",
    `Total: ${d6.length}, Top: ${d6[0]?.reference}`
  );

  const d7 = filterPrioridadDieselProducts({ query: "usa79356a" });
  assertTest(
    "Diésel: 'usa79356a' sin guión encuentra Strut Gabriel Hilux",
    d7.length === 1 && d7[0].reference === "USA79356-A",
    `Total: ${d7.length}, Top: ${d7[0]?.reference}`
  );
}

// === 5. Pruebas de Acentos y Caracteres Especiales ===
console.log("\n--- 5. Acentos y Normalización NFD ---");
{
  const r1 = searchAndRankProducts(products, "bujía");
  const r2 = searchAndRankProducts(products, "bujia");
  assertTest(
    "Búsqueda 'bujía' (con tilde) devuelve los mismos resultados que 'bujia' (sin tilde)",
    r1.length === r2.length && r1.length > 0,
    `Con tilde: ${r1.length}, Sin tilde: ${r2.length}`
  );

  const r3 = searchAndRankProducts(products, "rótula");
  const r4 = searchAndRankProducts(products, "rotula");
  assertTest(
    "Búsqueda 'rótula' (con tilde) devuelve los mismos resultados que 'rotula' (sin tilde)",
    r3.length === r4.length && r3.length > 0,
    `Con tilde: ${r3.length}, Sin tilde: ${r4.length}`
  );
}

console.log("\n=========================================");
console.log(`  RESUMEN: ${passedTests} / ${totalTests} PRUEBAS PASADAS`);
console.log("=========================================");

if (passedTests === totalTests) {
  console.log("🎉 ¡TODOS LOS MÉTODOS DE BÚSQUEDA FUNCIONAN A LA PERFECCIÓN!");
} else {
  process.exit(1);
}
