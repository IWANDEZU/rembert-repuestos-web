"use client";

import { useState } from "react";

export default function ContactSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="contact-widget">
      <button
        type="button"
        className="contact-widget__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar opciones de contacto" : "Abrir opciones de contacto"}
        aria-expanded={isOpen}
        title="Canales de Contacto Directo"
      >
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111" width="28" height="28">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-9h-3V8h-2v3H8v2h3v3h2v-3h3v-2z"/>
        </svg>
      </button>

      <div className={`contact-widget__menu ${isOpen ? "open" : ""}`}>
        {/* Punto Principal */}
        <a 
          href="https://wa.me/573102420490?text=Hola%2C%20me%20comunico%20con%20Punto%20Principal%20de%20Rembert%20Repuestos." 
          target="_blank" 
          rel="noopener noreferrer" 
          title="WhatsApp Punto Principal: 310 242 0490" 
          className="contact-btn whatsapp"
        >
          <span className="contact-btn__tooltip">📍 Punto Principal</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </a>

        {/* Punto El Cerro */}
        <a 
          href="https://wa.me/573102707375?text=Hola%2C%20me%20comunico%20con%20Punto%20El%20Cerro%20de%20Rembert%20Repuestos." 
          target="_blank" 
          rel="noopener noreferrer" 
          title="WhatsApp Punto El Cerro: 310 270 7375" 
          className="contact-btn whatsapp"
        >
          <span className="contact-btn__tooltip">📍 Punto El Cerro</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </a>

        {/* Compras e Inventario */}
        <a 
          href="https://wa.me/573508299233?text=Hola%2C%20me%20comunico%20con%20la%20l%C3%ADnea%20de%20Compras%20e%20Inventario%20de%20Rembert%20Repuestos." 
          target="_blank" 
          rel="noopener noreferrer" 
          title="Compras e Inventario: +57 350 829 9233" 
          className="contact-btn compras"
        >
          <span className="contact-btn__tooltip">🛒 Compras e Inventario (+57 350 829 9233)</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111" width="20" height="20"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </a>

        {/* Escribir Correo en Gmail */}
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=repuestosrembertsa@gmail.com&su=Consulta+de+Repuestos+-+Rembert+Repuestos+BCA" 
          target="_blank" 
          rel="noopener noreferrer" 
          title="Escribir correo en Gmail: repuestosrembertsa@gmail.com" 
          className="contact-btn email"
        >
          <span className="contact-btn__tooltip">✉️ Correo Gmail</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="20" height="20"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
        </a>

        {/* Ubicación Google Maps */}
        <a 
          href="https://maps.app.goo.gl/FmmwX9PivNVnurEL7" 
          target="_blank" 
          rel="noopener noreferrer" 
          title="Ubicación en Google Maps (Tv. 29)" 
          className="contact-btn maps"
        >
          <span className="contact-btn__tooltip">🗺️ Google Maps</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="20" height="20"><path d="M12 0C7.589 0 4 3.589 4 8c0 4.274 7.219 15.184 7.633 15.82a.498.498 0 00.734 0C12.781 23.184 20 12.274 20 8c0-4.411-3.589-8-8-8zm0 11.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z"/></svg>
        </a>
      </div>

      <style jsx>{`
        .contact-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          gap: 15px;
        }

        .contact-widget__toggle {
          width: 62px;
          height: 62px;
          background: var(--primary-color);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35);
          cursor: pointer;
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
          z-index: 2;
          border: 3px solid #111;
        }

        .contact-widget:hover .contact-widget__toggle {
          transform: scale(1.08);
          box-shadow: 0 8px 25px rgba(255,215,0,0.5);
        }

        .contact-widget__menu {
          display: flex;
          flex-direction: column;
          gap: 12px;
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
          position: absolute;
          bottom: 80px;
        }

        .contact-widget__menu.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .contact-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          text-decoration: none;
        }

        .contact-btn:hover {
          transform: scale(1.12);
        }

        .contact-btn__tooltip {
          position: absolute;
          right: 62px;
          background: #111111;
          color: #ffffff;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform: translateX(10px);
          border: 1px solid #333;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .contact-btn:hover .contact-btn__tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        .whatsapp { background: #25D366; }
        .compras { background: var(--primary-color); }
        .email { background: #EA4335; }
        .maps { background: #34A853; }

        @media (max-width: 760px) {
          .contact-widget {
            bottom: 16px;
            right: 16px;
            gap: 10px;
          }

          .contact-widget__toggle {
            height: 50px;
            width: 50px;
          }

          .contact-btn {
            height: 46px;
            width: 46px;
          }

          .contact-widget__menu {
            bottom: 65px;
          }
        }
      `}</style>
    </div>
  );
}
