import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { vehicleApi, Vehicle } from '../api/vehicles';
import { useNavigate } from 'react-router-dom';

export const AdminPanel: React.FC = () => {
  const { user, isAdmin } = useAuth();
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
  };

  const resetForm = () => {
    setEditingId(null);
    setFormMake('');
    setFormModel('');
    setFormCategory('Sedan');
    setFormPrice(0);
    setFormQuantity(0);
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-background min-h-screen text-on-surface p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center pb-4 border-b border-outline-variant/30">
          <h1 className="text-2xl font-bold">Admin Panel - Inventory Management</h1>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">
            Back to Dashboard
          </button>
        </header>

        {error && <p className="text-error">{error}</p>}

        <section className="bg-surface-container p-6 rounded-xl border border-outline-variant/30">
          <h2 className="text-xl mb-4 font-semibold">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
          <form onSubmit={handleSave} className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="make">Make</label>
              <input id="make" required value={formMake} onChange={e => setFormMake(e.target.value)} className="bg-surface-container-low p-2 rounded" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="model">Model</label>
              <input id="model" required value={formModel} onChange={e => setFormModel(e.target.value)} className="bg-surface-container-low p-2 rounded" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="category">Category</label>
              <select id="category" value={formCategory} onChange={e => setFormCategory(e.target.value)} className="bg-surface-container-low p-2 rounded">
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Performance">Performance</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="price">Price</label>
              <input id="price" type="number" required min="0" value={formPrice} onChange={e => setFormPrice(Number(e.target.value))} className="bg-surface-container-low p-2 rounded w-24" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="quantity">Quantity</label>
              <input id="quantity" type="number" required min="0" value={formQuantity} onChange={e => setFormQuantity(Number(e.target.value))} className="bg-surface-container-low p-2 rounded w-24" />
            </div>
            <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded h-10 hover:brightness-110">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-surface-variant text-on-surface px-4 py-2 rounded h-10">
                Cancel
              </button>
            )}
          </form>
        </section>

        <section>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map(v => (
                <div key={v.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{v.make} {v.model}</h3>
                  <div className="text-on-surface-variant text-sm flex justify-between">
                    <span>{v.category}</span>
                    <span>${v.price}</span>
                  </div>
                  <div className="text-sm">Stock: {v.quantity}</div>
                  
                  <div className="flex gap-2 mt-2 pt-2 border-t border-outline-variant/30">
                    <button onClick={() => startEdit(v)} className="flex-1 bg-surface-variant py-1 rounded text-sm hover:brightness-110">Edit</button>
                    <button onClick={() => handleRestock(v.id)} className="flex-1 bg-secondary-container py-1 rounded text-sm hover:brightness-110">Restock (+5)</button>
                    <button onClick={() => handleDelete(v.id)} className="flex-1 bg-error-container text-on-error-container py-1 rounded text-sm hover:brightness-110">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPanel;
