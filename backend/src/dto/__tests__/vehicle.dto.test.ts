import {
  createVehicleSchema,
  updateVehicleSchema,
  restockVehicleSchema,
  vehicleSearchSchema,
} from '../vehicle.dto';

describe('Vehicle DTOs', () => {
  describe('createVehicleSchema', () => {
    it('validates a valid payload', () => {
      const payload = {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 25000,
        quantity: 10,
      };
      const result = createVehicleSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects missing fields', () => {
      const payload = {
        make: 'Toyota',
        price: 25000,
      };
      const result = createVehicleSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects negative price', () => {
      const payload = {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: -1000,
        quantity: 10,
      };
      const result = createVehicleSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects negative quantity', () => {
      const payload = {
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 25000,
        quantity: -5,
      };
      const result = createVehicleSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('updateVehicleSchema', () => {
    it('validates partial updates', () => {
      const payload = { price: 26000 };
      const result = updateVehicleSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects invalid fields in partial update', () => {
      const payload = { quantity: -10 };
      const result = updateVehicleSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('restockVehicleSchema', () => {
    it('validates valid quantity', () => {
      const payload = { quantity: 5 };
      const result = restockVehicleSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects zero or negative quantity', () => {
      expect(restockVehicleSchema.safeParse({ quantity: 0 }).success).toBe(false);
      expect(restockVehicleSchema.safeParse({ quantity: -5 }).success).toBe(false);
    });

    it('rejects missing quantity', () => {
      expect(restockVehicleSchema.safeParse({}).success).toBe(false);
    });
  });

  describe('vehicleSearchSchema', () => {
    it('validates valid search params (make + category)', () => {
      const payload = { make: 'Toyota', category: 'Sedan' };
      const result = vehicleSearchSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('validates empty search params', () => {
      const payload = {};
      const result = vehicleSearchSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('coerces priceMin from string (as query params arrive)', () => {
      const result = vehicleSearchSchema.safeParse({ priceMin: '25000' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priceMin).toBe(25000);
      }
    });

    it('coerces priceMax from string', () => {
      const result = vehicleSearchSchema.safeParse({ priceMax: '75000' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priceMax).toBe(75000);
      }
    });

    it('rejects negative priceMin', () => {
      const result = vehicleSearchSchema.safeParse({ priceMin: '-100' });
      expect(result.success).toBe(false);
    });

    it('rejects negative priceMax', () => {
      const result = vehicleSearchSchema.safeParse({ priceMax: '-1' });
      expect(result.success).toBe(false);
    });

    it('rejects non-numeric priceMin', () => {
      const result = vehicleSearchSchema.safeParse({ priceMin: 'notanumber' });
      expect(result.success).toBe(false);
    });

    it('validates combined make + priceMin + priceMax', () => {
      const result = vehicleSearchSchema.safeParse({
        make: 'BMW',
        priceMin: '50000',
        priceMax: '100000',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.make).toBe('BMW');
        expect(result.data.priceMin).toBe(50000);
        expect(result.data.priceMax).toBe(100000);
      }
    });
  });
});
