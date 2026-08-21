const fs = require('fs');
const content = fs.readFileSync('.open-next/server-functions/default/handler.mjs', 'utf8');

// Find occurrences of common big libraries
const checks = [
  'prisma',
  '@prisma',
  'bcrypt',
  'mercadopago',
  'papaparse',
  'next-auth',
  'html-to-image',
  'fallbackCatalogProducts',
  'gasolineBrakeApplications',
  'gasolineFilterApplications'
];

for (const check of checks) {
  let count = 0;
  let pos = 0;
  while ((pos = content.indexOf(check, pos)) !== -1) {
    count++;
    pos += check.length;
  }
  console.log(`${check}: ${count} occurrences`);
}
