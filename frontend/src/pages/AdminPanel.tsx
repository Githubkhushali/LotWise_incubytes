import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vehicleApi, Vehicle } from '../api/vehicles';
import { useNavigate, Link } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);
      const data = await vehicleApi.getVehicles();
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles');
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
      await vehicleApi.restockVehicle(id, { quantity: 5 }); // Fixed amount for simplicity
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

  // Generate a placeholder image based on category
  const getPlaceholderImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'suv':
        return 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800';
      case 'sedan':
        return 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800';
      case 'performance':
      case 'coupe':
        return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800';
      default:
        return 'https://images.unsplash.com/photo-1502877338535-34cb0c55d974?auto=format&fit=crop&q=80&w=800';
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 w-full px-container-margin flex items-center justify-between">
          <div className="flex items-center gap-stack-md">
            <span className="material-symbols-outlined text-[32px] text-primary" style={{ fontVariationSettings: "'FILL' 1, 'wght' 200" }}>view_in_ar</span>
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight">Lotwise</span>
            <div className="ml-stack-md px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono text-label-mono uppercase tracking-widest">Admin</div>
          </div>
          <nav className="hidden md:flex items-center gap-stack-lg">
            <Link to="/" className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Inventory</Link>
            <Link to="/admin" className="transition-colors text-primary font-semibold" aria-current="page">Admin Panel</Link>
          </nav>
          <div className="flex items-center gap-stack-md">
            <button onClick={logout} className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors">Log out</button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-24 bg-surface min-h-screen px-container-margin py-stack-lg pb-32">
        <div className="flex flex-col w-full gap-stack-lg max-w-7xl mx-auto">
          
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-stack-sm mb-unit">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-[0.2em]">System Live</span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">Inventory Control</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                High-performance fleet management. Monitor, adjust, and optimize vehicle availability across all regional hubs.
              </p>
            </div>
            <div className="flex items-center gap-stack-md">
              <div className="hidden lg:flex flex-col items-end mr-stack-md border-r border-outline-variant pr-stack-md">
                <span className="font-label-mono text-label-mono text-on-surface-variant">TOTAL VALUE</span>
                <span className="font-headline-md text-headline-md text-primary">${totalValue.toLocaleString()}</span>
              </div>
              <button onClick={() => { resetForm(); setShowForm(true); }} className="group relative flex items-center gap-stack-sm bg-primary text-on-primary px-stack-lg py-3 rounded-full transition-all hover:pr-10 overflow-hidden">
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                <span className="font-headline-md text-body-lg font-bold">Add Vehicle</span>
                <span className="material-symbols-outlined absolute right-4 opacity-0 group-hover:opacity-100 transition-all text-[20px]">arrow_forward</span>
              </button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            <div className="md:col-span-3 bg-surface-container-low p-stack-md flex flex-wrap items-center gap-stack-md rounded-lg">
              <div className="flex-1 min-w-[240px] relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                <input type="text" className="w-full bg-surface-container h-11 pl-10 pr-4 text-body-md text-on-surface focus:outline-none focus:ring-1 ring-primary transition-all rounded-lg" placeholder="Search..." />
              </div>
            </div>
            <div className="bg-surface-variant p-stack-md flex flex-col justify-center rounded-lg">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Active Listings</span>
              <div className="flex items-baseline gap-stack-sm">
                <span className="font-headline-lg text-headline-lg text-on-surface">{vehicles.length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-12 space-y-gutter">
              <div className="hidden md:grid grid-cols-12 gap-gutter px-stack-md py-2 border-b border-outline-variant">
                <div className="col-span-5 font-label-mono text-label-mono text-on-surface-variant uppercase">Vehicle Details</div>
                <div className="col-span-2 font-label-mono text-label-mono text-on-surface-variant uppercase">Status</div>
                <div className="col-span-2 font-label-mono text-label-mono text-on-surface-variant uppercase">Pricing</div>
                <div className="col-span-3 font-label-mono text-label-mono text-on-surface-variant uppercase text-right">Admin Actions</div>
              </div>

              {loading ? (
                <div className="flex justify-center p-10"><span className="animate-spin text-primary material-symbols-outlined">sync</span></div>
              ) : (
                vehicles.map(v => (
                  <div key={v.id} className="group relative bg-surface-container hover:bg-surface-container-high transition-all duration-300 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter p-stack-md items-center">
                      <div className="col-span-5 flex items-center gap-stack-md">
                        <div className="w-24 h-16 bg-surface-variant overflow-hidden rounded">
                          <img src={getPlaceholderImage(v.category)} alt={`${v.make} ${v.model}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-headline-md text-headline-md text-on-surface">{v.make} {v.model}</span>
                          <span className="font-label-mono text-label-mono text-on-surface-variant">{v.category.toUpperCase()}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        {v.quantity > 0 ? (
                          <span className="inline-flex items-center gap-unit px-2 py-0.5 rounded bg-primary/10 text-primary font-label-mono text-label-mono uppercase">Available ({v.quantity})</span>
                        ) : (
                          <span className="inline-flex items-center gap-unit px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-mono text-label-mono uppercase">Out of Stock</span>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex flex-col">
                          <span className="font-headline-md text-headline-md text-on-surface">${v.price.toLocaleString()}</span>
                          <span className="font-label-mono text-label-mono text-on-surface-variant">MSRP</span>
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex justify-end items-center gap-stack-sm">
                        <button onClick={() => handleRestock(v.id)} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant hover:text-on-surface" title="Restock (+5)">
                          <span className="material-symbols-outlined text-[20px]">package_2</span>
                        </button>
                        <button onClick={() => startEdit(v)} className="p-2 hover:bg-surface-variant rounded-full transition-colors text-on-surface-variant hover:text-on-surface" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => setDeleteConfirmId(v.id)} className="p-2 hover:bg-error/10 rounded-full transition-colors text-on-surface-variant hover:text-error" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    {deleteConfirmId === v.id && (
                      <div className="absolute inset-0 bg-surface-container-highest/95 backdrop-blur-sm flex items-center justify-between px-stack-lg z-10 animate-in fade-in slide-in-from-right-4 duration-300 rounded-lg">
                        <div className="flex items-center gap-stack-md">
                          <span className="material-symbols-outlined text-error">warning</span>
                          <p className="font-body-md text-on-surface">Permanently remove <span className="font-bold">{v.make} {v.model}</span> from inventory?</p>
                        </div>
                        <div className="flex items-center gap-stack-md">
                          <button onClick={() => setDeleteConfirmId(null)} className="font-label-mono text-label-mono uppercase text-on-surface-variant hover:text-on-surface">Cancel</button>
                          <button onClick={() => handleDelete(v.id)} className="bg-error text-on-error px-4 py-2 font-label-mono text-label-mono uppercase font-bold hover:brightness-110 rounded">Confirm Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over Form Panel */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          <div className="absolute inset-0 bg-surface-container-lowest/60 backdrop-blur-sm transition-opacity" onClick={resetForm}></div>
          <div className="relative w-full max-w-xl bg-surface-container-low shadow-xl flex flex-col transform transition-transform duration-500 ease-in-out translate-x-0">
            <div className="relative h-48 w-full overflow-hidden shrink-0">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDW3QiovDGicNfVpyvZiod4gGkQIItVCaBE4NPh5AmTyzuB2Iva2mET2GRT-swyGP4ut4Y7-mm6T_lQq2hOtzV7CJW0KnUuRbeYDohdHHNKCXxs-DrbFaYMHhP0q7eGmlvq5ZuQCHdFN1FiSNzCruwc_0zDgPDhBO3lyQe0Hx4RrfOqfnz-bL038BDkxNWpdR660up8nmCork325Z5aPFymyUJ9uAxL_AKpYd5sDqy-ZM08hM4KFne4RA')" }}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/20 to-transparent"></div>
              <button onClick={resetForm} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-surface/40 backdrop-blur-md text-on-surface hover:bg-surface/80 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="absolute bottom-6 left-8">
                <span className="font-label-mono text-label-mono text-primary uppercase tracking-[0.2em] mb-2 block">Inventory Management</span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-stack-lg custom-scrollbar">
              <form id="vehicle-form" onSubmit={handleSave} className="grid grid-cols-2 gap-x-gutter gap-y-stack-lg">
                <div className="col-span-1 flex flex-col gap-unit">
                  <label htmlFor="make" className="font-label-mono text-label-mono text-on-surface-variant uppercase ml-1">Make</label>
                  <div className="relative group">
                    <input id="make" required value={formMake} onChange={(e) => setFormMake(e.target.value)} className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant/30" placeholder="e.g. Porsche" type="text" />
                  </div>
                </div>

                <div className="col-span-1 flex flex-col gap-unit">
                  <label htmlFor="model" className="font-label-mono text-label-mono text-on-surface-variant uppercase ml-1">Model</label>
                  <div className="relative group">
                    <input id="model" required value={formModel} onChange={(e) => setFormModel(e.target.value)} className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-on-surface-variant/30" placeholder="e.g. Taycan Turbo S" type="text" />
                  </div>
                </div>

                <div className="col-span-2 flex flex-col gap-unit">
                  <label htmlFor="category" className="font-label-mono text-label-mono text-on-surface-variant uppercase ml-1">Category</label>
                  <div className="relative">
                    <select id="category" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="w-full appearance-none bg-surface-container-highest border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                      <option value="Sedan">Luxury Sedan</option>
                      <option value="SUV">Sport Utility Vehicle</option>
                      <option value="Coupe">Grand Tourer / Coupe</option>
                      <option value="Performance">Performance</option>
                      <option value="Electric">Full Electric</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                  </div>
                </div>

                <div className="col-span-1 flex flex-col gap-unit">
                  <label htmlFor="price" className="font-label-mono text-label-mono text-on-surface-variant uppercase ml-1">Price</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                    <input id="price" required min="0" value={formPrice} onChange={(e) => setFormPrice(Number(e.target.value))} className="w-full bg-surface-container-highest border-none rounded-lg pl-8 pr-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/20 outline-none transition-all" type="number" />
                  </div>
                </div>

                <div className="col-span-1 flex flex-col gap-unit">
                  <label htmlFor="quantity" className="font-label-mono text-label-mono text-on-surface-variant uppercase ml-1">Quantity</label>
                  <div className="flex items-center bg-surface-container-highest rounded-lg overflow-hidden ring-1 ring-transparent focus-within:ring-primary/20">
                    <input id="quantity" required min="0" value={formQuantity} onChange={(e) => setFormQuantity(Number(e.target.value))} className="flex-1 bg-transparent border-none text-center font-headline-md text-headline-md text-on-surface focus:ring-0 outline-none p-3" type="number" />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-8 bg-surface-container border-t border-outline-variant/20 flex flex-col gap-stack-md mt-auto">
              <div className="flex items-center gap-stack-md">
                <button form="vehicle-form" type="submit" className="flex-1 h-12 bg-primary text-on-primary font-headline-md text-body-md rounded-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <span>{editingId ? 'Update Vehicle' : 'Add'}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button onClick={resetForm} type="button" className="flex-1 h-12 bg-surface-variant text-on-surface-variant font-headline-md text-body-md rounded-lg hover:bg-secondary-container transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
