'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { processInventoryCSV } from './actions';

export default function InventoryCSVPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError(null);
  };

  const handleProcess = () => {
    if (!file) {
      setError('Por favor selecciona un archivo CSV primero.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data;
          if (data.length === 0) {
            setError('El archivo CSV está vacío.');
            setLoading(false);
            return;
          }

          // Check headers
          const firstRow = data[0];
          const hasSku = 'sku' in firstRow || 'SKU' in firstRow;
          const hasStock = 'stock' in firstRow || 'Stock' in firstRow || 'STOCK' in firstRow;

          if (!hasSku || !hasStock) {
            setError('El archivo CSV debe contener al menos las columnas "sku" y "stock".');
            setLoading(false);
            return;
          }

          const response = await processInventoryCSV(data);
          
          if (response.success) {
            setResult(response.results);
          } else {
            setError(response.error || 'Ocurrió un error al procesar el archivo.');
          }
        } catch (err) {
          setError('Error procesando los datos parseados.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`Error leyendo el archivo CSV: ${err.message}`);
        setLoading(false);
      }
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Actualizar Inventario Masivo</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Sube un archivo CSV para actualizar el stock y opcionalmente los precios. 
            El archivo debe tener al menos las cabeceras <strong>sku</strong> y <strong>stock</strong>.
            Opcionalmente puedes incluir <strong>price</strong>.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200 cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={!file || loading}
          className={`px-6 py-2 rounded-md font-medium text-white transition-colors ${
            !file || loading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Procesando...' : 'Procesar Inventario'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            <h3 className="font-semibold mb-1">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Resultados del Proceso</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-100 dark:border-blue-800">
                <span className="block text-3xl font-bold text-blue-600 dark:text-blue-400">{result.total}</span>
                <span className="text-sm text-blue-800 dark:text-blue-200">Total Filas</span>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md border border-green-100 dark:border-green-800">
                <span className="block text-3xl font-bold text-green-600 dark:text-green-400">{result.successCount}</span>
                <span className="text-sm text-green-800 dark:text-green-200">Actualizados</span>
              </div>
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md border border-red-100 dark:border-red-800">
                <span className="block text-3xl font-bold text-red-600 dark:text-red-400">{result.errorCount}</span>
                <span className="text-sm text-red-800 dark:text-red-200">Errores</span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Detalle de Errores:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-red-600 dark:text-red-400 max-h-60 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
