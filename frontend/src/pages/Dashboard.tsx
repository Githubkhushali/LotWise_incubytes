import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vehicleApi, Vehicle } from '../api/vehicles';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchMake, setSearchMake] = useState('');
  const [searchModel, setSearchModel] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchPriceMin, setSearchPriceMin] = useState('');
  const [searchPriceMax, setSearchPriceMax] = useState('');

  const buildSearchParams = () => {
    const params: Record<string, any> = {};
    if (searchMake.trim()) params.make = searchMake.trim();
    if (searchModel.trim()) params.model = searchModel.trim();
    if (searchCategory.trim()) params.category = searchCategory.trim();
    if (searchPriceMin.trim()) params.priceMin = Number(searchPriceMin);
    if (searchPriceMax.trim()) params.priceMax = Number(searchPriceMax);
    return params;
  };

  const fetchVehicles = useCallback(async (params?: Record<string, any>) => {
    try {
      setLoading(true);
      setFetchError(null);
      let data;
      if (params && Object.keys(params).length > 0) {
        data = await vehicleApi.searchVehicles(params);
      } else {
        data = await vehicleApi.getVehicles();
      }
      setVehicles(data);
    } catch (err: any) {
      console.error('Failed to load vehicles', err);
      setFetchError(err?.message || 'Failed to load vehicles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handlePurchase = async (id: string) => {
    try {
      await vehicleApi.purchaseVehicle(id);
      const params = buildSearchParams();
      await fetchVehicles(Object.keys(params).length > 0 ? params : undefined);
    } catch (err: any) {
      alert(err?.message || 'Failed to purchase vehicle.');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = buildSearchParams();
    fetchVehicles(Object.keys(params).length > 0 ? params : undefined);
  };

  const handleClearSearch = () => {
    setSearchMake('');
    setSearchModel('');
    setSearchCategory('');
    setSearchPriceMin('');
    setSearchPriceMax('');
    fetchVehicles();
  };

  const images = [
    "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503376264072-a083377755be?q=80&w=800&auto=format&fit=crop"
  ];

  const getImg = (index: number) => images[index % images.length];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30">
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.5)]">
              <span className="material-symbols-outlined text-white text-lg">directions_car</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white uppercase">Lotwise</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold tracking-wider text-rose-500 uppercase">Inventory</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium tracking-wider text-slate-400 hover:text-white uppercase transition-colors">Admin Panel</Link>
            )}
            <button onClick={logout} className="text-sm font-medium tracking-wider text-slate-400 hover:text-white uppercase transition-colors">Log out</button>
          </nav>
        </div>
      </header>

      <main className="w-full pt-20">
        <section className="relative w-full py-24 flex items-center justify-center overflow-hidden border-b border-slate-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-slate-950 to-slate-950"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-rose-500 tracking-[0.2em] uppercase">Premium Asset Management</span>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight uppercase">
                  Discover <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-500">Excellence.</span>
                </h1>
              </div>

              <form onSubmit={handleSearch} className="relative w-full max-w-3xl">
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center mb-4 border-b border-slate-800 pb-4">
                    <span className="material-symbols-outlined text-slate-500 mr-3">search</span>
                    <input
                      type="text"
                      value={searchMake}
                      onChange={(e) => setSearchMake(e.target.value)}
                      className="flex-1 bg-transparent border-none text-white font-medium placeholder:text-slate-600 focus:outline-none text-lg focus-visible:ring-0"
                      placeholder="SEARCH BY MAKE..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <input
                      type="text"
                      value={searchModel}
                      onChange={(e) => setSearchModel(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-white text-sm font-medium placeholder:text-slate-600 px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      placeholder="MODEL"
                    />
                    <input
                      type="text"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-white text-sm font-medium placeholder:text-slate-600 px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      placeholder="CATEGORY"
                    />
                    <input
                      type="number"
                      value={searchPriceMin}
                      onChange={(e) => setSearchPriceMin(e.target.value)}
                      min="0"
                      className="bg-slate-950 border border-slate-800 rounded-lg text-white text-sm font-medium placeholder:text-slate-600 px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      placeholder="MIN PRICE"
                    />
                    <input
                      type="number"
                      value={searchPriceMax}
                      onChange={(e) => setSearchPriceMax(e.target.value)}
                      min="0"
                      className="bg-slate-950 border border-slate-800 rounded-lg text-white text-sm font-medium placeholder:text-slate-600 px-4 py-3 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                      placeholder="MAX PRICE"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-rose-600 text-white rounded-lg px-8 py-3 font-semibold text-sm tracking-wide uppercase hover:bg-rose-500 transition-colors shadow-lg shadow-rose-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                      Execute
                    </button>
                    <button type="button" onClick={handleClearSearch} className="px-8 py-3 rounded-lg font-semibold text-sm tracking-wide border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10 flex items-end justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tight">Current Stock</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-widest uppercase">
              <span>Live Feed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
          </div>

          {loading ? (
            <div className="w-full flex justify-center py-32">
              <span className="material-symbols-outlined animate-spin text-5xl text-rose-500">refresh</span>
            </div>
          ) : fetchError ? (
            <div className="w-full text-center py-24 bg-red-500/5 rounded-2xl border border-red-500/20">
              <span className="material-symbols-outlined text-5xl text-red-400 mb-4">error_outline</span>
              <h3 className="font-display text-2xl font-bold text-red-400 mb-2 uppercase">Failed to Load Inventory</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">{fetchError}</p>
              <button
                onClick={() => fetchVehicles()}
                className="font-semibold text-sm tracking-wider uppercase px-8 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Retry
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="w-full text-center py-32 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-4">inventory_2</span>
              <h3 className="font-display text-2xl font-bold text-slate-300 mb-2 uppercase">No vehicles found</h3>
              <p className="text-slate-500">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((v, idx) => {
                const isOutOfStock = v.quantity <= 0;
                return (
                  <div key={v.id} className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-rose-500/50 transition-colors flex flex-col">
                    <div className="h-64 relative overflow-hidden bg-slate-950">
                      <img 
                        src={getImg(idx)} 
                        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ${isOutOfStock ? 'opacity-40 grayscale-[50%]' : 'opacity-90 group-hover:opacity-100'}`} 
                        alt={v.make} 
                      />
                      <div className="absolute top-4 left-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded backdrop-blur-md border ${
                          isOutOfStock 
                            ? 'bg-slate-900/80 border-slate-700 text-slate-400' 
                            : 'bg-slate-900/60 border-slate-600 text-white shadow-lg'
                        }`}>
                          {!isOutOfStock && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></span>}
                          <span className="text-[10px] font-bold tracking-widest uppercase">
                            {isOutOfStock ? 'Sold Out' : 'In Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold text-rose-500 tracking-wider uppercase">{v.category}</span>
                          <span className="text-xs text-slate-500 font-medium tracking-wide">QTY: {v.quantity}</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white uppercase mb-4">
                          {v.make} {v.model}
                        </h3>
                        <div className={`text-3xl font-bold mb-6 ${isOutOfStock ? 'text-slate-500' : 'text-white'}`}>
                          ${v.price.toLocaleString()}
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePurchase(v.id)}
                        disabled={isOutOfStock}
                        className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wider transition-all uppercase flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                          isOutOfStock 
                            ? 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed scale-[0.98]' 
                            : 'bg-white text-slate-950 hover:bg-slate-200 active:scale-[0.98] shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isOutOfStock ? (
                          <>Out of Stock <span className="material-symbols-outlined text-sm">block</span></>
                        ) : (
                          <>Purchase <span className="material-symbols-outlined text-sm">shopping_cart</span></>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
