import { Router } from 'express';
import { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts } from '../controllers/product.controller';
import { protect, restrictTo } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.get('/', getAllProducts);
router.get('/mine', protect, restrictTo(UserRole.VENDOR), getMyProducts);
router.get('/:id', getProduct);
router.post('/', protect, restrictTo(UserRole.VENDOR), createProduct);
router.put('/:id', protect, restrictTo(UserRole.VENDOR), updateProduct);
router.delete('/:id', protect, restrictTo(UserRole.VENDOR), deleteProduct);

export default router;
