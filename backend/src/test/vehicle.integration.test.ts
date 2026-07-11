import request from 'supertest';
import app from '../app';
import { testPrisma, truncateTables } from './helpers';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const SECRET = process.env.JWT_SECRET || 'test-secret';

function generateToken(userId: string, role: Role): string {
  return jwt.sign({ id: userId, role }, SECRET, { expiresIn: '1h' });
}

describe('Vehicle API Integration', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    // Generate valid tokens for testing authentication / authorization
    userToken = generateToken('user-1', Role.user);
    adminToken = generateToken('admin-1', Role.admin);
  });

  beforeEach(async () => {
    await truncateTables();
  });

  describe('POST /api/vehicles', () => {
    const validVehicle = {
      make: 'Toyota',
      model: 'Corolla',
      category: 'Sedan',
      price: 25000,
      quantity: 10,
    };

    it('creates a vehicle when admin (201)', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validVehicle);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(validVehicle);
      expect(response.body.id).toBeDefined();

      const dbVehicle = await testPrisma.vehicle.findUnique({
        where: { id: response.body.id },
      });
      expect(dbVehicle).toBeDefined();
    });

    it('rejects creation for regular user (403)', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validVehicle);

      expect(response.status).toBe(403);
    });

    it('rejects creation without auth (401)', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .send(validVehicle);

      expect(response.status).toBe(401);
    });

    it('returns 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...validVehicle, price: -500 }); // invalid price

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/vehicles', () => {
    beforeEach(async () => {
      await testPrisma.vehicle.createMany({
        data: [
          { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 5 },
          { make: 'Honda', model: 'Civic', category: 'Sedan', price: 26000, quantity: 3 },
          { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 35000, quantity: 2 },
        ],
      });
    });

    it('lists all vehicles', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
    });

    it('filters vehicles by make', async () => {
      const response = await request(app)
        .get('/api/vehicles?make=Toyota')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every((v: any) => v.make === 'Toyota')).toBe(true);
    });

    it('filters vehicles by multiple parameters', async () => {
      const response = await request(app)
        .get('/api/vehicles?make=Toyota&category=SUV')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].model).toBe('RAV4');
    });

    it('returns empty array if no match', async () => {
      const response = await request(app)
        .get('/api/vehicles?make=Ford')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it('requires authentication (401)', async () => {
      const response = await request(app).get('/api/vehicles');
      expect(response.status).toBe(401);
    });

    it('filters vehicles by model', async () => {
      const response = await request(app)
        .get('/api/vehicles?model=Civic')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].model).toBe('Civic');
    });
  });

  describe('GET /api/vehicles/search (dedicated search endpoint)', () => {
    beforeEach(async () => {
      await testPrisma.vehicle.createMany({
        data: [
          { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 5 },
          { make: 'Honda', model: 'Civic', category: 'Sedan', price: 26000, quantity: 3 },
          { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 35000, quantity: 2 },
          { make: 'BMW', model: 'M3', category: 'Coupe', price: 75000, quantity: 1 },
        ],
      });
    });

    it('filters vehicles by priceMin', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?priceMin=30000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every((v: any) => v.price >= 30000)).toBe(true);
    });

    it('filters vehicles by priceMax', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?priceMax=26000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body.every((v: any) => v.price <= 26000)).toBe(true);
    });

    it('filters vehicles by priceMin and priceMax (range)', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?priceMin=25000&priceMax=35000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body.every((v: any) => v.price >= 25000 && v.price <= 35000)).toBe(true);
    });

    it('combines price range with make filter', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?make=Toyota&priceMax=30000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].model).toBe('Corolla');
    });

    it('filters by make on /search endpoint', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?make=BMW')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].make).toBe('BMW');
    });

    it('returns 400 if priceMin is not a number', async () => {
      const response = await request(app)
        .get('/api/vehicles/search?priceMin=notanumber')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
    });

    it('requires authentication (401)', async () => {
      const response = await request(app).get('/api/vehicles/search');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/vehicles/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await testPrisma.vehicle.create({
        data: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 5 },
      });
      vehicleId = vehicle.id;
    });

    it('returns specific vehicle (200)', async () => {
      const response = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.make).toBe('Toyota');
    });

    it('returns 404 for unknown ID', async () => {
      const response = await request(app)
        .get('/api/vehicles/unknown-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await testPrisma.vehicle.create({
        data: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 5 },
      });
      vehicleId = vehicle.id;
    });

    it('updates vehicle as admin (200)', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 26000 });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(26000);

      const dbVehicle = await testPrisma.vehicle.findUnique({ where: { id: vehicleId } });
      expect(dbVehicle?.price).toBe(26000);
    });

    it('rejects update as regular user (403)', async () => {
      const response = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 26000 });

      expect(response.status).toBe(403);
    });

    it('returns 404 for unknown ID', async () => {
      const response = await request(app)
        .put('/api/vehicles/unknown-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 26000 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await testPrisma.vehicle.create({
        data: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 5 },
      });
      vehicleId = vehicle.id;
    });

    it('deletes vehicle as admin (204)', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);

      const dbVehicle = await testPrisma.vehicle.findUnique({ where: { id: vehicleId } });
      expect(dbVehicle).toBeNull();
    });

    it('rejects deletion as regular user (403)', async () => {
      const response = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    let inStockId: string;
    let outOfStockId: string;

    beforeEach(async () => {
      const inStock = await testPrisma.vehicle.create({
        data: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 1 },
      });
      inStockId = inStock.id;

      const outOfStock = await testPrisma.vehicle.create({
        data: { make: 'Honda', model: 'Civic', category: 'Sedan', price: 26000, quantity: 0 },
      });
      outOfStockId = outOfStock.id;
    });

    it('decrements quantity when purchasing in-stock vehicle (200)', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${inStockId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(0);

      const dbVehicle = await testPrisma.vehicle.findUnique({ where: { id: inStockId } });
      expect(dbVehicle?.quantity).toBe(0);
    });

    it('returns 400 when out of stock', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${outOfStockId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/out of stock/i);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    let vehicleId: string;

    beforeEach(async () => {
      const vehicle = await testPrisma.vehicle.create({
        data: { make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000, quantity: 1 },
      });
      vehicleId = vehicle.id;
    });

    it('increments quantity as admin (200)', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(6);

      const dbVehicle = await testPrisma.vehicle.findUnique({ where: { id: vehicleId } });
      expect(dbVehicle?.quantity).toBe(6);
    });

    it('rejects invalid restock amount (400)', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -5 });

      expect(response.status).toBe(400);
    });

    it('rejects restock as regular user (403)', async () => {
      const response = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(403);
    });
  });
});
