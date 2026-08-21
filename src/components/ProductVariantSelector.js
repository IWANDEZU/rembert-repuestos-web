"use client";

import { useState, useEffect } from "react";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function ProductVariantSelector({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeTab, setActiveTab] = useState("desc");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Manejo de retroceso nativo en celular (botón atrás) y bloqueo de scroll
  useEffect(() => {
    if (!isZoomOpen) return;

    window.history.pushState({ zoomOpen: true }, "");
    const handlePopState = () => {
      setIsZoomOpen(false);
    };
    window.addEventListener("popstate", handlePopState);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsZoomOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isZoomOpen]);

  // Obtener solo las imágenes verdaderas del producto
  const defaultImage = getProductDisplayImage(product);
  
  const galleryImages = product.images && product.images.length > 0 && product.images[0]?.url === defaultImage
    ? product.images.map(img => img.url) 
    : [defaultImage];

  const [selectedImage, setSelectedImage] = useState(defaultImage);

  // Cambiar variante manteniendo la foto auténtica del producto
  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant && variant.image) {
      setSelectedImage(variant.image);
    } else {
      setSelectedImage(defaultImage);
    }
  };

  const currentPrice = selectedVariant ? (selectedVariant.price || product.price) : product.price;
  const currentStock = selectedVariant ? (selectedVariant.stock ?? 20) : (product.stock ?? 20);
  const canBuy = product.inStock && currentStock > 0 && currentPrice > 0;
  const brandName = product.brand?.name || product.brand || "REMBERT";
  const categoryName = product.category?.name || product.category || "Repuestos";
  const technicalAttributes = Array.isArray(product.attributes) ? product.attributes : [];
  const findAttribute = (label) => technicalAttributes.find((attribute) =>
    String(attribute.name || "").toLowerCase().includes(label)
  );
  const compatibleBrands = findAttribute("marcas compatibles")?.value
    || "Compatibilidad por referencia: confirma marca, año, motor y número OE/VIN antes de comprar.";
  const compatibleModels = findAttribute("modelos compatibles")?.value
    || findAttribute("modelos orientativos")?.value
    || "La aplicación cambia entre modelos y versiones; solicita validación con placa, VIN o referencia de la pieza instalada.";
  const whatsappUrl = getWhatsAppUrl(
    generateWhatsAppProductText({
      product,
      image: selectedImage,
      quantity,
      variant: selectedVariant,
      price: currentPrice,
    })
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Barra Superior de Retorno Rápido para Móvil */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <Link
          href="/catalogo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#1a1a1a',
            color: '#FFFFFF',
            border: '1px solid #333',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '0.88rem',
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          ← Volver al Catálogo / Menú
        </Link>
        <span style={{ color: '#888', fontSize: '0.85rem' }}>
          {categoryName} • <strong>{brandName}</strong>
        </span>
      </div>

      {/* Modal / Lightbox de Foto Ampliada Ultra Accesible en Móvil */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            cursor: 'zoom-out',
            overscrollBehavior: 'contain'
          }}
        >
          {/* Botón Volver Superior Fijo */}
          <div
            style={{
              position: 'fixed',
              top: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 100000,
            }}
          >
            <button 
              onClick={() => setIsZoomOpen(false)}
              style={{
                background: '#E52421',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(229, 36, 33, 0.5)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← VOLVER
            </button>

            <button 
              onClick={() => setIsZoomOpen(false)}
              style={{
                background: '#222',
                color: '#fff',
                border: '1px solid #555',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '92vw', maxHeight: '80vh', marginTop: '40px' }}
          >
            <Image
              src={selectedImage} 
              alt={product.name} 
              width={1200}
              height={1000}
              unoptimized={selectedImage.startsWith('/api/imagen-referencia')}
              style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.9)' }} 
            />
          </div>

          {/* Botón Inferior Táctil para Móvil */}
          <button 
            onClick={() => setIsZoomOpen(false)}
            style={{
              marginTop: '16px',
              background: '#222',
              color: '#ccc',
              border: '1px solid #444',
              borderRadius: '20px',
              padding: '8px 20px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ✕ Toca aquí o en cualquier parte para cerrar
          </button>
        </div>
      )}

      {/* Grid Principal de Producto */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', 
        gap: '30px', 
        background: 'var(--card-dark)', 
        padding: 'clamp(16px, 3vw, 30px)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)' 
      }}>
        
        {/* Galería e Imagen Ampliada */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Contenedor Principal de la Foto */}
          <div 
            onClick={() => setIsZoomOpen(true)}
            style={{ 
              background: '#0d0d0d', 
              borderRadius: '12px', 
              padding: '25px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '380px',
              border: '1px solid #222',
              position: 'relative',
              cursor: 'zoom-in',
              overflow: 'hidden'
            }}
          >
            <Image
              src={selectedImage} 
              alt={product.name} 
              width={800}
              height={600}
              unoptimized={selectedImage.startsWith('/api/imagen-referencia')}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              style={{ maxWidth: '100%', maxHeight: '330px', objectFit: 'contain', transition: 'transform 0.3s ease' }} 
            />
            
            {/* Badge de Zoom */}
            <span style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              background: 'rgba(0,0,0,0.75)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              border: '1px solid #444',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🔍 Ampliar Imagen
            </span>
          </div>

          {/* Miniaturas / Thumbnails (solo si el producto tiene más de 1 foto auténtica) */}
          {galleryImages.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '5px' }}>
              {galleryImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '8px',
                    background: '#0f0f0f',
                    border: selectedImage === imgUrl ? '2px solid var(--primary-color)' : '1px solid #333',
                    padding: '5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease'
                  }}
                >
                  <Image src={imgUrl} alt={`Vista ${idx + 1} de ${product.name}`} width={72} height={72} unoptimized={imgUrl.startsWith('/api/imagen-referencia')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Información Detallada del Producto */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ color: 'var(--primary-color)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '8px', letterSpacing: '1px' }}>
            {brandName} • {categoryName}
          </div>
          
          <h1 style={{ fontSize: '2.2rem', marginBottom: '12px', lineHeight: '1.2' }}>{product.name}</h1>

          {product.sku && <p className="product-reference product-reference--detail">Ref. {product.sku}</p>}
          
          {/* Precio y Disponibilidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
              {currentPrice > 0
                ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(currentPrice)
                : 'Precio bajo cotización'}
            </span>
            <span style={{ 
              padding: '6px 14px', 
              background: canBuy ? 'rgba(76, 175, 80, 0.15)' : 'rgba(255, 107, 0, 0.12)',
              color: canBuy ? '#4caf50' : 'var(--primary-color)',
              border: `1px solid ${canBuy ? '#2e7d32' : 'var(--primary-color)'}`,
              borderRadius: '20px', 
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {canBuy ? `✓ En stock (${currentStock} disponibles)` : 'Disponibilidad por confirmar'}
            </span>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px', fontSize: '1rem' }}>
            {product.description || 'Lubricante formulado con tecnología avanzada para brindar máxima protección contra el desgaste y extender la vida útil del motor.'}
          </p>

          <section style={{ background: '#F8FAFC', border: '1px solid #D8E0EA', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: '#1E293B' }}>
            <h2 style={{ fontSize: '1rem', marginBottom: '10px', color: '#111827' }}>Compatibilidad de marca y modelo</h2>
            <p style={{ marginBottom: '8px', lineHeight: '1.5', fontSize: '0.9rem' }}><strong>Marcas:</strong> {compatibleBrands}</p>
            <p style={{ margin: 0, lineHeight: '1.5', fontSize: '0.9rem' }}><strong>Modelos:</strong> {compatibleModels}</p>
          </section>

          {/* Selector de Variantes / Presentación */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '10px', color: '#aaa', letterSpacing: '0.5px' }}>
                Selecciona la Presentación:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {product.variants.map(variant => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    style={{
                      background: selectedVariant?.id === variant.id ? 'var(--primary-color)' : '#1a1a1a',
                      color: selectedVariant?.id === variant.id ? '#000' : '#fff',
                      border: `1px solid ${selectedVariant?.id === variant.id ? 'var(--primary-color)' : '#333'}`,
                      padding: '10px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease'
                    }}
                  >
                    {variant.name} {variant.price ? `- $${variant.price.toLocaleString('es-CO')}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Cantidad y Botones de Compra */}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              
              {/* Controls de Cantidad */}
              <div style={{ display: 'flex', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', background: '#111' }}>
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: 'transparent', color: '#fff', border: 'none', padding: '12px 16px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                >
                  -
                </button>
                <span style={{ padding: '12px 16px', color: '#fff', fontWeight: 'bold', display: 'flex', alignItems: 'center', minWidth: '40px', justifyContent: 'center' }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: 'transparent', color: '#fff', border: 'none', padding: '12px 16px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
                >
                  +
                </button>
              </div>

              {/* Botón Agregar al Carrito */}
              {canBuy && (
                <div style={{ flex: 1 }}>
                  <AddToCartButton
                    product={{
                      id: product.id,
                      name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
                      price: currentPrice,
                      image: selectedImage,
                      brand: brandName,
                      category: categoryName,
                      sku: selectedVariant?.sku || product.sku || "",
                      slug: product.slug || product.id,
                      variantId: selectedVariant?.id || null,
                    }}
                    quantity={quantity}
                  />
                </div>
              )}
            </div>

            {/* Comprar por WhatsApp */}
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '10px', 
                padding: '12px', 
                borderRadius: '8px', 
                background: 'rgba(37, 211, 102, 0.08)',
                border: '1.5px solid #25D366', 
                color: '#25D366',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              <WhatsAppIcon size={20} color="#25D366" />
              <span>Cotizar por WhatsApp (+57 310 873 7354)</span>
            </a>

          </div>

        </div>

      </div>

      {/* Sección Inferior de Pestañas de Información Técnica */}
      <div style={{ background: 'var(--card-dark)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {/* Encabezado de Pestañas */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: '#111' }}>
          <button 
            onClick={() => setActiveTab("desc")}
            style={{
              padding: '16px 24px',
              background: activeTab === "desc" ? 'var(--card-dark)' : 'transparent',
              color: activeTab === "desc" ? 'var(--primary-color)' : '#888',
              border: 'none',
              borderBottom: activeTab === "desc" ? '3px solid var(--primary-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}
          >
            📋 Descripción & Aplicación
          </button>
          <button 
            onClick={() => setActiveTab("specs")}
            style={{
              padding: '16px 24px',
              background: activeTab === "specs" ? 'var(--card-dark)' : 'transparent',
              color: activeTab === "specs" ? 'var(--primary-color)' : '#888',
              border: 'none',
              borderBottom: activeTab === "specs" ? '3px solid var(--primary-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}
          >
            ⚙️ Especificaciones Técnicas
          </button>
          <button 
            onClick={() => setActiveTab("shipping")}
            style={{
              padding: '16px 24px',
              background: activeTab === "shipping" ? 'var(--card-dark)' : 'transparent',
              color: activeTab === "shipping" ? 'var(--primary-color)' : '#888',
              border: 'none',
              borderBottom: activeTab === "shipping" ? '3px solid var(--primary-color)' : 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}
          >
            🚚 Envío & Garantía
          </button>
        </div>

        {/* Contenido de las Pestañas */}
        <div style={{ padding: '30px' }}>
          
          {activeTab === "desc" && (
            <div style={{ color: '#ccc', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Detalles del Producto y Recomendaciones</h3>
              <p>{product.description || 'Producto de alto rendimiento con los más exigentes estándares de calidad de la industria automotriz y de maquinaria pesada.'}</p>
              
              <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222', marginTop: '10px' }}>
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '8px' }}>💡 Beneficios Clave:</h4>
                <ul style={{ paddingLeft: '20px', color: '#aaa' }}>
                  <li>Protección superior en condiciones severas de operación.</li>
                  <li>Reduce la fricción y optimiza el consumo y rendimiento.</li>
                  <li>Compatibilidad garantizada según especificaciones OEM de fabricante.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#ccc', fontSize: '0.95rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)', width: '30%' }}>Marca:</td>
                    <td style={{ padding: '12px' }}>{brandName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Categoría:</td>
                    <td style={{ padding: '12px' }}>{categoryName}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Disponibilidad:</td>
                    <td style={{ padding: '12px' }}>{canBuy ? `${currentStock} unidad${currentStock === 1 ? '' : 'es'} disponible${currentStock === 1 ? '' : 's'}` : 'Confirmar con asesor'}</td>
                  </tr>
                  {technicalAttributes.map((attribute) => (
                    <tr key={attribute.id || `${attribute.name}-${attribute.value}`} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{attribute.name}:</td>
                      <td style={{ padding: '12px' }}>{attribute.value}</td>
                    </tr>
                  ))}
                  {!findAttribute("marcas compatibles") && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Marcas compatibles:</td>
                      <td style={{ padding: '12px' }}>{compatibleBrands}</td>
                    </tr>
                  )}
                  {!findAttribute("modelos compatibles") && !findAttribute("modelos orientativos") && (
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Modelos compatibles:</td>
                      <td style={{ padding: '12px' }}>{compatibleModels}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "shipping" && (
            <div style={{ color: '#ccc', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Información de Envío y Respaldo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                  <span style={{ fontSize: '1.8rem' }}>📍</span>
                  <h4 style={{ color: '#fff', margin: '8px 0' }}>Despacho Local</h4>
                  <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Entregas directas en Barrancabermeja y zonas industriales el mismo día.</p>
                </div>
                <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                  <span style={{ fontSize: '1.8rem' }}>🚚</span>
                  <h4 style={{ color: '#fff', margin: '8px 0' }}>Envíos Nacionales</h4>
                  <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Despachos a todo Colombia a través de transportadoras aliadas.</p>
                </div>
                <div style={{ background: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #222' }}>
                  <span style={{ fontSize: '1.8rem' }}>🛡️</span>
                  <h4 style={{ color: '#fff', margin: '8px 0' }}>Garantía Total</h4>
                  <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Garantizamos la autenticidad y fecha de lote de fábrica de cada lubricante.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
