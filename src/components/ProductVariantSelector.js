"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import Image from "next/image";
import { getProductDisplayImage } from "@/lib/productImage";
import { generateWhatsAppProductText, getWhatsAppUrl } from "@/lib/orderFormatter";

export default function ProductVariantSelector({ product }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeTab, setActiveTab] = useState("desc");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
  const brandName = product.brand?.name || product.brand || "Victor Services";
  const categoryName = product.category?.name || product.category || "Lubricantes";
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Modal / Lightbox de Foto Ampliada */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'zoom-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <Image
              src={selectedImage} 
              alt={product.name} 
              width={1200}
              height={1000}
              unoptimized={selectedImage.startsWith('/api/imagen-referencia')}
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }} 
            />
            <button 
              onClick={() => setIsZoomOpen(false)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'var(--primary-color)',
                color: '#000',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem' }}>
              🔍 {product.name} - Haz clic en cualquier lugar para cerrar
            </p>
          </div>
        </div>
      )}

      {/* Grid Principal de Producto */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 1.2fr)', 
        gap: '40px', 
        background: 'var(--card-dark)', 
        padding: '30px', 
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
                borderColor: '#25D366', 
                color: '#25D366',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.95rem'
              }}
            >
              Cotizar por WhatsApp (+57 310 873 7354)
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
            🚚 Envíos y Garantía
          </button>
        </div>

        {/* Contenido de las Pestañas */}
        <div style={{ padding: '30px' }}>
          
          {activeTab === "desc" && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#ccc', lineHeight: '1.7' }}>
              <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>Beneficios Clave de {product.name}</h3>
              <p>{product.description || 'Producto certificado de alta calidad diseñado para condiciones de operación extremas.'}</p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Máxima protección del motor en arranques en frío y altas temperaturas operativas.</li>
                <li>Excelente control de depósitos, lodos y neutralización de residuos nocivos.</li>
                <li>Cumple con los estándares internacionales más estrictos de los fabricantes de vehículos.</li>
                <li>Ideal para flotas, maquinaria pesada y vehículos particulares en Colombia.</li>
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '15px' }}>Ficha Técnica del Producto</h3>
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
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Estado:</td>
                    <td style={{ padding: '12px' }}>Original 100% Sellado de Fábrica</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Disponibilidad:</td>
                    <td style={{ padding: '12px' }}>Despacho inmediato en Barrancabermeja</td>
                  </tr>
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
