import { NextResponse } from "next/server";

const buckets = globalThis.__rembertRateLimitBuckets ?? new Map();
globalThis.__rembertRateLimitBuckets = buckets;

const CLOUDFLARE_BINDINGS = {
  checkout: "CHECKOUT_RATE_LIMITER",
  "favorites-write": "FAVORITES_RATE_LIMITER",
  "admin-products": "ADMIN_RATE_LIMITER",
  "account-delete": "ACCOUNT_DELETE_RATE_LIMITER",
  "pos-sync": "POS_RATE_LIMITER",
};

function clientKey(request, scope) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `${scope}:${ip}`;
}

export async function enforceRateLimit(request, { scope, limit, windowMs }) {
  const now = Date.now();
  const key = clientKey(request, scope);

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const limiter = env?.[CLOUDFLARE_BINDINGS[scope] || "API_RATE_LIMITER"];
    if (limiter?.limit) {
      const result = await limiter.limit({ key });
      if (!result.success) {
        return NextResponse.json(
          { message: "Demasiadas solicitudes. Intenta nuevamente más tarde." },
          { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "60" } },
        );
      }
    }
  } catch {
    // Fuera de Workers se conserva el límite local inferior.
  }

  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
  }

  bucket.count += 1;
  buckets.set(key, bucket);

  // Evita crecimiento ilimitado en procesos Node persistentes.
  if (buckets.size > 10_000) {
    for (const [storedKey, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(storedKey);
    }
  }

  const remaining = Math.max(0, limit - bucket.count);
  if (bucket.count <= limit) return null;

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
  return NextResponse.json(
    { message: "Demasiadas solicitudes. Intenta nuevamente más tarde." },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
        "RateLimit-Limit": String(limit),
        "RateLimit-Remaining": String(remaining),
        "RateLimit-Reset": String(Math.ceil(bucket.resetAt / 1000)),
      },
    },
  );
}
