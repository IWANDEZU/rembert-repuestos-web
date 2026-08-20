import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Política de tratamiento de datos personales",
  description: "Política de tratamiento de datos personales de REMBERT.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Política de tratamiento de datos personales" updatedAt="13 de agosto de 2026">
      <h2>1. Responsable y alcance</h2>
      <p>REMBERT S.A., con operación en Barrancabermeja, Colombia, es responsable del tratamiento de los datos personales recolectados en este sitio. Para solicitudes relacionadas con tus datos usa la página de <a href="/eliminar-datos">eliminación de cuenta y datos</a> o contáctanos por correo a <a href="mailto:repuestosrembertsa@gmail.com">repuestosrembertsa@gmail.com</a> o por WhatsApp al +57 310 242 0490.</p>

      <h2>2. Datos y finalidades</h2>
      <p>Podemos tratar datos de identificación y contacto, información de cuenta, productos de interés, solicitudes, pedidos y datos técnicos básicos de navegación. Los usamos para crear y administrar cuentas, atender consultas y pedidos, coordinar entregas, prestar soporte, prevenir fraude, cumplir obligaciones legales y mejorar el sitio. No vendemos datos personales.</p>

      <h2>3. Facebook Login</h2>
      <p>Cuando está disponible y eliges Facebook Login, solicitamos únicamente los permisos <code>public_profile</code> y <code>email</code>. Recibimos el perfil público y, si Facebook lo proporciona, el correo electrónico para crear o acceder a tu cuenta. No publicamos en tu nombre ni solicitamos permisos adicionales. Facebook procesa la autenticación bajo sus propias políticas.</p>

      <h2>4. Autorización y derechos</h2>
      <p>Al crear una cuenta autorizas el tratamiento necesario para las finalidades informadas. Puedes conocer, actualizar, rectificar o solicitar la supresión de tus datos, revocar la autorización cuando proceda y presentar consultas o reclamos mediante los canales indicados. No debes enviar datos sensibles por los formularios del sitio.</p>

      <h2>5. Encargados, conservación y seguridad</h2>
      <p>Usamos proveedores tecnológicos para alojamiento, base de datos, autenticación y analítica, exclusivamente para operar el servicio y bajo medidas de seguridad razonables. Google Analytics solo se activa cuando lo autorizas en el aviso de cookies. Conservamos la información durante el tiempo necesario para las finalidades descritas y los deberes legales aplicables.</p>

      <h2>6. Eliminación de cuenta y datos</h2>
      <p>Puedes eliminar tu cuenta autenticándote y confirmando la solicitud en <a href="/eliminar-datos">esta página</a>. También atendemos la solicitud firmada que Meta envía desde Facebook Login al callback de eliminación de datos. Al eliminar una cuenta, removemos los datos personales asociados y desvinculamos o anonimizamos los registros que debamos conservar por obligaciones legales.</p>

      <h2>7. Vigencia</h2>
      <p>Incluye en tu solicitud tu nombre, medio de respuesta, descripción del requerimiento y la información necesaria para verificar tu identidad. Atenderemos las solicitudes dentro de los plazos previstos por la normativa aplicable. Esta política rige desde la fecha de actualización y puede modificarse; los cambios se publicarán en esta página.</p>
    </LegalPage>
  );
}
