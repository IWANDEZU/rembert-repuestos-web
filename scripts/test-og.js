async function test() {
  const res = await fetch('https://rembert.iwandesu2018.workers.dev/catalogo?category=filtros');
  const html = await res.text();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1];
  console.log('Title:', title);
  console.log('OG Title:', ogTitle);
  console.log('OG Description:', ogDesc);
}
test();
