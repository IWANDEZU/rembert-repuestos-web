"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const STORAGE_KEY = "rembert-cookie-consent";
// El identificador de Analytics es público, pero debe poder cambiarse por
// entorno sin editar el código al publicar en Cloudflare o Vercel.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-60QBECZX1W";

function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function setAnalyticsConsent(granted) {
  if (!GA_ID || typeof window === "undefined") return;
  window[`ga-disable-${GA_ID}`] = !granted;
  ensureGtag();
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
  });
}

function loadAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;
  ensureGtag();
  setAnalyticsConsent(true);

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });

  if (document.querySelector(`script[data-ga-id="${GA_ID}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.dataset.gaId = GA_ID;
  document.head.appendChild(script);
}

function PageViewTracker({ consent }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (consent !== "accepted" || !GA_ID || typeof window === "undefined" || !window.gtag) return;
    const url = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams, consent]);

  return null;
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedConsent = window.localStorage.getItem(STORAGE_KEY);
      if (savedConsent === "accepted") {
        loadAnalytics();
      } else if (savedConsent === "rejected") {
        setAnalyticsConsent(false);
      }
      setConsent(savedConsent);
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    if (value === "accepted") {
      loadAnalytics();
    } else {
      setAnalyticsConsent(false);
    }
    setConsent(value);
  };

  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker consent={consent} />
      </Suspense>

      {!ready ? null : consent ? (
        <button
          type="button"
          className="cookie-preferences-button"
          onClick={() => setConsent(null)}
          aria-label="Gestionar preferencias de cookies"
        >
          Cookies
        </button>
      ) : (
        <section className="cookie-consent" role="dialog" aria-label="Preferencias de cookies" aria-live="polite">
          <div>
            <strong>Tu privacidad importa</strong>
            <p>
              Usamos almacenamiento esencial para el funcionamiento del sitio. Solo activamos Google Analytics si lo aceptas.
              Consulta nuestra <Link href="/politica-cookies">Política de cookies</Link>.
            </p>
          </div>
          <div className="cookie-consent__actions">
            <button type="button" className="btn btn--outline" onClick={() => choose("rejected")}>Rechazar analítica</button>
            <button type="button" className="btn btn--primary" onClick={() => choose("accepted")}>Aceptar analítica</button>
          </div>
        </section>
      )}
    </>
  );
}
