"use client";

import Link from "next/link";
import { signOut, useSession } from "@/components/AuthProvider";
import { useState } from "react";

export default function DeleteDataPage() {
  const { status } = useSession();
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const deleteAccount = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No fue posible eliminar la cuenta");
      await signOut({ callbackUrl: "/eliminar-datos?completed=1" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="legal-page">
      <article className="legal-page__content">
        <Link href="/" className="legal-page__back">← Volver al inicio</Link>
        <h1>Eliminación de cuenta y datos</h1>
        <p>Puedes solicitar la eliminación de tu cuenta y de los datos personales asociados. Los registros de pedidos que debamos conservar se desvincularán y anonimizarán.</p>
        {status !== "authenticated" ? (
          <p>Para eliminar tu cuenta desde el sitio, <Link href="/login">inicia sesión</Link>. También puedes solicitar orientación por WhatsApp al +57 310 873 7354.</p>
        ) : (
          <form onSubmit={deleteAccount} style={{ marginTop: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.6rem" }}>Escribe <code>ELIMINAR</code> para confirmar esta acción irreversible.</label>
            <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required style={{ padding: "0.7rem", border: "1px solid #aaa", borderRadius: "6px", width: "100%" }} />
            {message && <p role="alert" style={{ color: "#b42318", marginTop: "0.75rem" }}>{message}</p>}
            <button type="submit" disabled={loading || confirmation !== "ELIMINAR"} className="btn" style={{ background: "#b42318", color: "#fff", marginTop: "1rem" }}>{loading ? "Eliminando…" : "Eliminar mi cuenta"}</button>
          </form>
        )}
        <h2>Solicitud desde Facebook</h2>
        <p>Si usaste Facebook Login, Meta puede solicitar la eliminación mediante el callback configurado para esta aplicación. La confirmación se mostrará en esta misma página.</p>
      </article>
    </main>
  );
}
