import { Router, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { protect, restrictTo, AuthRequest } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = Router();
const svc = new ReviewService();

router.post('/', protect, restrictTo(UserRole.CUSTOMER), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(201).json(await svc.create(req.user!.id, req.body));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.get('/product/:productId', async (req, res) => {
  try {
    res.json(await svc.getForProduct(req.params.productId));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.get('/service/:serviceId', async (req, res) => {
  try {
    res.json(await svc.getForService(req.params.serviceId));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

export default router;
