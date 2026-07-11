import { z } from 'zod';

export const createVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  quantity: z.number().int().min(0, 'Quantity must be a non-negative integer'),
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema.partial();

export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;

export const restockVehicleSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export type RestockVehicleDto = z.infer<typeof restockVehicleSchema>;

export const vehicleSearchSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
});

export type VehicleSearchDto = z.infer<typeof vehicleSearchSchema>;
