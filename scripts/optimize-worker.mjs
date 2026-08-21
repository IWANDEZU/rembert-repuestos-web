import fs from 'node:fs';
import zlib from 'node:zlib';
import esbuild from 'esbuild';

const modulePaths = [
  '.open-next/server-functions/default/handler.mjs',
  '.open-next/middleware/handler.mjs',
  '.open-next/cloudflare/images.js',
  '.open-next/.build/durable-objects/queue.js',
];

for (const handlerPath of modulePaths) {
  if (!fs.existsSync(handlerPath)) continue;
  const original = fs.readFileSync(handlerPath, 'utf8');
  const beforeGzip = (zlib.gzipSync(original).length / 1024).toFixed(2);

  const result = esbuild.transformSync(original, {
    minify: true,
    legalComments: 'none',
    treeShaking: true,
    target: 'esnext',
  });

  fs.writeFileSync(handlerPath, result.code, 'utf8');
  const afterGzip = (zlib.gzipSync(result.code).length / 1024).toFixed(2);
  console.log(`[optimize-worker] ${handlerPath}: ${beforeGzip} KB -> ${afterGzip} KB (gzip)`);
}
