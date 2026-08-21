const fs = require('fs');
const files = [
  'src/lib/auth.js',
  'src/app/perfil/page.js',
  'src/app/pedidos/[id]/page.js',
  'src/app/pedidos/page.js',
  'src/app/catalogo/page.js',
  'src/app/api/products/route.js',
  'src/app/api/pos/sync/route.js',
  'src/app/api/favorites/route.js',
  'src/app/api/checkout/route.js',
  'src/app/api/account/delete/route.js',
  'src/app/admin/dashboard/page.js',
  'src/app/admin/inventario/actions.js'
];
for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/`r`n/g, '\n');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
}
