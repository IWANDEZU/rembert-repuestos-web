# Guía de Copias de Seguridad (Backup) para Victor Services

Esta guía te explica cómo asegurar tu base de datos de producción (PostgreSQL) para evitar la pérdida de información crítica como usuarios, pedidos, e inventario.

## Método 1: Exportación desde el Panel (Recomendado y más fácil)

Dependiendo de dónde esté alojada tu base de datos de producción (Vercel Postgres o Supabase), la manera más fácil de respaldarla es usando la interfaz web:

### Si usas Vercel Postgres / Neon:
1. Entra a tu panel de Vercel.
2. Ve a la pestaña **Storage** y selecciona tu base de datos Postgres.
3. En las opciones de la base de datos, busca la función de exportación o backup.
4. Descarga el archivo `.sql` resultante a un lugar seguro.

### Si usas Supabase:
1. Inicia sesión en [Supabase](https://supabase.com/).
2. Entra al proyecto de Victor Services.
3. Ve a **Database** (icono de base de datos en el menú izquierdo) -> **Backups**.
4. Haz clic en **Download Backup** o **Export**.

---

## Método 2: Backup por Consola (Para usuarios avanzados)

Si prefieres automatizarlo, hemos incluido un script llamado `backup-db.bat` en la raíz del proyecto. Para usarlo necesitas tener instalado PostgreSQL en tu computador (específicamente la herramienta `pg_dump`).

### Instrucciones:
1. Abre el archivo `backup-db.bat` con un editor de texto (puedes usar el Bloc de Notas o VSCode).
2. Copia la URL de tu base de datos de producción (la que tienes en tu `.env.local` bajo `POSTGRES_URL_NON_POOLING` o `DIRECT_URL`).
3. Pega esa URL reemplazando la palabra `TU_URL_AQUI` en el script.
4. Haz doble clic en `backup-db.bat`.
5. Se generará un archivo `.sql` con toda la información de tu tienda.
