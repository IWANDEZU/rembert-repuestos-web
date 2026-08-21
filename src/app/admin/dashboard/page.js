import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard de Administración",
};

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session || session?.user?.role !== "ADMIN") {
    redirect("/login");
  }

  const [usersCount, productsCount, ordersCount, categoriesCount] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.category.count(),
  ]);

  return (
    <div className="main-container section" style={{ padding: '40px 20px', minHeight: '70vh' }}>
      <h1 style={{ marginBottom: '30px' }}>Dashboard de Administración</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>

        <div style={{ background: 'var(--card-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Usuarios</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{usersCount}</p>
        </div>

        <div style={{ background: 'var(--card-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Productos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{productsCount}</p>
        </div>

        <div style={{ background: 'var(--card-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Categorías</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{categoriesCount}</p>
        </div>

        <div style={{ background: 'var(--card-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Pedidos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{ordersCount}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div style={{ background: 'var(--card-dark)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h2>Accesos Rápidos</h2>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <li><Link href="/admin/inventario" className="btn btn--primary">📊 Actualizar Inventario Masivo CSV</Link></li>
            <li><Link href="/pedidos" className="btn" style={{ border: '1px solid var(--border-color)', background: '#111', color: '#fff' }}>📦 Ver Historial de Pedidos</Link></li>
            <li><Link href="/catalogo" className="btn" style={{ border: '1px solid var(--border-color)', background: '#111', color: '#fff' }}>🛒 Ver Catálogo de Productos</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
