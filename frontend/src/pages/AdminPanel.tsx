import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vehicleApi, Vehicle } from '../api/vehicles';
import { useNavigate, Link } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formMake, setFormMake] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formCategory, setFormCategory] = useState('Sedan');
  const [formPrice, setFormPrice] = useState(0);
  const [formQuantity, setFormQuantity] = useState(0);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vehicleApi.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchVehicles();
    }
  }, [isAdmin, fetchVehicles]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await vehicleApi.updateVehicle(editingId, {
          make: formMake,
          model: formModel,
          category: formCategory,
          price: formPrice,
          quantity: formQuantity,
        });
      } else {
        await vehicleApi.createVehicle({
          make: formMake,
          model: formModel,
          category: formCategory,
          price: formPrice,
          quantity: formQuantity,
        });
      }
      resetForm();
      await fetchVehicles();
    } catch (err) {
      alert('Failed to save vehicle');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await vehicleApi.deleteVehicle(id);
      setDeleteConfirmId(null);
      await fetchVehicles();
    } catch (err) {
      alert('Failed to delete vehicle');
    }
  };

  const handleRestock = async (id: string) => {
    try {
      await vehicleApi.restockVehicle(id, { quantity: 5 });
      await fetchVehicles();
    } catch (err) {
      alert('Failed to restock vehicle');
    }
  };

  const startEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setFormMake(vehicle.make);
    setFormModel(vehicle.model);
    setFormCategory(vehicle.category);
    setFormPrice(vehicle.price);
    setFormQuantity(vehicle.quantity);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormMake('');
    setFormModel('');
    setFormCategory('Sedan');
    setFormPrice(0);
    setFormQuantity(0);
    setShowForm(false);
  };

  if (!isAdmin) return null;

  const totalValue = vehicles.reduce((sum, v) => sum + (v.price * Math.max(v.quantity, 0)), 0);

  const getPlaceholderImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'suv': return 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800';
      case 'sedan': return 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800';
      case 'performance':
      case 'coupe': return 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800';
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface select-none min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface-container-low/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/5">
        <div className="h-xl w-full px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="font-headline-lg text-headline-lg tracking-tight uppercase text-secondary">Lotwise</span>
          </div>
          <nav className="hidden md:flex items-center gap-lg">
            <Link to="/" className="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-secondary transition-all duration-300">Inventory</Link>
            <Link to="/admin" className="font-label-caps uppercase transition-all duration-300 text-secondary-fixed shadow-[0_0_15px_rgba(195,244,0,0.3)]" aria-current="page">Admin Panel</Link>
            <button onClick={logout} className="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-secondary transition-all duration-300">Log out</button>
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
          {/* Header Section */}
          <div className="px-margin-desktop py-lg flex flex-col md:flex-row justify-between items-end gap-lg mt-8">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 bg-secondary-fixed animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-secondary-fixed uppercase tracking-[0.2em]">System Status: Operational</span>
              </div>
              <h1 className="font-display-lg text-display-lg text-secondary uppercase leading-none">Fleet Command</h1>
              <p className="font-body-lg text-on-surface-variant max-w-xl">Real-time telemetry and inventory management for high-performance assets.</p>
            </div>
            
            <button onClick={() => { resetForm(); setShowForm(true); }} className="group relative flex items-center gap-md bg-secondary-fixed px-lg py-md shadow-[0_0_30px_rgba(195,244,0,0.2)] hover:shadow-[0_0_50px_rgba(195,244,0,0.4)] transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="material-symbols-outlined text-on-secondary-fixed text-[24px]">add_circle</span>
              <span className="font-label-caps text-label-caps text-on-secondary-fixed uppercase tracking-widest">Add New Vehicle</span>
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="px-margin-desktop grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">
            <div className="bg-secondary p-lg shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              <div className="flex justify-between items-start mb-md">
                <span className="font-label-caps text-label-caps text-surface-container-low uppercase">Total Inventory</span>
                <span className="material-symbols-outlined text-surface-container-low opacity-30">inventory_2</span>
              </div>
              <div className="flex items-baseline gap-sm">
                <span className="font-stats-xl text-stats-xl text-surface">{vehicles.length}</span>
              </div>
              <div className="mt-lg h-12 w-full flex items-end gap-[2px]">
                <div className="flex-1 bg-surface-container-low/10 h-[40%] group-hover:h-[60%] transition-all duration-500"></div>
                <div className="flex-1 bg-surface-container-low/10 h-[55%] group-hover:h-[80%] transition-all duration-500"></div>
                <div className="flex-1 bg-surface-container-low/10 h-[30%] group-hover:h-[50%] transition-all duration-500"></div>
                <div className="flex-1 bg-surface-container-low/10 h-[70%] group-hover:h-[90%] transition-all duration-500"></div>
                <div className="flex-1 bg-surface-container-low/10 h-[45%] group-hover:h-[65%] transition-all duration-500"></div>
                <div className="flex-1 bg-surface-container-low h-[85%]"></div>
              </div>
            </div>
            
            <div className="bg-secondary p-lg shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary-fixed"></div>
              <div className="flex justify-between items-start mb-md">
                <span className="font-label-caps text-label-caps text-surface-container-low uppercase">Fleet Value</span>
                <span className="material-symbols-outlined text-surface-container-low opacity-30">payments</span>
              </div>
              <div className="flex items-baseline gap-sm">
                <span className="font-stats-xl text-stats-xl text-surface">${(totalValue / 1000000).toFixed(1)}M</span>
              </div>
              <div className="mt-lg h-12 flex items-center overflow-hidden">
                <svg className="w-full h-full text-surface-container-low opacity-20" preserveAspectRatio="none" viewBox="0 0 200 40">
                  <path className="animate-[dash_2s_ease-in-out_infinite]" d="M0 40 L20 30 L40 35 L60 10 L80 25 L100 5 L120 15 L140 30 L160 10 L180 20 L200 0" fill="none" stroke="currentColor" strokeWidth="2"></path>
                </svg>
              </div>
            </div>
            
            <div className="bg-secondary p-lg shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-container"></div>
              <div className="flex justify-between items-start mb-md">
                <span className="font-label-caps text-label-caps text-surface-container-low uppercase">Avg. Turnaround</span>
                <span className="material-symbols-outlined text-surface-container-low opacity-30">speed</span>
              </div>
              <div className="flex items-baseline gap-sm">
                <span className="font-stats-xl text-stats-xl text-surface">14.2</span>
                <span className="font-body-md text-surface-container-low opacity-60">DAYS</span>
              </div>
              <div className="mt-lg flex gap-1">
                <div className="h-2 flex-1 bg-secondary-fixed"></div>
                <div className="h-2 flex-1 bg-secondary-fixed"></div>
                <div className="h-2 flex-1 bg-secondary-fixed"></div>
                <div className="h-2 flex-1 bg-secondary-fixed"></div>
                <div className="h-2 flex-1 bg-surface-container-low/20"></div>
                <div className="h-2 flex-1 bg-surface-container-low/20"></div>
                <div className="h-2 flex-1 bg-surface-container-low/20"></div>
              </div>
            </div>
          </div>

          {/* Inventory Technical Table */}
          <div className="px-margin-desktop mb-xl">
            <div className="bg-surface-container-low/50 backdrop-blur-md overflow-hidden">
              <div className="grid grid-cols-12 gap-gutter px-lg py-md border-b border-white/10 bg-surface-container">
                <div className="col-span-4 font-label-caps text-label-caps text-secondary-fixed-dim uppercase">Vehicle Asset / VIN</div>
                <div className="col-span-2 font-label-caps text-label-caps text-secondary-fixed-dim uppercase text-center">Status</div>
                <div className="col-span-2 font-label-caps text-label-caps text-secondary-fixed-dim uppercase text-right">Market Value</div>
                <div className="col-span-2 font-label-caps text-label-caps text-secondary-fixed-dim uppercase text-right">Qty</div>
                <div className="col-span-2 font-label-caps text-label-caps text-secondary-fixed-dim uppercase text-right">Action</div>
              </div>

              {loading ? (
                <div className="flex justify-center p-10"><span className="animate-spin text-secondary-fixed material-symbols-outlined">sync</span></div>
              ) : vehicles.length === 0 ? (
                <div className="p-10 text-center text-on-surface-variant font-label-caps">NO INVENTORY FOUND</div>
              ) : (
                vehicles.map(v => (
                  <div key={v.id} className="grid grid-cols-12 gap-gutter px-lg py-lg border-b border-white/5 hover:bg-white/5 transition-colors items-center group">
                    <div className="col-span-4 flex items-center gap-md">
                      <div className="w-16 h-12 bg-surface-container overflow-hidden">
                        <img src={getPlaceholderImage(v.category)} alt={v.make} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-secondary uppercase">{v.make} {v.model}</span>
                        <span className="font-label-caps text-[10px] text-on-surface-variant tracking-widest uppercase">{v.category}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      {v.quantity > 0 ? (
                        <span className="px-sm py-1 bg-secondary-fixed/10 border border-secondary-fixed/30 text-secondary-fixed font-label-caps text-[10px] uppercase">Available</span>
                      ) : (
                        <span className="px-sm py-1 bg-error/10 border border-error/30 text-error font-label-caps text-[10px] uppercase">Out of Stock</span>
                      )}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-body-lg text-secondary">${v.price.toLocaleString()}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-body-lg text-on-surface-variant">{v.quantity}</span>
                    </div>
                    <div className="col-span-2 flex justify-end gap-sm">
                      <button onClick={() => handleRestock(v.id)} className="p-xs text-on-surface-variant hover:text-secondary transition-colors" title="Restock +5">
                        <span className="material-symbols-outlined text-[20px]">package_2</span>
                      </button>
                      <button onClick={() => startEdit(v)} title="Edit" className="p-xs text-on-surface-variant hover:text-secondary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">edit_note</span>
                      </button>
                      <button onClick={() => setDeleteConfirmId(v.id)} title="Delete" className="p-xs text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>

                    {deleteConfirmId === v.id && (
                      <div className="col-span-12 mt-4 bg-error/10 border border-error/30 p-md flex items-center justify-between">
                        <span className="font-label-caps text-error">CONFIRM DELETION OF ASSET?</span>
                        <div className="flex gap-md">
                          <button onClick={() => setDeleteConfirmId(null)} className="font-label-caps text-on-surface-variant hover:text-secondary">CANCEL</button>
                          <button onClick={() => handleDelete(v.id)} className="font-label-caps text-secondary bg-error px-md py-xs">DELETE</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* System Diagnostics Sidebar/Overlay Simulation */}
          <div className="px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter pb-xl">
            <div className="md:col-span-3 flex flex-col gap-sm">
              <div className="flex items-center justify-between bg-surface-container-high px-md py-sm">
                <span className="font-label-caps text-label-caps text-secondary-fixed uppercase">Active Alerts</span>
                <span className="text-on-surface-variant font-label-caps text-[10px]">3 SENSORS PENDING</span>
              </div>
              <div className="flex flex-col gap-[1px]">
                <div className="bg-surface-container-low p-md flex items-center justify-between">
                  <div className="flex gap-md items-center">
                    <span className="material-symbols-outlined text-error">report_problem</span>
                    <span className="font-body-md text-on-surface">Asset Price Drift Detected (+4.2%)</span>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">2m ago</span>
                </div>
                <div className="bg-surface-container-low p-md flex items-center justify-between">
                  <div className="flex gap-md items-center">
                    <span className="material-symbols-outlined text-secondary-fixed">info</span>
                    <span className="font-body-md text-on-surface">Market sync completed for 48 regional nodes.</span>
                  </div>
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">14m ago</span>
                </div>
              </div>
            </div>
            <div className="bg-primary-container p-lg flex flex-col justify-between">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-secondary uppercase mb-xs">Command Queue</h3>
                <p className="font-body-md text-on-primary-container opacity-80 text-sm">Automated valuation engine is currently scanning global auctions.</p>
              </div>
              <div className="mt-lg">
                <div className="flex justify-between font-label-caps text-[10px] text-on-primary-container uppercase mb-1">
                  <span>Processing</span>
                  <span>84%</span>
                </div>
                <div className="h-1 w-full bg-white/10">
                  <div className="h-full bg-secondary-fixed w-[84%] shadow-[0_0_10px_rgba(195,244,0,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over Form Panel */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity" onClick={resetForm}></div>
          <div className="relative w-full max-w-xl bg-surface-container-low border-l border-white/10 shadow-2xl flex flex-col">
            <div className="relative h-32 w-full bg-surface-container-high flex items-end p-lg border-b border-white/5">
              <button onClick={resetForm} className="absolute top-6 right-6 text-on-surface-variant hover:text-secondary transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="font-display-lg-mobile text-secondary uppercase leading-none">{editingId ? 'Edit Asset' : 'New Asset'}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-lg">
              <form id="vehicle-form" onSubmit={handleSave} className="flex flex-col gap-lg">
                <div className="flex flex-col gap-xs">
                  <label htmlFor="make" className="font-label-caps text-secondary-fixed uppercase text-[10px]">Make</label>
                  <input id="make" required value={formMake} onChange={(e) => setFormMake(e.target.value)} className="w-full bg-surface-container border border-outline-variant py-md px-sm text-secondary font-body-md focus:outline-none focus:border-secondary-fixed transition-colors" placeholder="e.g. Porsche" type="text" />
                </div>
                
                <div className="flex flex-col gap-xs">
                  <label htmlFor="model" className="font-label-caps text-secondary-fixed uppercase text-[10px]">Model</label>
                  <input id="model" required value={formModel} onChange={(e) => setFormModel(e.target.value)} className="w-full bg-surface-container border border-outline-variant py-md px-sm text-secondary font-body-md focus:outline-none focus:border-secondary-fixed transition-colors" placeholder="e.g. 911 GT3 RS" type="text" />
                </div>

                <div className="flex flex-col gap-xs">
                  <label htmlFor="category" className="font-label-caps text-secondary-fixed uppercase text-[10px]">Category</label>
                  <select id="category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-surface-container border border-outline-variant py-md px-sm text-secondary font-body-md focus:outline-none focus:border-secondary-fixed transition-colors appearance-none">
                    <option value="Sedan">Luxury Sedan</option>
                    <option value="SUV">Sport Utility Vehicle</option>
                    <option value="Coupe">Grand Tourer / Coupe</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div className="flex flex-col gap-xs">
                  <label htmlFor="price" className="font-label-caps text-secondary-fixed uppercase text-[10px]">Price ($)</label>
                  <input id="price" required min="0" value={formPrice} onChange={(e) => setFormPrice(Number(e.target.value))} className="w-full bg-surface-container border border-outline-variant py-md px-sm text-secondary font-body-md focus:outline-none focus:border-secondary-fixed transition-colors" type="number" />
                </div>

                <div className="flex flex-col gap-xs">
                  <label htmlFor="quantity" className="font-label-caps text-secondary-fixed uppercase text-[10px]">Quantity</label>
                  <input id="quantity" required min="0" value={formQuantity} onChange={(e) => setFormQuantity(Number(e.target.value))} className="w-full bg-surface-container border border-outline-variant py-md px-sm text-secondary font-body-md focus:outline-none focus:border-secondary-fixed transition-colors" type="number" />
                </div>
              </form>
            </div>

            <div className="p-lg bg-surface-container-high border-t border-white/5 flex gap-md">
              <button form="vehicle-form" type="submit" className="flex-1 bg-secondary-fixed text-on-secondary font-label-caps uppercase py-md hover:bg-white transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)]">
                {editingId ? 'Update' : 'Execute'}
              </button>
              <button onClick={resetForm} type="button" className="flex-1 border border-outline-variant text-secondary font-label-caps uppercase py-md hover:bg-white/5 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
