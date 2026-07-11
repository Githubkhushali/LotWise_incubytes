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
  priceMin?: number;
  priceMax?: number;
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

  createVehicle: async (data: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id: string, data: Partial<Omit<Vehicle, 'id'>>): Promise<Vehicle> => {
    const response = await apiClient.put<Vehicle>(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  restockVehicle: async (id: string, data: { quantity: number }): Promise<Vehicle> => {
    const response = await apiClient.post<Vehicle>(`/vehicles/${id}/restock`, data);
    return response.data;
  },
};
