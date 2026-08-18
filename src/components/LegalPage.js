import Link from "next/link";

export default function LegalPage({ title, updatedAt, children }) {
  return (
    <main className="legal-page">
      <article className="legal-page__content">
        <Link href="/" className="legal-page__back">← Volver al inicio</Link>
        <h1>{title}</h1>
        <p className="legal-page__updated">Última actualización: {updatedAt}</p>
        {children}
      </article>
    </main>
  );
}
