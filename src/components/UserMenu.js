"use client";

import { useSession, signOut } from "@/components/AuthProvider";
import Link from "next/link";
import CartIcon from "@/components/CartIcon";
import { useEffect, useRef, useState } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div className="navbar__actions">
      {status === "loading" ? (
        <div className="navbar__action-btn">
          <span className="navbar__action-icon">⏳</span>
          <span className="navbar__action-text">Cargando...</span>
        </div>
      ) : session ? (
        <div ref={menuRef} className="user-dropdown">
          <button
            type="button"
            className="navbar__action-btn user-dropdown__trigger"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-haspopup="menu"
          >
            <span className="navbar__action-icon">👤</span>
            <span className="navbar__action-text">{session.user?.name?.split(' ')[0] || 'Mi cuenta'}</span>
          </button>
          <div className={`dropdown-content ${isOpen ? "is-open" : ""}`} role="menu">
            <Link href="/perfil" role="menuitem" onClick={() => setIsOpen(false)}>Mi Perfil</Link>
            <Link href="/pedidos" role="menuitem" onClick={() => setIsOpen(false)}>Mis Pedidos</Link>
            {session.user?.role === "ADMIN" && (
              <Link href="/admin/dashboard" role="menuitem" onClick={() => setIsOpen(false)} style={{ color: '#FFD700', fontWeight: 800 }}>
                ⚙️ Admin CRM
              </Link>
            )}
            <button type="button" role="menuitem" onClick={() => signOut()} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', textAlign: 'left', padding: '10px 15px', width: '100%', fontWeight: 700 }}>
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
        .user-dropdown__trigger {
          appearance: none;
          border: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font: inherit;
          min-width: 44px;
          min-height: 44px;
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
          min-height: 44px;
          display: flex;
          align-items: center;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .dropdown-content a:hover, .dropdown-content button:hover {
          background-color: rgba(255, 215, 0, 0.15);
          color: #FFD700;
        }
        .dropdown-content.is-open {
          display: block;
        }
        .user-dropdown__trigger:focus-visible,
        .dropdown-content a:focus-visible,
        .dropdown-content button:focus-visible {
          outline: 3px solid #FFFFFF;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
