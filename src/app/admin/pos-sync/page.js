'use client';

import { useState, useEffect } from 'react';
import useInventoryPOS from '@/hooks/useInventoryPOS';

export default function PosSyncPage() {
  const { triggerSync, checkWebhookStatus, loading, status, lastSyncResult, errorMessage } = useInventoryPOS();
  const [provider, setProvider] = useState('siigo');
  const [posSecret, setPosSecret] = useState('rembert-pos-secret-2026');
  const [webhookInfo, setWebhookInfo] = useState(null);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
    checkWebhookStatus().then(setWebhookInfo);
  }, [checkWebhookStatus]);

  const webhookUrl = `${origin}/api/pos/webhook?secret=${posSecret}&provider=${provider}`;

  const handleCopyWebhook = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSyncNow = async () => {
    try {
      await triggerSync(provider, posSecret);
    } catch (err) {
      // Error manejado en hook
    }
  };

  return (
    <div className="main-container" style={{ padding: '3rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#111', marginBottom: '0.5rem' }}>
          Integración POS e Inventarios Colombianos
        </h1>
        <p style={{ color: '#666', fontSize: '1.05rem' }}>
          Conexión y sincronización automática de stock y precios con <strong>Zoe POS / Siigo Nube</strong>, <strong>Alegra</strong>, <strong>Helisa</strong> y sistemas compatibles en Colombia.
        </p>
      </div>

      {/* Tarjetas de Selección de Proveedor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Proveedor 1: Siigo / Zoe POS */}
        <div 
          onClick={() => setProvider('siigo')}
          style={{
            background: provider === 'siigo' ? '#fffde6' : '#fff',
            border: provider === 'siigo' ? '2px solid var(--primary-color)' : '1px solid #ddd',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '1.2rem', color: '#111' }}>Siigo Nube / Zoe POS</strong>
            <span style={{ fontSize: '0.8rem', background: '#0052cc', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>API v1</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
            Sincronización directa vía API REST de Siigo. Descarga productos, stock por bodega, precios y sincroniza facturación electrónica.
          </p>
        </div>

        {/* Proveedor 2: Alegra Colombia */}
        <div 
          onClick={() => setProvider('alegra')}
          style={{
            background: provider === 'alegra' ? '#fffde6' : '#fff',
            border: provider === 'alegra' ? '2px solid var(--primary-color)' : '1px solid #ddd',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '1.2rem', color: '#111' }}>Alegra POS Colombia</strong>
            <span style={{ fontSize: '0.8rem', background: '#00a86b', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>API v1</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
            Conexión con el catálogo de items e inventario disponible de Alegra Facturación y POS para Colombia.
          </p>
        </div>

        {/* Proveedor 3: Webhook Universal */}
        <div 
          onClick={() => setProvider('universal')}
          style={{
            background: provider === 'universal' ? '#fffde6' : '#fff',
            border: provider === 'universal' ? '2px solid var(--primary-color)' : '1px solid #ddd',
            borderRadius: '12px',
            padding: '1.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '1.2rem', color: '#111' }}>Webhook Universal / POS Local</strong>
            <span style={{ fontSize: '0.8rem', background: '#333', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 'bold' }}>JSON / REST</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
            Para Helisa, World Office, PosCloud, Servipunto o scripts que envían actualizaciones automáticas vía HTTP POST.
          </p>
        </div>
      </div>

      {/* Configuración de Webhook y Ejecución */}
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.07)', border: '1px solid #eaeaea', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#111' }}>
          URL del Webhook para tu POS
        </h2>
        <p style={{ fontSize: '0.92rem', color: '#555', marginBottom: '1.25rem' }}>
          Copia esta URL y configúrala en el módulo de Webhooks / Sincronización de tu sistema POS. Cada venta o cambio de stock en tu tienda física actualizará la web al instante.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            readOnly 
            value={webhookUrl}
            style={{ 
              flex: 1, 
              minWidth: '280px', 
              padding: '0.85rem 1rem', 
              borderRadius: '8px', 
              border: '1px solid #ccc', 
              background: '#f8f9fa', 
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#333'
            }} 
          />
          <button 
            onClick={handleCopyWebhook}
            className="btn"
            style={{ background: '#111', color: '#fff', padding: '0.85rem 1.5rem', whiteSpace: 'nowrap' }}
          >
            {copied ? '✅ ¡Copiado!' : '📋 Copiar Webhook URL'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
          <button 
            onClick={handleSyncNow}
            disabled={loading}
            className="btn btn--primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            {loading ? '⏳ Sincronizando con POS...' : `🔄 Sincronizar Ahora (${provider.toUpperCase()})`}
          </button>

          {status === 'success' && (
            <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '0.95rem' }}>
              ✅ Sincronización completada exitosamente
            </span>
          )}

          {status === 'error' && (
            <span style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '0.95rem' }}>
              ❌ {errorMessage || 'Error en la sincronización'}
            </span>
          )}
        </div>

        {/* Resultado del último sync */}
        {lastSyncResult && (
          <div style={{ marginTop: '1.5rem', background: '#f5f5f5', padding: '1rem 1.5rem', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#111' }}>Resumen de Sincronización:</h4>
            <pre style={{ margin: 0, fontSize: '0.85rem', color: '#333', overflowX: 'auto' }}>
              {JSON.stringify(lastSyncResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Variables de Entorno Recomendadas */}
      <div style={{ background: '#111111', color: '#ffffff', borderRadius: '14px', padding: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>
          🔑 Variables de Entorno para Producción (.env)
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem' }}>
          Agrega estas claves en tu archivo <code>.env.local</code> o en el panel de Vercel para activar la conexión automática:
        </p>
        <pre style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', color: '#FFD700', overflowX: 'auto', border: '1px solid #333' }}>
{`# Configuración de Sincronización POS
POS_SYNC_SECRET="${posSecret}"

# Para Siigo Nube / Zoe POS (Opcional si usas API directa)
SIIGO_USERNAME="tu_usuario_siigo@empresa.com"
SIIGO_ACCESS_KEY="tu_access_key_api_siigo"

# Para Alegra POS (Opcional si usas Alegra)
ALEGRA_USER="tu_correo_alegra@empresa.com"
ALEGRA_TOKEN="tu_token_api_alegra"`}
        </pre>
      </div>
    </div>
  );
}
