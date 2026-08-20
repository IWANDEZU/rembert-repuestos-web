import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Términos y condiciones",
  description: "Términos de uso y compra de REMBERT.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Términos y condiciones" updatedAt="12 de agosto de 2026">
      <h2>1. Uso del sitio</h2>
      <p>Este sitio permite consultar productos y solicitar atención comercial de REMBERT S.A. Debes usarlo de forma lícita, proporcionar información veraz y no intentar afectar su seguridad, disponibilidad o funcionamiento.</p>
      <h2>2. Catálogo, precios y disponibilidad</h2>
      <p>Las imágenes, referencias y descripciones del catálogo son informativas. La disponibilidad, precio final, compatibilidad, transporte e impuestos se confirman antes de formalizar una compra. REMBERT puede corregir errores evidentes de publicación y actualizar el catálogo sin previo aviso.</p>
      <h2>3. Pedidos y pagos</h2>
      <p>Un pedido o solicitud no constituye aceptación definitiva hasta la confirmación comercial de REMBERT. Las condiciones de pago, entrega, devolución y garantía aplicables se comunicarán según el producto y la transacción. Conserva los soportes de compra y revisa la compatibilidad antes de instalar un repuesto o componente.</p>
      <h2>4. Propiedad intelectual y enlaces</h2>
      <p>Los contenidos propios del sitio no pueden reutilizarse sin autorización. Las marcas y nombres de terceros pertenecen a sus respectivos titulares y se muestran únicamente para identificar productos o compatibilidades. Los enlaces externos se rigen por sus propios términos.</p>
      <h2>5. Contacto y cambios</h2>
      <p>Para preguntas sobre estos términos, escribe a <a href="mailto:repuestosrembertsa@gmail.com">repuestosrembertsa@gmail.com</a>. La versión vigente será la publicada en esta página.</p>
    </LegalPage>
  );
}
