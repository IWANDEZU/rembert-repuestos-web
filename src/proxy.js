import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "rembert-repuestos-bca-secret-key-2026-production-fallback";

const authProxy = withAuth(
  function proxy() {
    // Authorization is defined by the callback below.
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        if (
          req.nextUrl.pathname.startsWith("/perfil") ||
          req.nextUrl.pathname.startsWith("/pedidos") ||
          req.nextUrl.pathname.startsWith("/checkout")
        ) {
          return Boolean(token);
        }

        return true;
      },
    },
    secret: AUTH_SECRET,
    cookies: {
      sessionToken: {
        name: "next-auth.session-token-v2",
      },
    },
  }
);

export default function proxy(request) {
  const host = request.headers.get("host")?.split(":")[0]?.toLowerCase();

  if (host === "rembertrepuestos.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = "www.rembertrepuestos.com";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  return authProxy(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2)$).*)"],
};
