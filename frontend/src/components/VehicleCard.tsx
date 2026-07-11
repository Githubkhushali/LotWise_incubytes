import React, { useState } from 'react';
import { Vehicle } from '../api/vehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => Promise<void>;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPurchase }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const isOutOfStock = vehicle.quantity <= 0;

  const handlePurchase = async () => {
    if (isOutOfStock) return;
    setIsPurchasing(true);
    try {
      await onPurchase(vehicle.id);
    } finally {
      setIsPurchasing(false);
    }
  };

  // Generate a placeholder image based on category for visual consistency
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
    <div className={`group relative flex flex-col rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ${isOutOfStock ? 'bg-surface-container/50 grayscale-[0.8] opacity-80' : 'bg-surface-container'}`}>
      <div className="relative h-72 overflow-hidden">
        <img
          src={getPlaceholderImage(vehicle.category)}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-surface/80 backdrop-blur-md text-on-surface px-3 py-1 rounded-full font-label-mono text-label-mono uppercase tracking-widest">
            {vehicle.category}
          </span>
        </div>
        
        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface-container/40 flex items-center justify-center backdrop-blur-[2px] z-10">
            <span className="px-6 py-2 bg-error-container text-on-error-container font-label-mono text-headline-md uppercase tracking-widest -rotate-12 border-2 border-error">
              Sold Out
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-surface-container to-transparent"></div>
      </div>
      
      <div className="p-stack-lg flex flex-col gap-stack-md flex-grow z-20 relative">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="font-headline-lg text-headline-lg group-hover:text-primary transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">
              {vehicle.category}
            </p>
          </div>
          <div className="text-right">
            <p className={`font-headline-md text-headline-md ${isOutOfStock ? 'text-on-surface-variant' : 'text-primary'}`}>
              ${vehicle.price.toLocaleString()}
            </p>
            <p className="font-label-mono text-[10px] text-on-surface-variant uppercase">
              MSRP EXCL. TAX
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-stack-md pt-stack-md border-t border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-label-mono text-[10px] text-on-surface-variant uppercase">Stock Status</span>
            <span className={`text-body-md font-semibold ${isOutOfStock ? 'text-error' : 'text-on-surface'}`}>
              {vehicle.quantity} Units{vehicle.quantity > 0 && vehicle.quantity <= 3 ? ' Left' : ''}
            </span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={isOutOfStock || isPurchasing}
          className={`mt-auto w-full py-4 font-headline-md rounded-lg transition-all ${
            isOutOfStock
              ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
              : 'bg-primary text-on-primary hover:brightness-110 active:scale-[0.98]'
          } ${isPurchasing ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isOutOfStock ? 'Out of Stock' : isPurchasing ? 'Processing...' : 'Purchase Vehicle'}
        </button>
      </div>
    </div>
  );
};
