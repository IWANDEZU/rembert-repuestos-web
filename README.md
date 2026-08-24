# REMBERT Repuestos

Tienda Next.js preparada para Cloudflare Workers mediante OpenNext.

## Trabajo local diario

```bash
npm ci
npm run dev
```

La aplicación queda en `http://localhost:3000` y se actualiza al guardar cambios. Este flujo no consume recursos del Worker ni publica cambios.

Antes de integrar una tanda de productos o cambios visuales:

```bash
npm run verify:local
```

Este comando valida catálogo, compatibilidades, lint y compilación de producción.

## Prueba local del Worker

```bash
npm run dev:cloudflare
```

OpenNext construye la aplicación, carga la caché estática local y arranca Wrangler. No usar `wrangler dev` directamente después de una compilación: omitir la carga de caché hace que las categorías prerenderizadas respondan 404 aunque existan.

Si `.open-next` ya fue construido y no cambió el código:

```bash
npm run preview:cloudflare:built
```

## Publicación

El despliegue se ejecuta únicamente desde la rama `cloudflare-migration` mediante GitHub Actions. Durante el desarrollo se trabaja y verifica localmente; solo se envían cambios cuando la tanda está aprobada. El comando manual equivalente es `npm run deploy`, que construye, carga la caché remota y despliega el Worker.

Las credenciales pertenecen a variables de entorno o secretos de GitHub/Cloudflare. Nunca deben escribirse en código ni incorporarse a Git.
