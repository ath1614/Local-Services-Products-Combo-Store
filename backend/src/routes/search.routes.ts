import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';
import { Service } from '../models/Service';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, category, type } = req.query as { q?: string; category?: string; type?: string };

    const textFilter = q ? { $text: { $search: q } } : {};
    const catFilter = category ? { category } : {};
    const baseFilter = { isActive: true, ...catFilter };

    const [products, services] = await Promise.all([
      type === 'service' ? [] : Product.find({ ...baseFilter, ...textFilter }).populate('vendorId', 'shopName').limit(20),
      type === 'product' ? [] : Service.find({ ...baseFilter, ...textFilter }).populate('providerId', 'expertiseArea averageRating').limit(20),
    ]);

    res.json({ products, services });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
