"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";

export default function UserMenu() {
  const { data: session, status } = useSession();

  return (
    <div className="navbar__actions">
      {status === "loading" ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem' }}>⏳</span>
          <span>Cargando...</span>
        </div>
      ) : session ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', cursor: 'pointer' }} className="user-dropdown">
            <span style={{ fontSize: '1.2rem' }}>👤</span>
            <span>{session.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
            <div className="dropdown-content">
              <Link href="/perfil">Mi Perfil</Link>
              <Link href="/pedidos">Mis Pedidos</Link>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin/dashboard" style={{ color: 'var(--primary-color)' }}>
                  ⚙️ Admin CRM
                </Link>
              )}
              <button onClick={() => signOut()} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', textAlign: 'left', padding: '10px 15px', width: '100%' }}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      ) : (
        <Link href="/login" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.2rem' }}>🔑</span>
          <span>Ingresar</span>
        </Link>
      )}

      {/* Cart is a client component as well */}
      <CartIcon />
      
      <style jsx>{`
        .user-dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-content {
          display: none;
          position: absolute;
          background-color: #fff;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
          z-index: 100;
          top: 100%;
          right: 0;
          border-radius: 8px;
          overflow: hidden;
        }
        .dropdown-content a {
          color: black;
          padding: 12px 16px;
          text-decoration: none;
          display: block;
        }
        .dropdown-content a:hover, .dropdown-content button:hover {
          background-color: #f1f1f1;
        }
        .user-dropdown:hover .dropdown-content {
          display: block;
        }
      `}</style>
    </div>
  );
}
