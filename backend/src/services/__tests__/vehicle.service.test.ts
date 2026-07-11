/**
 * TESTS: VehicleService — unit tests with Prisma mocked
 *
 * All DB I/O is replaced by jest.fn() mocks so these tests run in-memory,
 * covering business logic branches (price filter, purchase out-of-stock,
 * restock quantity increment, not-found guards) without needing a real DB.
 */
import { VehicleService } from '../../services/vehicle.service';
import { prisma } from '../../lib/prisma';
import { NotFoundError, ValidationError } from '../../exceptions/AppError';

jest.mock('../../lib/prisma', () => ({
  prisma: {
    vehicle: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const mockVehicle = prisma.vehicle as jest.Mocked<typeof prisma.vehicle>;

const baseVehicle = {
  id: 'v-1',
  make: 'Toyota',
  model: 'Corolla',
  category: 'Sedan',
  price: 25000,
  quantity: 5,
};

describe('VehicleService.getVehicles()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls findMany with no where clause when no params given', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({});
    expect(mockVehicle.findMany).toHaveBeenCalledWith({ where: {} });
  });

  it('adds make contains clause when make is provided', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ make: 'Toyota' });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.make).toEqual({ contains: 'Toyota', mode: 'insensitive' });
  });

  it('adds model contains clause when model is provided', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ model: 'Civic' });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.model).toEqual({ contains: 'Civic', mode: 'insensitive' });
  });

  it('adds category contains clause when category is provided', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ category: 'SUV' });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.category).toEqual({ contains: 'SUV', mode: 'insensitive' });
  });

  it('adds price.gte when only priceMin is provided', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ priceMin: 30000 });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.price).toEqual({ gte: 30000 });
  });

  it('adds price.lte when only priceMax is provided', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ priceMax: 50000 });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.price).toEqual({ lte: 50000 });
  });

  it('adds both price.gte and price.lte when both bounds are provided', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ priceMin: 25000, priceMax: 75000 });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.price).toEqual({ gte: 25000, lte: 75000 });
  });

  it('combines make and price range in the where clause', async () => {
    mockVehicle.findMany.mockResolvedValue([]);
    await VehicleService.getVehicles({ make: 'BMW', priceMin: 50000, priceMax: 100000 });
    const { where } = (mockVehicle.findMany as jest.Mock).mock.calls[0][0];
    expect(where.make).toEqual({ contains: 'BMW', mode: 'insensitive' });
    expect(where.price).toEqual({ gte: 50000, lte: 100000 });
  });
});

describe('VehicleService.getVehicleById()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the vehicle when found', async () => {
    mockVehicle.findUnique.mockResolvedValue(baseVehicle as any);
    const result = await VehicleService.getVehicleById('v-1');
    expect(result).toEqual(baseVehicle);
  });

  it('throws NotFoundError when vehicle does not exist', async () => {
    mockVehicle.findUnique.mockResolvedValue(null);
    await expect(VehicleService.getVehicleById('does-not-exist')).rejects.toThrow(NotFoundError);
  });
});

describe('VehicleService.updateVehicle()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('updates and returns the updated vehicle', async () => {
    mockVehicle.findUnique.mockResolvedValue(baseVehicle as any);
    const updated = { ...baseVehicle, price: 27000 };
    mockVehicle.update.mockResolvedValue(updated as any);

    const result = await VehicleService.updateVehicle('v-1', { price: 27000 });
    expect(result.price).toBe(27000);
  });

  it('throws NotFoundError when vehicle does not exist', async () => {
    mockVehicle.findUnique.mockResolvedValue(null);
    await expect(VehicleService.updateVehicle('missing', { price: 1000 })).rejects.toThrow(NotFoundError);
  });
});

describe('VehicleService.deleteVehicle()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes the vehicle without returning a value', async () => {
    mockVehicle.findUnique.mockResolvedValue(baseVehicle as any);
    mockVehicle.delete.mockResolvedValue(baseVehicle as any);
    await expect(VehicleService.deleteVehicle('v-1')).resolves.toBeUndefined();
  });

  it('throws NotFoundError when vehicle does not exist', async () => {
    mockVehicle.findUnique.mockResolvedValue(null);
    await expect(VehicleService.deleteVehicle('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('VehicleService.purchaseVehicle()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('decrements quantity by 1 and returns updated vehicle', async () => {
    const inStock = { ...baseVehicle, quantity: 3 };
    mockVehicle.findUnique.mockResolvedValue(inStock as any);
    mockVehicle.update.mockResolvedValue({ ...inStock, quantity: 2 } as any);

    const result = await VehicleService.purchaseVehicle('v-1');
    expect(result.quantity).toBe(2);
    expect(mockVehicle.update).toHaveBeenCalledWith({
      where: { id: 'v-1' },
      data: { quantity: 2 },
    });
  });

  it('throws ValidationError when quantity is 0 (out of stock)', async () => {
    const outOfStock = { ...baseVehicle, quantity: 0 };
    mockVehicle.findUnique.mockResolvedValue(outOfStock as any);
    await expect(VehicleService.purchaseVehicle('v-1')).rejects.toThrow(ValidationError);
  });

  it('throws NotFoundError when vehicle does not exist', async () => {
    mockVehicle.findUnique.mockResolvedValue(null);
    await expect(VehicleService.purchaseVehicle('missing')).rejects.toThrow(NotFoundError);
  });
});

describe('VehicleService.restockVehicle()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('adds the given quantity to current stock', async () => {
    mockVehicle.findUnique.mockResolvedValue(baseVehicle as any);
    mockVehicle.update.mockResolvedValue({ ...baseVehicle, quantity: 10 } as any);

    const result = await VehicleService.restockVehicle('v-1', { quantity: 5 });
    expect(result.quantity).toBe(10);
    expect(mockVehicle.update).toHaveBeenCalledWith({
      where: { id: 'v-1' },
      data: { quantity: 10 },
    });
  });

  it('throws NotFoundError when vehicle does not exist', async () => {
    mockVehicle.findUnique.mockResolvedValue(null);
    await expect(VehicleService.restockVehicle('missing', { quantity: 5 })).rejects.toThrow(NotFoundError);
  });
});
