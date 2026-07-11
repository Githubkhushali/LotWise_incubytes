import { apiClient } from './client';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  category?: string;
}

export const vehicleApi = {
  getVehicles: async (): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  searchVehicles: async (params: VehicleSearchParams): Promise<Vehicle[]> => {
    const response = await apiClient.get<Vehicle[]>('/vehicles/search', { params });
    return response.data;
  },

  purchaseVehicle: async (id: string): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>(`/vehicles/${id}/purchase`);
    return response.data;
  },
};
