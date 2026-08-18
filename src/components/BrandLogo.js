'use client';

import { useState } from 'react';

export default function BrandLogo({ src, name, filterBlack = false }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div style={{ height: '80px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', background: '#f5f5f5', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--primary-color)', textAlign: 'center', fontWeight: 'bold' }}>{name}</h3>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '80px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      marginBottom: '1rem', 
      width: '100%',
      background: '#f8f8f8',
      borderRadius: '8px',
      border: '1px solid #e8e8e8',
      padding: '10px'
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={src} 
        alt={name} 
        onError={() => setError(true)}
        style={{ 
          maxHeight: '100%', 
          maxWidth: '100%', 
          objectFit: 'contain',
          ...(filterBlack && {
            filter: 'brightness(0)',
            transition: 'filter 0.3s ease',
            opacity: 0.85
          })
        }}
        {...(filterBlack && {
          onMouseEnter: e => e.currentTarget.style.filter = 'none',
          onMouseLeave: e => e.currentTarget.style.filter = 'brightness(0)'
        })}
      />
    </div>
  );
}
