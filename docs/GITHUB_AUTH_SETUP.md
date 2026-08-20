# Guía de Configuración: GitHub OAuth App (NextAuth)

Esta guía explica cómo registrar y configurar tu aplicación OAuth en GitHub para habilitar el inicio de sesión y registro con GitHub en **REMBERT REPUESTOS**.

---

## 1. Crear la OAuth App en GitHub

1. Inicia sesión en tu cuenta de [GitHub](https://github.com/).
2. Dirígete a **Settings** (Configuración) de tu perfil:
   - Haz clic en tu foto de perfil (esquina superior derecha) $\rightarrow$ **Settings**.
3. En el menú lateral izquierdo, desplázate hasta el final y haz clic en **`<> Developer Settings`** (o entra directamente a [https://github.com/settings/apps](https://github.com/settings/apps)).
4. En el menú lateral, selecciona **OAuth Apps** $\rightarrow$ haz clic en el botón verde **New OAuth App** (o **Register a new application**).

---

## 2. Completar el Formulario de la Aplicación

Llena los campos requeridos según el entorno:

### Para Desarrollo Local (Localhost)
- **Application name:** `REMBERT Repuestos (Local)`
- **Homepage URL:** `http://localhost:3000`
- **Application description:** `Inicio de sesión para REMBERT Repuestos Web`
- **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`

### Para Producción (Vercel / Dominio Propio)
- **Application name:** `REMBERT Repuestos`
- **Homepage URL:** `https://tu-dominio.com` (o `https://rembert-repuestos-web.vercel.app`)
- **Application description:** `Inicio de sesión para clientes de REMBERT Repuestos`
- **Authorization callback URL:** `https://tu-dominio.com/api/auth/callback/github` (o `https://rembert-repuestos-web.vercel.app/api/auth/callback/github`)

> [!IMPORTANT]
> La **Authorization callback URL** debe terminar exactamente en `/api/auth/callback/github`. De lo contrario, GitHub retornará un error `redirect_uri_mismatch`.

5. Haz clic en **Register application**.

---

## 3. Obtener el Client ID y generar el Client Secret

1. Una vez creada la aplicación, verás tu **Client ID** (ejemplo: `Iv1.xxxxxxxxxxxx`).
2. En la sección **Client secrets**, haz clic en el botón **Generate a new client secret**.
3. Copia de inmediato el valor del **Client Secret** (GitHub solo te lo mostrará una vez).

---

## 4. Configurar las Variables de Entorno

### En tu archivo `.env.local` (Local)
Agrega las siguientes líneas a tu archivo `.env.local`:

```env
# GitHub OAuth
GITHUB_CLIENT_ID="tu_client_id_aqui"
GITHUB_CLIENT_SECRET="tu_client_secret_aqui"
```

*(También se soportan `GITHUB_ID` y `GITHUB_SECRET`)*

### En Vercel (Producción)
1. Entra a tu proyecto en el panel de [Vercel Dashboard](https://vercel.com).
2. Ve a **Settings** $\rightarrow$ **Environment Variables**.
3. Añade:
   - `GITHUB_CLIENT_ID` = `(tu Client ID de producción)`
   - `GITHUB_CLIENT_SECRET` = `(tu Client Secret de producción)`
4. Redespliega tu proyecto si es necesario para aplicar las nuevas variables.

---

## 5. Verificación y Funcionamiento

- Cuando las variables `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` estén configuradas, el botón **"Ingresar con GitHub"** y **"Registrarse con GitHub"** aparecerá automáticamente en las páginas `/login` y `/registro`.
- Si las variables no están presentes, el botón se oculta de forma limpia sin generar errores ni romper la interfaz.
