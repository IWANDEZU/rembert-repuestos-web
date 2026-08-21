"use client";

import { useSession, signOut } from "@/components/AuthProvider";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";

export default function UserMenu() {
  const { data: session, status } = useSession();

  return (
    <div className="navbar__actions">
      {status === "loading" ? (
        <div className="navbar__action-btn">
          <span className="navbar__action-icon">⏳</span>
          <span className="navbar__action-text">Cargando...</span>
        </div>
      ) : session ? (
        <div className="navbar__action-btn user-dropdown">
          <span className="navbar__action-icon">👤</span>
          <span className="navbar__action-text">{session.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
          <div className="dropdown-content">
            <Link href="/perfil">Mi Perfil</Link>
            <Link href="/pedidos">Mis Pedidos</Link>
            {session.user?.role === "ADMIN" && (
              <Link href="/admin/dashboard" style={{ color: '#FFD700', fontWeight: 800 }}>
                ⚙️ Admin CRM
              </Link>
            )}
            <button onClick={() => signOut()} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', textAlign: 'left', padding: '10px 15px', width: '100%', fontWeight: 700 }}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      ) : (
        <Link href="/login" className="navbar__action-btn">
          <span className="navbar__action-icon">🔑</span>
          <span className="navbar__action-text">Ingresar</span>
        </Link>
      )}

      {/* Cart is a client component as well */}
      <CartIcon />
      
      <style jsx>{`
        .user-dropdown {
          position: relative;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #141414;
          min-width: 170px;
          box-shadow: 0px 10px 24px rgba(0,0,0,0.7), 0 0 12px rgba(255, 215, 0, 0.25);
          border: 1.5px solid rgba(255, 215, 0, 0.4);
          z-index: 100;
          top: calc(100% + 8px);
          right: 0;
          border-radius: 10px;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }
        .dropdown-content a {
          color: #ffffff;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .dropdown-content a:hover, .dropdown-content button:hover {
          background-color: rgba(255, 215, 0, 0.15);
          color: #FFD700;
        }
        .user-dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>
    </div>
  );
}
