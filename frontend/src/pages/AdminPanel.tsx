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
            <Link to="/" className="text-sm font-medium tracking-wider text-slate-400 hover:text-white uppercase transition-colors">Inventory</Link>
            <Link to="/admin" className="text-sm font-semibold tracking-wider text-rose-500 uppercase">Admin Panel</Link>
            <button onClick={logout} className="text-sm font-medium tracking-wider text-slate-400 hover:text-white uppercase transition-colors">Log out</button>
          </nav>
        </div>
      </header>

      <main className="w-full pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">System Status: Operational</span>
              </div>
              <h1 className="font-display text-4xl font-bold text-white uppercase tracking-tight">Fleet Command</h1>
            </div>
            
            <button 
              onClick={() => { resetForm(); setShowForm(true); }} 
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold text-sm tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span>Add New Vehicle</span>
            </button>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Total Inventory</span>
                <span className="material-symbols-outlined text-slate-700">inventory_2</span>
              </div>
              <div className="text-4xl font-bold text-white">{vehicles.length}</div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Fleet Value</span>
                <span className="material-symbols-outlined text-slate-700">payments</span>
              </div>
              <div className="text-4xl font-bold text-white">${(totalValue / 1000000).toFixed(1)}M</div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-500"></div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Avg. Turnaround</span>
                <span className="material-symbols-outlined text-slate-700">speed</span>
              </div>
              <div className="text-4xl font-bold text-white">14.2 <span className="text-xl font-normal text-slate-600 tracking-normal">DAYS</span></div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-950 border-b border-slate-800">
              <div className="col-span-5 text-xs font-bold text-slate-500 tracking-widest uppercase">Vehicle Asset / VIN</div>
              <div className="col-span-2 text-xs font-bold text-slate-500 tracking-widest uppercase text-center">Status</div>
              <div className="col-span-2 text-xs font-bold text-slate-500 tracking-widest uppercase text-right">Market Value</div>
              <div className="col-span-1 text-xs font-bold text-slate-500 tracking-widest uppercase text-right">Qty</div>
              <div className="col-span-2 text-xs font-bold text-slate-500 tracking-widest uppercase text-right">Action</div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><span className="animate-spin text-4xl text-rose-500 material-symbols-outlined">refresh</span></div>
            ) : vehicles.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm font-semibold tracking-widest uppercase">No Inventory Found</div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {vehicles.map(v => (
                  <div key={v.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors items-center group">
                    <div className="col-span-5 flex items-center gap-4">
                      <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 border border-slate-800 bg-slate-950">
                        <img src={getPlaceholderImage(v.category)} alt={v.make} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display font-bold text-white uppercase text-lg leading-tight">
                          {v.make} {v.model}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">{v.category}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex justify-center">
                      {v.quantity > 0 ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">Available</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="col-span-2 text-right font-medium text-slate-300">
                      ${v.price.toLocaleString()}
                    </div>
                    
                    <div className="col-span-1 text-right font-medium text-slate-400">
                      {v.quantity}
                    </div>
                    
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => handleRestock(v.id)} className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500" title="Restock +5">
                        <span className="material-symbols-outlined text-[20px]">package_2</span>
                      </button>
                      <button onClick={() => startEdit(v)} title="Edit" className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirmId(v.id)} title="Delete" className="w-8 h-8 rounded flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>

                    {deleteConfirmId === v.id && (
                      <div className="col-span-12 mt-4 bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 flex items-center justify-between">
                        <span className="text-sm font-bold text-rose-500 uppercase tracking-widest">Confirm deletion of asset?</span>
                        <div className="flex gap-3">
                          <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 text-xs font-bold tracking-widest text-slate-400 hover:text-white uppercase transition-colors focus-visible:outline-none focus-visible:underline">Cancel</button>
                          <button onClick={() => handleDelete(v.id)} className="px-4 py-2 rounded bg-rose-600 text-white text-xs font-bold tracking-widest uppercase hover:bg-rose-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 shadow-[0_0_15px_rgba(225,29,72,0.3)]">DELETE</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Slide-over Form Panel */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={resetForm}></div>
          <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full overflow-hidden animate-[slideIn_0.3s_ease-out]">
            <div className="h-24 bg-slate-950 flex items-center px-8 border-b border-slate-800 relative">
              <h2 className="font-display text-2xl font-bold text-white uppercase tracking-tight">{editingId ? 'Edit Asset' : 'New Asset'}</h2>
              <button onClick={resetForm} className="absolute right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-full hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <form id="vehicle-form" onSubmit={handleSave} className="flex flex-col gap-6">
                <div>
                  <label htmlFor="make" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Make</label>
                  <input id="make" required value={formMake} onChange={(e) => setFormMake(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="e.g. Porsche" type="text" />
                </div>
                
                <div>
                  <label htmlFor="model" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Model</label>
                  <input id="model" required value={formModel} onChange={(e) => setFormModel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" placeholder="e.g. 911 GT3 RS" type="text" />
                </div>

                <div>
                  <label htmlFor="category" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</label>
                  <select id="category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all appearance-none">
                    <option value="Sedan">Luxury Sedan</option>
                    <option value="SUV">Sport Utility Vehicle</option>
                    <option value="Coupe">Grand Tourer / Coupe</option>
                    <option value="Performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Price ($)</label>
                  <input id="price" required min="0" value={formPrice} onChange={(e) => setFormPrice(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" type="number" />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                  <input id="quantity" required min="0" value={formQuantity} onChange={(e) => setFormQuantity(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all" type="number" />
                </div>
              </form>
            </div>

            <div className="p-8 bg-slate-950 border-t border-slate-800 flex gap-4">
              <button onClick={resetForm} type="button" className="flex-1 py-3 rounded-lg border border-slate-700 text-slate-300 font-semibold text-sm tracking-wide uppercase hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">
                Cancel
              </button>
              <button form="vehicle-form" type="submit" className="flex-1 py-3 rounded-lg bg-rose-600 text-white font-semibold text-sm tracking-wide uppercase hover:bg-rose-500 transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                {editingId ? 'Update' : 'Execute'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
