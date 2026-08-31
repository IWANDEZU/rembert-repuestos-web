import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi Cuenta",
};

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // Obtener la información completa del usuario desde la BD
  let user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: session.user.role || "USER",
    addresses: [],
    orders: [],
  };

  try {
    const storedUser = await prisma.user.findFirst({
      where: {
        OR: [
          { supabaseAuthId: session.user.authId },
          { email: session.user.email },
        ],
      },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (storedUser) user = storedUser;
  } catch (error) {
    console.error("No se pudo cargar el historial del perfil:", error);
  }

  return (
    <div className="main-container section" style={{ padding: 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 20px)', minHeight: '60vh' }}>
      <h1 style={{ marginBottom: 'clamp(15px, 3vw, 30px)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>Mi Cuenta</h1>
      
      <div className="profile-layout">
        {/* Sidebar / Info */}
        <div className="profile-sidebar" style={{ background: 'var(--card-dark)', padding: 'clamp(20px, 3vw, 30px)', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ width: '75px', height: '75px', background: 'var(--primary-color)', color: '#111', fontSize: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '0 auto 15px', fontWeight: '900', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)' }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '5px', color: '#fff' }}>{user?.name || "Usuario"}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', wordBreak: 'break-all' }}>{user?.email}</p>
            <span style={{ display: 'inline-block', marginTop: '10px', padding: '4px 12px', background: user?.role === 'ADMIN' ? 'rgba(234, 67, 53, 0.2)' : 'rgba(24, 144, 255, 0.2)', color: user?.role === 'ADMIN' ? '#ff4d4f' : '#1890ff', border: `1px solid ${user?.role === 'ADMIN' ? '#ff4d4f' : '#1890ff'}`, borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              {user?.role}
            </span>
          </div>

          <hr style={{ margin: '20px 0', borderColor: 'var(--border-color)' }} />

          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/perfil" style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>👤 Datos Personales</Link></li>
            <li><Link href="/pedidos" style={{ color: '#ccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>📦 Mis Pedidos</Link></li>
            <li><Link href="/catalogo" style={{ color: '#ccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>🛒 Explorar Catálogo</Link></li>
            {user?.role === 'ADMIN' && (
              <li><Link href="/admin/dashboard" style={{ color: '#ff4d4f', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>⚙️ Panel de Administración</Link></li>
            )}
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginBottom: '15px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', display: 'inline-block' }}>
            Últimos Pedidos
          </h2>
          
          {(!user?.orders || user.orders.length === 0) ? (
            <div style={{ padding: 'clamp(25px, 4vw, 40px)', background: 'var(--card-dark)', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ marginBottom: '10px' }}>Aún no has realizado ningún pedido.</p>
              <Link href="/catalogo" className="btn btn--primary" style={{ marginTop: '10px', display: 'inline-block' }}>Explorar Catálogo</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {user.orders.map(order => {
                const orderNum = order.id.slice(-6).toUpperCase();
                return (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: 'clamp(14px, 3vw, 20px)', background: 'var(--card-dark)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <div style={{ minWidth: '160px' }}>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '4px', color: '#fff' }}>Pedido #{orderNum}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                        ${order.totalAmount.toLocaleString('es-CO')}
                      </div>
                      <span style={{ padding: '3px 8px', background: order.status === 'PAID' ? 'rgba(40,167,69,0.2)' : 'rgba(255,193,7,0.2)', color: order.status === 'PAID' ? '#28a745' : '#ffc107', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 'bold' }}>
                        {order.status === 'PENDING' ? '⏳ Pendiente' : order.status === 'PAID' ? '✅ Pagado' : order.status}
                      </span>
                      <Link href={`/pedidos/${order.id}`} style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'none', marginTop: '2px', fontWeight: '600' }}>
                        Ver detalle →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)', marginTop: '35px', marginBottom: '15px', borderBottom: '2px solid var(--primary-color)', paddingBottom: '8px', display: 'inline-block' }}>
            Direcciones Guardadas
          </h2>
          
          {(!user?.addresses || user.addresses.length === 0) ? (
            <div style={{ padding: 'clamp(20px, 3vw, 30px)', background: 'var(--card-dark)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <p>No tienes direcciones guardadas aún. Las direcciones se guardan automáticamente al realizar un pedido.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '15px' }}>
              {user.addresses.map(address => (
                <div key={address.id} style={{ padding: 'clamp(15px, 3vw, 20px)', background: 'var(--card-dark)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: '#fff' }}>{address.title || 'Dirección de Envío'}</h3>
                  <p style={{ color: '#ccc', fontSize: '0.88rem', marginBottom: '4px' }}>👤 {address.fullName}</p>
                  <p style={{ color: '#ccc', fontSize: '0.88rem', marginBottom: '4px' }}>📞 {address.phone}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>📍 {address.street}, {address.city}{address.state ? `, ${address.state}` : ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
