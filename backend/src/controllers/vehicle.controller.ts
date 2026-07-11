import { Request, Response, NextFunction } from 'express';
import { VehicleService } from '../services/vehicle.service';
import {
  createVehicleSchema,
  updateVehicleSchema,
  restockVehicleSchema,
  vehicleSearchSchema,
} from '../dto/vehicle.dto';
import { ZodError } from 'zod';

export const createVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createVehicleSchema.parse(req.body);
    const vehicle = await VehicleService.createVehicle(validatedData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      next(error);
    }
  }
};

export const getVehicles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchParams = vehicleSearchSchema.parse(req.query);
    const vehicles = await VehicleService.getVehicles(searchParams);
    res.status(200).json(vehicles);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      next(error);
    }
  }
};

export const getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await VehicleService.getVehicleById(req.params.id);
    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateVehicleSchema.parse(req.body);
    const updatedVehicle = await VehicleService.updateVehicle(req.params.id, validatedData);
    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      next(error);
    }
  }
};

export const deleteVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await VehicleService.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const purchaseVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedVehicle = await VehicleService.purchaseVehicle(req.params.id);
    res.status(200).json(updatedVehicle);
  } catch (error) {
    next(error);
  }
};

export const restockVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = restockVehicleSchema.parse(req.body);
    const updatedVehicle = await VehicleService.restockVehicle(req.params.id, validatedData);
    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      next(error);
    }
  }
};
