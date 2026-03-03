import { Response } from 'express';
import { ProductService } from '../services/product.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const svc = new ProductService();

export const getAllProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await svc.getAll(req.query.category as string);
    res.json(data);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const getProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await svc.getById(req.params.id);
    res.json(data);
  } catch (err: any) { res.status(404).json({ message: err.message }); }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await svc.create(req.user!.id, req.body);
    res.status(201).json(data);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await svc.update(req.user!.id, req.params.id, req.body);
    res.json(data);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await svc.delete(req.user!.id, req.params.id);
    res.json({ message: 'Product removed' });
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const getMyProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = await svc.getMyProducts(req.user!.id);
    res.json(data);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};
