import { prisma } from '../lib/prisma';
import { NotFoundError, ValidationError } from '../exceptions/AppError';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  RestockVehicleDto,
  VehicleSearchDto,
} from '../dto/vehicle.dto';

export class VehicleService {
  static async createVehicle(dto: CreateVehicleDto) {
    return await prisma.vehicle.create({
      data: dto,
    });
  }

  static async getVehicles(searchParams: VehicleSearchDto) {
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
    if (searchParams.priceMin !== undefined || searchParams.priceMax !== undefined) {
      where.price = {};
      if (searchParams.priceMin !== undefined) {
        where.price.gte = searchParams.priceMin;
      }
      if (searchParams.priceMax !== undefined) {
        where.price.lte = searchParams.priceMax;
      }
    }

    return await prisma.vehicle.findMany({
      where,
    });
  }

  static async getVehicleById(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    return vehicle;
  }

  static async updateVehicle(id: string, dto: UpdateVehicleDto) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    return await prisma.vehicle.update({
      where: { id },
      data: dto,
    });
  }

  static async deleteVehicle(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    await prisma.vehicle.delete({
      where: { id },
    });
  }

  static async purchaseVehicle(id: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    if (vehicle.quantity <= 0) {
      // In Express controllers we used to return 400 with 'Vehicle is out of stock'.
      // ValidationError is for 400 Bad Request, so we'll map this there, or a new Error.
      // Since it's business logic, ValidationError is fine.
      throw new ValidationError('Vehicle is out of stock');
    }

    return await prisma.vehicle.update({
      where: { id },
      data: { quantity: vehicle.quantity - 1 },
    });
  }

  static async restockVehicle(id: string, dto: RestockVehicleDto) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundError('Vehicle not found');
    }

    return await prisma.vehicle.update({
      where: { id },
      data: { quantity: vehicle.quantity + dto.quantity },
    });
  }
}
