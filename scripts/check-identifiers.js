const fs = require('fs');
const content = fs.readFileSync('.open-next/server-functions/default/handler.mjs', 'utf8');

// Find all `// <path>` or `var ... =` or function declarations
const regex = /(?:var|const|let|function|class)\s+([a-zA-Z0-9_$]+)/g;
const map = {};
let m;
while ((m = regex.exec(content)) !== null) {
  const name = m[1];
  map[name] = (map[name] || 0) + 1;
}

const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
console.log('Top identifier definitions:', sorted.slice(0, 30));

// Also check for large repetitive strings or template literals
console.log('Total characters in handler.mjs:', content.length);
