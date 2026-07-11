import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vehicleApi, Vehicle, VehicleSearchParams } from '../api/vehicles';
import { VehicleCard } from '../components/VehicleCard';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchVehicles = useCallback(async (params?: VehicleSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (params && Object.keys(params).length > 0) {
        data = await vehicleApi.searchVehicles(params);
      } else {
        data = await vehicleApi.getVehicles();
      }
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      // Very basic search implementation - assuming user searches by make or model
      const params: VehicleSearchParams = searchQuery ? { make: searchQuery } : {};
      // In a real app, you might parse the search query to split into make/model/category,
      // or the backend would support a generic 'q' parameter. For now, we search by make.
      fetchVehicles(params);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, fetchVehicles]);

  const handlePurchase = async (id: string) => {
    try {
      await vehicleApi.purchaseVehicle(id);
      // Re-fetch vehicles to update stock
      await fetchVehicles(searchQuery ? { make: searchQuery } : {});
    } catch (err) {
      alert('Failed to purchase vehicle.');
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-container-margin flex items-center justify-between">
          <div className="flex items-center gap-stack-md">
            <span
              className="material-symbols-outlined text-[32px] text-primary"
              style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}
            >
              view_in_ar
            </span>
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight">Lotwise</span>
            {user?.role === 'admin' && (
              <div className="ml-stack-md px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-[10px] uppercase tracking-widest">
                Admin
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-stack-md">
            <button 
              onClick={logout}
              className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Log out
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-24 bg-surface min-h-screen px-container-margin py-stack-lg pb-32">
        <div className="flex flex-col w-full gap-stack-lg max-w-7xl mx-auto">
          {/* Dynamic Header Section */}
          <section className="relative w-full flex flex-col md:flex-row md:items-end justify-between gap-stack-lg overflow-hidden">
            <div className="flex flex-col gap-unit">
              <div className="flex items-center gap-stack-sm mb-unit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">Live Inventory Feed</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl tracking-tighter max-w-2xl">
                Precision Fleet <span className="text-primary-fixed-dim">Management</span>
              </h1>
            </div>

            {/* Search & Quick Filters */}
            <div className="flex flex-col gap-stack-md w-full md:w-auto">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-[400px] bg-surface-container-high border-none rounded-lg py-4 pl-12 pr-4 text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary transition-all outline-none"
                  placeholder="Search by Make..."
                />
              </div>
              <div className="flex flex-wrap gap-stack-sm">
                <button onClick={() => fetchVehicles()} className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-mono text-label-mono uppercase tracking-wider hover:brightness-110 transition-all">All Stock</button>
                <button onClick={() => fetchVehicles({ category: 'suv' })} className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider hover:bg-surface-variant transition-all">SUV</button>
                <button onClick={() => fetchVehicles({ category: 'sedan' })} className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider hover:bg-surface-variant transition-all">Sedan</button>
                <button onClick={() => fetchVehicles({ category: 'performance' })} className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider hover:bg-surface-variant transition-all">Performance</button>
                <div className="h-6 w-px bg-outline-variant mx-2 hidden md:block"></div>
                <button className="flex items-center gap-unit px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono text-label-mono uppercase tracking-wider hover:bg-surface-variant transition-all">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Filters
                </button>
              </div>
            </div>
          </section>

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-lg bg-error-container text-on-error-container font-body-md border border-error/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-error shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Inventory Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin h-10 w-10 text-primary border-4 border-primary/20 border-t-primary rounded-full"></div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-20 bg-surface-container rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">inventory_2</span>
              <h3 className="font-headline-lg text-on-surface mb-2">No vehicles found</h3>
              <p className="font-body-md text-on-surface-variant">Try adjusting your search filters.</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onPurchase={handlePurchase} />
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
