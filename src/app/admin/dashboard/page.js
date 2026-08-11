import Link from 'next/link';

export const metadata = {
  title: "CRM Dashboard | Victor Services",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CRMDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', background: 'var(--secondary-color)', color: 'white', padding: '2rem 1rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '2rem' }}>Victor CRM</h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <li><Link href="/admin/dashboard" style={{ color: 'white', fontWeight: 'bold' }}>Dashboard</Link></li>
          <li><Link href="/admin/clientes" style={{ color: '#aaa' }}>Clientes (Flotas)</Link></li>
          <li><Link href="/admin/inventario" style={{ color: '#aaa' }}>Inventario</Link></li>
          <li><Link href="/admin/ventas" style={{ color: '#aaa' }}>Ventas</Link></li>
          <li style={{ marginTop: 'auto', paddingTop: '2rem' }}><Link href="/" style={{ color: 'var(--primary-color)' }}>← Volver al sitio</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--secondary-color)', margin: 0 }}>Panel General</h1>
          <div>
            <span style={{ marginRight: '1rem' }}>Hola, Administrador</span>
            <button className="btn btn--secondary" style={{ padding: '0.5rem 1rem' }}>Cerrar Sesión</button>
          </div>
        </header>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
            <h3 style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>Ventas del Mes</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>$12,450</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
            <h3 style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>Nuevos Clientes</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary-color)' }}>24</p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
            <h3 style={{ color: '#666', fontSize: '1rem', marginBottom: '0.5rem' }}>Alertas de Stock</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>3</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--box-shadow)' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Actividad Reciente de Flotas</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '1rem 0' }}>Cliente / Empresa</th>
                <th style={{ padding: '1rem 0' }}>Maquinaria</th>
                <th style={{ padding: '1rem 0' }}>Estado</th>
                <th style={{ padding: '1rem 0' }}>Acción Recomendada (IA)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem 0' }}>Transportes del Norte</td>
                <td style={{ padding: '1rem 0' }}>Volvo FH16</td>
                <td style={{ padding: '1rem 0' }}><span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Mantenimiento Vencido</span></td>
                <td style={{ padding: '1rem 0' }}>Contactar para cambio de aceite 15W-40</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem 0' }}>Constructora Andes</td>
                <td style={{ padding: '1rem 0' }}>Excavadora Cat 320</td>
                <td style={{ padding: '1rem 0' }}><span style={{ color: '#fca311', fontWeight: 'bold' }}>Próximo a Vencer</span></td>
                <td style={{ padding: '1rem 0' }}>Programar envío de filtro HD-200</td>
              </tr>
              <tr>
                <td style={{ padding: '1rem 0' }}>Logística Sur</td>
                <td style={{ padding: '1rem 0' }}>Scania R450</td>
                <td style={{ padding: '1rem 0' }}><span style={{ color: 'green', fontWeight: 'bold' }}>Al día</span></td>
                <td style={{ padding: '1rem 0' }}>Ninguna</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
