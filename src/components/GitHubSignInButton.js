"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function GitHubSignInButton({ label = "Continuar con GitHub", callbackUrl = "/perfil" }) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/providers", { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : {}))
      .then((providers) => setIsAvailable(Boolean(providers.github)))
      .catch(() => setIsAvailable(false));

    return () => controller.abort();
  }, []);

  if (!isAvailable) return null;

  return (
    <button
      type="button"
      onClick={() => signIn("github", { callbackUrl })}
      style={{
        width: "100%",
        padding: "12px 16px",
        background: "#24292F",
        color: "#ffffff",
        border: "1px solid #1B1F23",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "0.95rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        marginBottom: "12px",
        transition: "background 0.2s ease, transform 0.1s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#1b1f23")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#24292F")}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
      {label}
    </button>
  );
}
