import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Política de cookies",
  description: "Información sobre cookies y preferencias de analítica de Victor Services.",
};

export default function CookiesPolicyPage() {
  return (
    <LegalPage title="Política de cookies" updatedAt="12 de agosto de 2026">
      <h2>1. Qué usamos</h2>
      <p>El sitio utiliza tecnologías de almacenamiento para recordar sesiones y preferencias necesarias para su funcionamiento. También puede usar Google Analytics para medir uso agregado del sitio, pero esta analítica no se carga hasta que el visitante la acepta expresamente.</p>
      <h2>2. Categorías</h2>
      <ul>
        <li><strong>Esenciales:</strong> permiten mantener una sesión iniciada, proteger formularios y recordar preferencias básicas. Son necesarias para el funcionamiento solicitado.</li>
        <li><strong>Analíticas opcionales:</strong> Google Analytics ayuda a entender de forma agregada cómo se usa el sitio. Se activa únicamente tras tu consentimiento.</li>
      </ul>
      <h2>3. Cómo gestionar tu elección</h2>
      <p>Puedes aceptar o rechazar la analítica en el aviso inicial. Después, usa el botón “Cookies” situado en la parte inferior de la página para cambiar la elección. También puedes eliminar el almacenamiento del sitio desde la configuración de tu navegador; al hacerlo volveremos a preguntarte tu preferencia.</p>
      <h2>4. Terceros</h2>
      <p>Si aceptas la analítica, Google puede tratar información conforme a sus propias condiciones y políticas. Consulta nuestra Política de tratamiento de datos personales para conocer los canales de contacto y tus derechos.</p>
    </LegalPage>
  );
}
