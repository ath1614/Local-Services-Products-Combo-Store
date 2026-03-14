import { Router, Response } from 'express';
import { protect, restrictTo, AuthRequest } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Service } from '../models/Service';

const router = Router();
router.use(protect, restrictTo(UserRole.ADMIN));

router.get('/stats', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [users, orders, products, services] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Service.countDocuments({ isActive: true }),
    ]);
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    res.json({ users, orders, products, services, revenue: revenue[0]?.total || 0 });
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.get('/users', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await User.find().select('-password').sort({ createdAt: -1 }));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.delete('/users/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

export default router;
