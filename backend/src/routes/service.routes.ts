import { Router } from 'express';
import { getAllServices, getService, createService, updateService, deleteService, getMyServices } from '../controllers/service.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.get('/', getAllServices);
router.get('/mine', protect, restrictTo(UserRole.SERVICE_PROVIDER), getMyServices);
router.get('/:id', getService);
router.post('/', protect, restrictTo(UserRole.SERVICE_PROVIDER), createService);
router.put('/:id', protect, restrictTo(UserRole.SERVICE_PROVIDER), updateService);
router.delete('/:id', protect, restrictTo(UserRole.SERVICE_PROVIDER), deleteService);

export default router;
