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
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-indigo-500/30">
      <header className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <span className="material-symbols-outlined text-white text-lg">directions_car</span>
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white uppercase">Lotwise</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">Inventory</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium tracking-wider text-gray-400 hover:text-white uppercase transition-colors">Admin Panel</Link>
            )}
            <button onClick={logout} className="text-sm font-medium tracking-wider text-gray-400 hover:text-white uppercase transition-colors">Log out</button>
          </nav>
        </div>
      </header>

      <main className="w-full pt-20">
        <section className="relative w-full py-24 flex items-center justify-center overflow-hidden border-b border-gray-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-950 to-gray-950"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase">Premium Asset Management</span>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight uppercase">
                  Discover <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Excellence.</span>
                </h1>
              </div>

              <form onSubmit={handleSearch} className="relative w-full max-w-3xl">
                <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center mb-4 border-b border-gray-800 pb-4">
                    <span className="material-symbols-outlined text-gray-500 mr-3">search</span>
                    <input
                      type="text"
                      value={searchMake}
                      onChange={(e) => setSearchMake(e.target.value)}
                      className="flex-1 bg-transparent border-none text-white font-medium placeholder:text-gray-600 focus:outline-none text-lg"
                      placeholder="SEARCH BY MAKE..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <input
                      type="text"
                      value={searchModel}
                      onChange={(e) => setSearchModel(e.target.value)}
                      className="bg-gray-950 border border-gray-800 rounded-lg text-white text-sm font-medium placeholder:text-gray-600 px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="MODEL"
                    />
                    <input
                      type="text"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="bg-gray-950 border border-gray-800 rounded-lg text-white text-sm font-medium placeholder:text-gray-600 px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="CATEGORY"
                    />
                    <input
                      type="number"
                      value={searchPriceMin}
                      onChange={(e) => setSearchPriceMin(e.target.value)}
                      min="0"
                      className="bg-gray-950 border border-gray-800 rounded-lg text-white text-sm font-medium placeholder:text-gray-600 px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="MIN PRICE"
                    />
                    <input
                      type="number"
                      value={searchPriceMax}
                      onChange={(e) => setSearchPriceMax(e.target.value)}
                      min="0"
                      className="bg-gray-950 border border-gray-800 rounded-lg text-white text-sm font-medium placeholder:text-gray-600 px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="MAX PRICE"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-lg px-8 py-3 font-semibold text-sm tracking-wide uppercase hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                      Execute
                    </button>
                    <button type="button" onClick={handleClearSearch} className="px-8 py-3 rounded-lg font-semibold text-sm tracking-wide border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors uppercase">
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-10 flex items-end justify-between border-b border-gray-800 pb-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-white uppercase tracking-tight">Current Stock</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 tracking-widest uppercase">
              <span>Live Feed</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
          </div>

          {loading ? (
            <div className="w-full flex justify-center py-32">
              <span className="material-symbols-outlined animate-spin text-5xl text-indigo-500">refresh</span>
            </div>
          ) : fetchError ? (
            <div className="w-full text-center py-24 bg-red-500/5 rounded-2xl border border-red-500/20">
              <span className="material-symbols-outlined text-5xl text-red-400 mb-4">error_outline</span>
              <h3 className="font-display text-2xl font-bold text-red-400 mb-2 uppercase">Failed to Load Inventory</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">{fetchError}</p>
              <button
                onClick={() => fetchVehicles()}
                className="font-semibold text-sm tracking-wider uppercase px-8 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all"
              >
                Retry
              </button>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="w-full text-center py-32 bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
              <span className="material-symbols-outlined text-5xl text-gray-600 mb-4">inventory_2</span>
              <h3 className="font-display text-2xl font-bold text-gray-300 mb-2 uppercase">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((v, idx) => (
                <div key={v.id} className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-indigo-500/50 transition-colors flex flex-col">
                  <div className="h-64 relative overflow-hidden bg-gray-950">
                    <img src={getImg(idx)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" alt={v.make} />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold tracking-wider uppercase backdrop-blur-md border ${
                        v.quantity > 0 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : 'bg-gray-900/80 text-gray-500 border-gray-700'
                      }`}>
                        {v.quantity > 0 ? 'In Stock' : 'Sold Out'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">{v.category}</span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">QTY: {v.quantity}</span>
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white uppercase mb-4">
                        {v.make} {v.model}
                      </h3>
                      <div className="text-3xl font-bold text-white mb-6">
                        ${v.price.toLocaleString()}
                      </div>
                    </div>
                    <button 
                      onClick={() => handlePurchase(v.id)}
                      disabled={v.quantity <= 0}
                      className={`w-full py-4 rounded-xl font-semibold text-sm tracking-wider transition-all uppercase flex items-center justify-center gap-2 ${
                        v.quantity <= 0 
                          ? 'bg-gray-950 text-gray-600 border border-gray-800 cursor-not-allowed' 
                          : 'bg-white text-gray-950 hover:bg-gray-200 active:scale-[0.98]'
                      }`}
                    >
                      {v.quantity > 0 ? (
                        <>Purchase <span className="material-symbols-outlined text-sm">shopping_cart</span></>
                      ) : (
                        'Out of Stock'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
