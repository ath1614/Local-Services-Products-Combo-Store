import { Router } from 'express';
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, cancelOrder } from '../controllers/order.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.use(protect);

router.post('/', restrictTo(UserRole.CUSTOMER), createOrder);
router.get('/', restrictTo(UserRole.CUSTOMER), getMyOrders);
router.get('/:id', restrictTo(UserRole.CUSTOMER), getOrderById);
router.patch('/:id/cancel', restrictTo(UserRole.CUSTOMER), cancelOrder);
router.patch('/:id/status', restrictTo(UserRole.VENDOR, UserRole.SERVICE_PROVIDER, UserRole.ADMIN), updateOrderStatus);

export default router;
