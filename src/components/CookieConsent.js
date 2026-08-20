"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "rembert-cookie-consent";
// El identificador de Analytics es público, pero debe poder cambiarse por
// entorno sin editar el código al publicar en Cloudflare o Vercel.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-60QBECZX1W";

function setAnalyticsConsent(granted) {
  if (!GA_ID) return;
  window[`ga-disable-${GA_ID}`] = !granted;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

function loadAnalytics() {
  if (!GA_ID) return;
  setAnalyticsConsent(true);

  if (document.querySelector(`script[data-ga-id="${GA_ID}"]`)) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.dataset.gaId = GA_ID;
  script.onload = () => {
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  };
  document.head.appendChild(script);
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedConsent = window.localStorage.getItem(STORAGE_KEY);
      if (savedConsent === "accepted") loadAnalytics();
      if (savedConsent === "rejected") setAnalyticsConsent(false);
      setConsent(savedConsent);
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value) => {
    window.localStorage.setItem(STORAGE_KEY, value);
    if (value === "accepted") loadAnalytics();
    else setAnalyticsConsent(false);
    setConsent(value);
  };

  if (!ready) return null;

  if (consent) {
    return (
      <button
        type="button"
        className="cookie-preferences-button"
        onClick={() => setConsent(null)}
        aria-label="Gestionar preferencias de cookies"
      >
        Cookies
      </button>
    );
  }

  return (
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
  );
}
