'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [assets, setAssets] = useState([]);
  const [latestSummary, setLatestSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
    
    if (user) {
      fetchData();
    }
  }, [user, loading, router]);
  
  const fetchData = async () => {
    try {
      // Obtener activos
      const assetsResponse = await fetch(`/api/assets?userId=${user.uid}`);
      const assetsData = await assetsResponse.json();
      setAssets(assetsData.assets || []);
      
      // Obtener último resumen
      const summariesResponse = await fetch(`/api/summaries?userId=${user.uid}&limit=1`);
      const summariesData = await summariesResponse.json();
      setLatestSummary(summariesData.summaries?.[0] || null);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };
  
  if (loading || (!user && !loading)) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financiero</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>
      </div>
      
      {isLoading ? (
        <div>Cargando datos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tus Activos ({assets.length})</h2>
            {assets.length > 0 ? (
              <div>
                <ul className="divide-y">
                  {assets.slice(0, 5).map(asset => (
                    <li key={asset.id} className="py-2">
                      <span className="font-medium">{asset.symbol}</span> - {asset.name}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/assets" 
                  className="block mt-4 text-blue-600 hover:text-blue-800"
                >
                  Gestionar activos →
                </Link>
              </div>
            ) : (
              <div>
                <p className="mb-4">No tienes activos registrados.</p>
                <Link 
                  href="/assets" 
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Añadir activos
                </Link>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Último Resumen</h2>
            {latestSummary ? (
              <div>
                <p className="mb-2">
                  <span className="font-medium">Fecha:</span> {new Date(latestSummary.createdAt).toLocaleDateString()}
                </p>
                <p className="mb-4">{latestSummary.summary.substring(0, 150)}...</p>
                <Link 
                  href="/summaries" 
                  className="text-blue-600 hover:text-blue-800"
                >
                  Ver resumen completo →
                </Link>
              </div>
            ) : (
              <p>
                No hay resúmenes disponibles aún. Los resúmenes se generan automáticamente cada sábado.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}