# REMBERT Repuestos — estado para Antigravity

## Objetivo vigente

Mantener la tienda ordenada y funcional, con Cloudflare Workers como publicación futura. Vercel continúa siendo la versión pública de respaldo hasta que Cloudflare pase las pruebas. Render no debe recibir nuevos despliegues.

## Catálogo y diseño

- El catálogo usa tarjetas; las imágenes de producto deben permanecer dentro de su contenedor y usar `object-fit: contain`.
- No deben usarse imágenes de producto como fondo de página o de categoría.
- La categoría **Mantenimiento** reúne silicona Victor Reinz, grasas, refrigerantes y valvulinas.
- La sección **Frenos y suspensión** está enfocada en automóviles, SUV y camionetas livianas a gasolina. Cada referencia debe indicar compatibilidad orientativa, validación por VIN/placa/muestra y una imagen de catálogo con empaque cuando exista una fuente verificable.
- El catálogo tiene datos de respaldo versionados para conservar tarjetas e imágenes cuando una consulta a inventario no esté disponible.

## Archivos principales

- `src/app/catalogo/page.js`: filtros, categorías, SEO del catálogo y respaldo de productos.
- `src/lib/products.js`: productos de respaldo del catálogo.
- `src/data/frenosSuspensionProducts.js`: productos técnicos de frenos, dirección y suspensión.
- `public/catalogo-frenos-suspension/`: imágenes optimizadas de la sección.
- `src/components/ProductCard.js` y estilos globales: presentación de tarjetas.

## Analítica y SEO

- Google Analytics se carga solo tras aceptación de cookies.
- Variable configurable: `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Verificación de Search Console: `GOOGLE_SITE_VERIFICATION`.
- SEO ya incluye `metadata`, datos estructurados `AutoPartsStore`, `sitemap.xml`, `robots.txt`, canónicas y metadatos sociales.
- No prometer una puntuación de 100: debe medirse después en PageSpeed Insights sobre la URL final de producción.

## Seguridad obligatoria

- Nunca incluir contraseñas, tokens, URL de base de datos ni claves OAuth en código, documentación o commits.
- Usar exclusivamente variables de entorno: `NEXTAUTH_SECRET`, `DATABASE_URL`, credenciales OAuth y claves de pago.
- Se eliminaron los accesos de respaldo con credenciales fijas y las claves de sesión escritas en código.
- Las rutas administrativas, acciones y API deben validar sesión y rol `ADMIN` en el servidor.

## Cloudflare Workers

- Se añadieron `wrangler.jsonc`, `open-next.config.ts` y los comandos `preview`/`deploy` con OpenNext.
- El código de Proxy de Next.js se retiró porque Next.js 16 lo ejecuta en Node y Cloudflare Workers no lo admite.
- La compilación local de Windows falla al crear enlaces simbólicos de Prisma. La alternativa es compilar/desplegar en Linux mediante integración GitHub/Cloudflare o CI.
- La herramienta actual de Cloudflare requiere Node 22 para la compilación Linux. Antes de publicar, actualizar la instalación de construcción y sincronizar `package-lock.json` con `package.json`.
- No publicar ni eliminar Vercel hasta validar catálogo, imágenes, rutas públicas y autenticación en la URL de Workers.

## Flujo de trabajo recomendado

1. Trabajar en una rama y revisar visualmente en local.
2. Enviar cambios por Git a la rama de publicación acordada.
3. Cloudflare construye y publica automáticamente desde GitHub.
4. Verificar la URL de Cloudflare antes de apagar despliegues automáticos de Vercel o Render.

## Variables necesarias en Cloudflare

Configurar desde el panel de Cloudflare, nunca en Git:

- `NEXT_PUBLIC_SITE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `DATABASE_POSTGRES_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `GOOGLE_SITE_VERIFICATION`
- credenciales OAuth y de pagos aplicables
