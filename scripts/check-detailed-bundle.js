const fs = require('fs');
const content = fs.readFileSync('.open-next/server-functions/default/handler.mjs', 'utf8');

// Match node_modules comments or require/import paths
const lines = content.split('\n');
const moduleSizes = {};
let currentMod = 'root';

for (const line of lines) {
  if (line.startsWith('// node_modules/') || line.startsWith('// src/') || line.startsWith('// .prisma/')) {
    currentMod = line.slice(3).trim();
  }
  moduleSizes[currentMod] = (moduleSizes[currentMod] || 0) + line.length + 1;
}

const entries = Object.entries(moduleSizes).sort((a, b) => b[1] - a[1]);
console.log('Top 20 modules by size in handler.mjs:');
entries.slice(0, 25).forEach(([mod, size]) => {
  console.log(`${(size / 1024).toFixed(1)} KB  -  ${mod}`);
});
