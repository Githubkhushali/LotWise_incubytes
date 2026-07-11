import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
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
    const vehicle = await prisma.vehicle.create({
      data: validatedData,
    });
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
    
    // Construct Prisma where clause
    const where: any = {};
    if (searchParams.make) {
      where.make = { contains: searchParams.make, mode: 'insensitive' };
    }
    if (searchParams.model) {
      where.model = { contains: searchParams.model, mode: 'insensitive' };
    }
    if (searchParams.category) {
      where.category = { contains: searchParams.category, mode: 'insensitive' };
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
    });
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
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateVehicleSchema.parse(req.body);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: validatedData,
    });

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
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const purchaseVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (vehicle.quantity <= 0) {
      return res.status(400).json({ message: 'Vehicle is out of stock' });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: { quantity: vehicle.quantity - 1 },
    });

    res.status(200).json(updatedVehicle);
  } catch (error) {
    next(error);
  }
};

export const restockVehicle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = restockVehicleSchema.parse(req.body);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: { quantity: vehicle.quantity + validatedData.quantity },
    });

    res.status(200).json(updatedVehicle);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.issues });
    } else {
      next(error);
    }
  }
};
