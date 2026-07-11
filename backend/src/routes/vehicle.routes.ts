import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicle.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Public / User authenticated routes
router.get('/', authenticate, getVehicles);
router.get('/search', authenticate, getVehicles);
router.get('/:id', authenticate, getVehicleById);

// Purchase route
router.post('/:id/purchase', authenticate, purchaseVehicle);

// Admin-only routes
router.post('/', authenticate, requireRole(Role.admin), createVehicle);
router.put('/:id', authenticate, requireRole(Role.admin), updateVehicle);
router.delete('/:id', authenticate, requireRole(Role.admin), deleteVehicle);
router.post('/:id/restock', authenticate, requireRole(Role.admin), restockVehicle);

export default router;
