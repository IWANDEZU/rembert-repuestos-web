"use client";

import { useState, useCallback } from "react";

/**
 * Hook personalizado para gestión e integración de Inventarios y POS Colombianos
 * (Siigo Nube, Zoe POS, Alegra, Helisa, World Office, etc.)
 */
export function useInventoryPOS({ autoFetch = false } = {}) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // 'idle' | 'syncing' | 'success' | 'error'
  const [lastSyncResult, setLastSyncResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Dispara la sincronización con el POS configurado
   * @param {string} provider - 'siigo' | 'alegra' | 'universal'
   */
  const triggerSync = useCallback(async (provider = "siigo") => {
    setLoading(true);
    setStatus("syncing");
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/pos/sync?provider=${encodeURIComponent(provider)}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || "Error al sincronizar con POS");
      }

      setLastSyncResult(data);
      setStatus("success");
      return data;
    } catch (err) {
      console.error("useInventoryPOS error:", err);
      setErrorMessage(err.message);
      setStatus("error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Envía un lote de inventario al webhook universal (útil para subida de CSV / Excel desde el panel)
   * @param {Array} items - Lista de productos [{ sku, nombre, precio, stock, marca, categoria }]
   */
  const uploadInventoryBatch = useCallback(async (items) => {
    setLoading(true);
    setStatus("syncing");
    setErrorMessage(null);

    try {
      const res = await fetch("/api/pos/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, provider: "universal" }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || data.message || "Error cargando lote de inventario");
      }

      setLastSyncResult(data);
      setStatus("success");
      return data;
    } catch (err) {
      console.error("useInventoryPOS batch error:", err);
      setErrorMessage(err.message);
      setStatus("error");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene la información de conexión y estado del Webhook
   */
  const checkWebhookStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/pos/webhook");
      return await res.json();
    } catch (err) {
      return { status: "offline", error: err.message };
    }
  }, []);

  return {
    loading,
    status,
    lastSyncResult,
    errorMessage,
    triggerSync,
    uploadInventoryBatch,
    checkWebhookStatus,
  };
}

export default useInventoryPOS;
