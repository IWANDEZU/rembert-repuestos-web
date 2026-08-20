"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import FacebookSignInButton from "@/components/FacebookSignInButton";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, privacyAccepted }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al registrarse");
      const result = await signIn("credentials", { redirect: false, email, password });
      if (result?.error) throw new Error("Cuenta creada, pero no fue posible iniciar sesión.");
      router.push("/perfil");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: "420px", width: "100%", background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", color: "#333" }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px", color: "#111" }}>Crear cuenta</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "25px" }}>Únete a REMBERT de forma rápida</p>
        <FacebookSignInButton label="Registrarse con Facebook" />
        <GoogleSignInButton label="Registrarse con Google" />
        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "#999" }}><div style={{ flex: 1, height: "1px", background: "#eee" }} /><span style={{ padding: "0 10px", fontSize: "0.85rem" }}>O regístrate con correo</span><div style={{ flex: 1, height: "1px", background: "#eee" }} /></div>
        {error && <div role="alert" style={{ background: "#ffeeee", color: "#cc0000", padding: "10px", borderRadius: "6px", marginBottom: "20px", textAlign: "center", fontSize: "0.9rem" }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <label>Nombre completo<input type="text" value={name} onChange={(event) => setName(event.target.value)} required maxLength={120} placeholder="Tu nombre completo" style={{ width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "1rem", color: "#111", background: "#fff" }} /></label>
          <label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} placeholder="tu@email.com" style={{ width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "1rem", color: "#111", background: "#fff" }} /></label>
          <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} maxLength={128} autoComplete="new-password" placeholder="Mínimo 8 caracteres" style={{ width: "100%", marginTop: "6px", padding: "10px 12px", border: "1px solid #ccc", borderRadius: "6px", fontSize: "1rem", color: "#111", background: "#fff" }} /></label>
          <label style={{ display: "flex", gap: "9px", alignItems: "flex-start", fontSize: "0.84rem", lineHeight: "1.4", color: "#555", cursor: "pointer" }}><input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} required style={{ marginTop: "3px" }} /><span>Autorizo el tratamiento de mis datos para crear y administrar mi cuenta, según la <Link href="/politica-privacidad" style={{ color: "var(--primary-color)", fontWeight: "600" }}>Política de tratamiento de datos</Link>.</span></label>
          <button type="submit" disabled={loading} className="btn btn--primary" style={{ marginTop: "10px", width: "100%", padding: "12px", fontSize: "1rem", fontWeight: "bold" }}>{loading ? "Registrando…" : "Crear cuenta"}</button>
        </form>
        <p style={{ textAlign: "center", marginTop: "25px", color: "#666", fontSize: "0.9rem" }}>¿Ya tienes cuenta? <Link href="/login" style={{ color: "var(--primary-color)", fontWeight: "600" }}>Inicia sesión</Link></p>
      </div>
    </div>
  );
}
