import { Router } from 'express';
import { Response } from 'express';
import { protect, restrictTo, AuthRequest } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';
import { Vendor } from '../models/Vendor';
import { ServiceProvider } from '../models/ServiceProvider';

const router = Router();

// Vendor profile
router.post('/vendor', protect, restrictTo(UserRole.VENDOR), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exists = await Vendor.findOne({ userId: req.user!.id });
    if (exists) { res.status(400).json({ message: 'Vendor profile already exists' }); return; }
    const vendor = await Vendor.create({ userId: req.user!.id, ...req.body });
    res.status(201).json(vendor);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.get('/vendor/me', protect, restrictTo(UserRole.VENDOR), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user!.id });
    res.json(vendor);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

// Service Provider profile
router.post('/provider', protect, restrictTo(UserRole.SERVICE_PROVIDER), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exists = await ServiceProvider.findOne({ userId: req.user!.id });
    if (exists) { res.status(400).json({ message: 'Provider profile already exists' }); return; }
    const provider = await ServiceProvider.create({ userId: req.user!.id, ...req.body });
    res.status(201).json(provider);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

router.get('/provider/me', protect, restrictTo(UserRole.SERVICE_PROVIDER), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await ServiceProvider.findOne({ userId: req.user!.id });
    res.json(provider);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
});

export default router;
