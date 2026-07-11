import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vehicleApi, Vehicle } from '../api/vehicles';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // Structured search state — each field maps to a backend query param
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
      // Re-fetch with current active search params
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

  // Pre-defined images from the Stitch design
  const images = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvikWrfmiVSNBO9PALA40S-6c__xZikYoM6gQV_VtbqP3b8C8SKAEd6jzezrWBkBWjZmv1eDfRdN-A9eILNdaW4TLD4NxoUzdUhsrj0IC5q95bApfxFXw5FVds0v0fENLQXaSjeXye8VnaHXyTDs-SVYeqbLrycxBm3uW3aTeNdxeyzi4npb5KV4dilgtVUmUxyTW8x6OM0sTOFFQl_Q7WkkVmndGZW_Xu4RtPF6o3u4_kJr1kRIoquA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC7fxeTZCV6kJXx9mZeLFy4oLgUzaNVfx3MmNdeSwKq9IiuFuLyPfNcOPpL2s53ijX6I4kb5378hv1ml1yB2xklFVFeDkNOv83SwLOSKeq3O9tSk5sGBKDFrVu1MA-Hm6UhlMqG3SQHMU-QuMkejaradTfEW45XKd00ed2ImE45G2i9lgdTa06wUwwC4q6hwR71UeAbDptf8AI234oVZwwa_xqV8doOSjAWyzv1kXGlhDgx5ZWqhxCGrw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDOSgJLEdXdBrwTsq4wcT3ww1VexNHA3VB_P68Roa6sDD3dIYimhwhZStB2mR19q17-3WaxfGh_Zd7K8_QshzD-7ymMkxg9OB154Q-o6qSaTjhuRyTW6c382RCvECR1NT3j3nsa5mhPrf5zq8U-aqcU12tY_vS8wa5ThHafB8hBaXq2N_n7UuL0y-t-TjlUI4l5oax_gvuPGk_-XboouQI4MncahaFK3PcsgpGb4Qo7Hbv2eD0HJOmtOg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB76P-ZbEqDM0tD_DXtNzbVfuwS4dcuNJOxtAyh8Uv3aUV3rZm2P1V11nJJ0XEneJId5FcMgVb254tKovzmf5HDUGv0rc-EOtGA-6jv9SzNT6wKm0HlhwFCnvjh7AYDlolVFZazT66XLqcpIfRMUjfDZTDt8GIaRpNp9UPLuHHtgTfWEWFJIZF6GZRZr1AFZy15f7ev3IwA-CHgBcDtkkrCREEzcNRM-rDP9At9oR5xaJ-fJ99e6plBnA"
  ];

  const getImg = (index: number) => images[index % images.length];

  return (
    <div className="bg-background font-body-md text-on-surface select-none min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface-container-low/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
        <div className="h-xl w-full px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <img alt="Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASK8iXO5HKSk0BasPsx3Th7KAhQr_Bxd1v99qgy_Japq3bljAA1aX5QQdZltMNWX5_COA1eGaOH0yXbCKPToPaznuPhYGBzgY8uK1Fm5sPTJix3u26OqEouUk-SuoByDGgdg89rVcpWBTb__bpUjIw2ZVdYd17dSr3fm1SpO1vH2IQAAafWkD8gr0Tzl5BVfJlR0j4FZQkz-cbn0nDfSsN79oczrPccoduJ_MwMkBVhIyi0FtX9a-CXQ" />
            <span className="font-headline-lg text-headline-lg tracking-tight uppercase text-secondary">Lotwise</span>
          </div>
          <nav className="hidden md:flex items-center gap-lg">
            <Link to="/" className="font-label-caps uppercase transition-all duration-300 text-secondary-fixed shadow-[0_0_15px_rgba(195,244,0,0.3)]">Inventory</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="font-label-caps uppercase text-on-surface-variant hover:text-secondary transition-all duration-300">Admin Panel</Link>
            )}
            <button onClick={logout} className="font-label-caps uppercase text-on-surface-variant hover:text-secondary transition-all duration-300">Log out</button>
          </nav>
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shadow-[0_0_10px_rgba(195,244,0,0.4)]">
              <span className="material-symbols-outlined text-on-secondary-fixed text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-xl min-h-screen">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative w-full h-[870px] -mt-xl flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrifT0petntKoA84agC_5ekmIIyq-lirducaLF4HhP3BBSpCF3IgpYaXJEnM6c8XxVybUZTOwHlRFxZR0NrzHOMFiPv-V-TPnKQaN1eLRkHQs4vedQDQ5227lnzazLFIxMGR42vO-0KWLYBnGp9_Xei4_ZXwkxGN-5Ni4ysrBjQANKT8HIzlS_c2rc7phHaobInPGhER9etUEMfZBvVMVmveEhsQHsiiTvPZBaCZWZngk-RZohabyIzQ')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-surface/40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent"></div>
            </div>
            
            <div className="relative z-10 w-full px-margin-desktop mt-xl">
              <div className="max-w-4xl space-y-lg">
                <div className="space-y-xs">
                  <span className="font-label-caps text-label-caps text-secondary-fixed tracking-[0.2em] uppercase">Performance Asset Management</span>
                  <h1 className="font-display-lg text-display-lg text-secondary max-w-2xl leading-none">
                    PRECISION <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-fixed to-secondary">ALLOCATION.</span>
                  </h1>
                </div>

                {/* Technical Search / Filter Panel */}
                <form onSubmit={handleSearch} className="relative max-w-3xl group">
                  <div className="absolute -inset-1 bg-secondary-fixed/20 blur-md group-focus-within:bg-secondary-fixed/40 transition-all"></div>
                  <div className="relative bg-surface-container-low border border-white/10 p-base">
                    {/* Primary make search row */}
                    <div className="flex items-center mb-sm">
                      <span className="material-symbols-outlined text-on-surface-variant px-md">search</span>
                      <input
                        type="text"
                        value={searchMake}
                        onChange={(e) => setSearchMake(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-secondary font-label-caps placeholder:text-on-surface-variant/50 py-md focus:outline-none"
                        placeholder="SEARCH BY MAKE..."
                      />
                    </div>
                    {/* Additional filters */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-xs px-md pb-sm">
                      <input
                        type="text"
                        value={searchModel}
                        onChange={(e) => setSearchModel(e.target.value)}
                        className="bg-surface-container border border-white/10 text-secondary font-label-caps placeholder:text-on-surface-variant/40 px-sm py-xs text-[11px] focus:outline-none focus:border-secondary-fixed/50"
                        placeholder="MODEL"
                      />
                      <input
                        type="text"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="bg-surface-container border border-white/10 text-secondary font-label-caps placeholder:text-on-surface-variant/40 px-sm py-xs text-[11px] focus:outline-none focus:border-secondary-fixed/50"
                        placeholder="CATEGORY"
                      />
                      <input
                        type="number"
                        value={searchPriceMin}
                        onChange={(e) => setSearchPriceMin(e.target.value)}
                        min="0"
                        className="bg-surface-container border border-white/10 text-secondary font-label-caps placeholder:text-on-surface-variant/40 px-sm py-xs text-[11px] focus:outline-none focus:border-secondary-fixed/50"
                        placeholder="MIN PRICE $"
                      />
                      <input
                        type="number"
                        value={searchPriceMax}
                        onChange={(e) => setSearchPriceMax(e.target.value)}
                        min="0"
                        className="bg-surface-container border border-white/10 text-secondary font-label-caps placeholder:text-on-surface-variant/40 px-sm py-xs text-[11px] focus:outline-none focus:border-secondary-fixed/50"
                        placeholder="MAX PRICE $"
                      />
                    </div>
                    <div className="flex gap-sm px-md">
                      <button type="submit" className="flex-1 bg-secondary-fixed text-on-secondary px-lg py-md font-label-caps hover:bg-secondary transition-colors">
                        EXECUTE
                      </button>
                      <button type="button" onClick={handleClearSearch} className="px-lg py-md font-label-caps border border-white/20 text-on-surface-variant hover:text-secondary transition-colors">
                        CLEAR
                      </button>
                    </div>
                  </div>
                  <div className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-secondary-fixed"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-secondary-fixed"></div>
                </form>

                <div className="flex gap-md">
                  <button onClick={() => fetchVehicles()} className="flex items-center gap-sm bg-secondary-fixed text-on-secondary px-xl py-md font-label-caps hover:scale-105 transition-transform shadow-[0_0_20px_rgba(195,244,0,0.3)]">
                    EXPLORE INVENTORY
                    <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                  <button className="flex items-center gap-sm border border-white/20 text-secondary px-xl py-md font-label-caps hover:bg-white/5 transition-colors backdrop-blur-sm">
                    SECURE ALLOCATION
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Staggered Inventory Grid */}
          <section className="px-margin-desktop py-xl relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-container/5 blur-[120px] pointer-events-none"></div>
            
            <div className="grid grid-cols-12 gap-gutter">
              <div className="col-span-12 mb-lg flex items-end justify-between">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-secondary uppercase italic">Current Stock</h2>
                  <div className="h-1 w-24 bg-secondary-fixed mt-xs"></div>
                </div>
                <div className="flex gap-xs items-center font-label-caps text-on-surface-variant">
                  <span>LIVE TELEMETRY</span>
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse"></span>
                </div>
              </div>

              {loading ? (
                <div className="col-span-12 flex justify-center py-20 text-secondary-fixed">
                  <span className="material-symbols-outlined animate-spin text-[48px]">refresh</span>
                </div>
              ) : fetchError ? (
                <div className="col-span-12 text-center py-20 bg-error/10 rounded-xl border border-error/30">
                  <span className="material-symbols-outlined text-[48px] text-error mb-4">error_outline</span>
                  <h3 className="font-headline-lg text-error mb-2 uppercase">Failed to Load Inventory</h3>
                  <p className="font-body-md text-on-surface-variant mb-6">{fetchError}</p>
                  <button
                    onClick={() => fetchVehicles()}
                    className="font-label-caps uppercase px-lg py-md bg-secondary-fixed text-on-secondary hover:bg-white transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="col-span-12 text-center py-20 bg-surface-container rounded-xl border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">inventory_2</span>
                  <h3 className="font-headline-lg text-secondary mb-2 uppercase">No vehicles found</h3>
                  <p className="font-body-md text-on-surface-variant">Adjust your telemetry filters.</p>
                </div>
              ) : (
                <>
                  {/* Map the first 4 vehicles into the special layout */}
                  {vehicles[0] && (
                    <div className="col-span-12 md:col-span-7 group">
                      <div className="bg-secondary shadow-xl h-full flex flex-col md:flex-row overflow-hidden relative">
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                          <img src={getImg(0)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={vehicles[0].make} />
                          <div className="absolute top-sm left-sm bg-surface-container-lowest text-secondary-fixed px-sm py-xs font-label-caps text-[10px]">
                            {vehicles[0].quantity > 0 ? 'IN STOCK' : 'SOLD OUT'}
                          </div>
                        </div>
                        <div className="w-full md:w-1/2 p-lg flex flex-col justify-between bg-white text-surface">
                          <div>
                            <div className="flex justify-between items-start mb-sm">
                              <span className="font-label-caps text-on-surface-variant">{vehicles[0].category}</span>
                            </div>
                            <h3 className="font-headline-lg text-surface leading-tight mb-xs uppercase">{vehicles[0].make} <br/>{vehicles[0].model}</h3>
                          </div>
                          <div className="space-y-sm">
                            <div className="flex items-baseline gap-xs">
                              <span className="font-label-caps text-on-surface-variant">PRICE</span>
                              <span className="font-stats-xl text-secondary-fixed-variant tracking-tighter">${vehicles[0].price.toLocaleString()}</span>
                            </div>
                            <button 
                              onClick={() => handlePurchase(vehicles[0].id)}
                              disabled={vehicles[0].quantity <= 0}
                              className={`w-full font-label-caps py-sm transition-colors uppercase ${vehicles[0].quantity <= 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-surface text-secondary hover:bg-surface-bright'}`}
                            >
                              {vehicles[0].quantity > 0 ? 'Purchase Vehicle' : 'Out of Stock'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {vehicles[1] && (
                    <div className="col-span-12 md:col-span-5 md:-mt-16 group">
                      <div className="bg-secondary shadow-xl overflow-hidden h-full flex flex-col">
                        <div className="h-64 relative">
                          <img src={getImg(1)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={vehicles[1].make} />
                        </div>
                        <div className="p-lg bg-white flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-md">
                              <h3 className="font-headline-sm text-surface uppercase">{vehicles[1].make} {vehicles[1].model}</h3>
                            </div>
                            <div className="flex items-center justify-between border-y border-on-surface-variant/10 py-sm mb-md">
                              <div className="flex flex-col text-right">
                                <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Status</span>
                                <span className="font-label-caps text-on-secondary-fixed-variant">{vehicles[1].quantity > 0 ? 'AVAILABLE' : 'SOLD OUT'} ({vehicles[1].quantity})</span>
                              </div>
                            </div>
                            <span className="font-stats-xl text-secondary-fixed-variant text-[28px]">${vehicles[1].price.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handlePurchase(vehicles[1].id)}
                            disabled={vehicles[1].quantity <= 0}
                            className={`w-full mt-4 font-label-caps py-sm transition-colors uppercase ${vehicles[1].quantity <= 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-surface text-secondary hover:bg-surface-bright'}`}
                          >
                            Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {vehicles[2] && (
                    <div className="col-span-12 md:col-span-4 group">
                      <div className="bg-secondary shadow-xl h-full flex flex-col">
                        <div className="h-48 relative overflow-hidden">
                          <img src={getImg(2)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={vehicles[2].make} />
                        </div>
                        <div className="p-md bg-white flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex gap-1 mb-xs">
                              <div className="h-1 flex-1 bg-secondary-fixed-dim"></div>
                              <div className="h-1 flex-1 bg-on-surface-variant/20"></div>
                            </div>
                            <h4 className="font-label-caps text-surface-variant mb-xs uppercase">{vehicles[2].make} {vehicles[2].model}</h4>
                            <span className="font-headline-sm text-secondary-fixed-variant">${vehicles[2].price.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handlePurchase(vehicles[2].id)}
                            disabled={vehicles[2].quantity <= 0}
                            className={`w-full mt-4 font-label-caps py-2 transition-colors uppercase ${vehicles[2].quantity <= 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-surface text-secondary hover:bg-surface-bright'}`}
                          >
                            Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {vehicles[3] && (
                    <div className="col-span-12 md:col-span-4 group md:-mt-8">
                      <div className="bg-secondary shadow-xl h-full flex flex-col">
                        <div className="flex-grow relative min-h-[250px]">
                          <img src={getImg(3)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={vehicles[3].make} />
                        </div>
                        <div className="p-md bg-white border-t-4 border-secondary-fixed flex flex-col justify-between">
                          <div>
                            <h4 className="font-label-caps text-surface-variant mb-xs uppercase">{vehicles[3].make} {vehicles[3].model}</h4>
                            <p className="font-body-md text-surface text-sm mb-sm italic">Qty: {vehicles[3].quantity}</p>
                            <span className="font-headline-sm text-secondary-fixed-variant">${vehicles[3].price.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handlePurchase(vehicles[3].id)}
                            disabled={vehicles[3].quantity <= 0}
                            className={`w-full mt-4 font-label-caps py-2 transition-colors uppercase ${vehicles[3].quantity <= 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-surface text-secondary hover:bg-surface-bright'}`}
                          >
                            Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Horizontal Data Card */}
                  <div className="col-span-12 md:col-span-4 group">
                    <div className="bg-surface-container-highest p-lg border-l-8 border-secondary-fixed flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-sm mb-md">
                          <span className="material-symbols-outlined text-secondary-fixed">analytics</span>
                          <span className="font-label-caps text-on-surface-variant tracking-widest uppercase">Market Telemetry</span>
                        </div>
                        <h3 className="font-headline-sm text-secondary mb-base">ASSET APPRECIATION</h3>
                        <p className="font-body-md text-on-surface-variant text-sm">Our inventory has seen a +14.2% value increase over the last Q3 fiscal period.</p>
                      </div>
                      <div className="mt-lg">
                        <div className="flex justify-between items-end mb-xs">
                          <span className="font-label-caps text-secondary-fixed">MARKET HEAT</span>
                          <span className="font-label-caps text-secondary">92%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 overflow-hidden">
                          <div className="h-full bg-secondary-fixed w-[92%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Standard cards for remaining vehicles */}
                  {vehicles.slice(4).map((v, idx) => (
                    <div key={v.id} className="col-span-12 md:col-span-4 group">
                      <div className="bg-secondary shadow-xl h-full flex flex-col">
                        <div className="h-48 relative overflow-hidden">
                          <img src={getImg(idx + 4)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={v.make} />
                        </div>
                        <div className="p-md bg-white flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-label-caps text-surface-variant mb-xs uppercase">{v.make} {v.model}</h4>
                            <p className="font-body-md text-surface text-sm mb-sm italic">Qty: {v.quantity}</p>
                            <span className="font-headline-sm text-secondary-fixed-variant">${v.price.toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handlePurchase(v.id)}
                            disabled={v.quantity <= 0}
                            className={`w-full mt-4 font-label-caps py-2 transition-colors uppercase ${v.quantity <= 0 ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-surface text-secondary hover:bg-surface-bright'}`}
                          >
                            Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                </>
              )}
            </div>
          </section>

          <div className="fixed left-4 bottom-24 [writing-mode:vertical-rl] rotate-180 pointer-events-none opacity-20 hidden lg:block">
            <span className="font-label-caps text-[64px] leading-none text-secondary tracking-tighter">PERFORMANCE FIRST</span>
          </div>

        </div>
      </main>

      <footer className="w-full bg-surface-container-lowest py-xl border-t border-white/5">
        <div className="px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="space-y-sm">
            <div className="flex items-center gap-xs">
              <span className="font-headline-sm text-headline-sm uppercase text-secondary">Lotwise</span>
            </div>
            <p className="text-on-surface-variant font-body-md text-sm">High-performance asset management for the modern racing era.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
