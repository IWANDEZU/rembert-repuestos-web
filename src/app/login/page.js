"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("No fue posible iniciar sesión con esos datos.");
      setLoading(false);
      return;
    }
    router.push("/perfil");
    router.refresh();
  };

  return (
    <div className="main-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px, 4vw, 40px) clamp(8px, 3vw, 20px)" }}>
      <div style={{ maxWidth: "420px", width: "100%", background: "#fff", padding: "clamp(20px, 5vw, 36px) clamp(16px, 4vw, 32px)", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", color: "#333", border: "1px solid #E2E8F0" }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px", color: "#111", fontSize: "clamp(1.5rem, 4vw, 1.8rem)" }}>Iniciar sesión</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "25px", fontSize: "0.95rem" }}>Bienvenido de vuelta a REMBERT</p>
        <GoogleSignInButton label="Continuar con Google" />
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#999" }}>
          <div style={{ flex: 1, height: "1px", background: "#eee" }} />
          <span style={{ padding: "0 10px", fontSize: "0.85rem" }}>O usa tu correo</span>
          <div style={{ flex: 1, height: "1px", background: "#eee" }} />
        </div>
        {error && <div role="alert" style={{ background: "#ffeeee", color: "#cc0000", padding: "10px", borderRadius: "6px", marginBottom: "20px", textAlign: "center", fontSize: "0.9rem" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>
            Correo electrónico
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="tu@email.com" style={{ width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", color: "#111", background: "#fff" }} />
          </label>
          <label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#333" }}>
            Contraseña
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" style={{ width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "16px", color: "#111", background: "#fff" }} />
          </label>
          <button type="submit" disabled={loading} className="btn btn--primary" style={{ marginTop: "10px", width: "100%", padding: "12px", fontSize: "1rem", fontWeight: "bold" }}>{loading ? "Cargando…" : "Ingresar"}</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "25px", color: "#666", fontSize: "0.9rem" }}>¿No tienes cuenta? <Link href="/registro" style={{ color: "var(--primary-dark)", fontWeight: "600" }}>Regístrate aquí</Link></p>
      </div>
    </div>
  );
}
