import { Response } from 'express';
import { ServiceService } from '../services/service.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const svc = new ServiceService();

export const getAllServices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.getAll(req.query.category as string));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const getService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.getById(req.params.id));
  } catch (err: any) { res.status(404).json({ message: err.message }); }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(201).json(await svc.create(req.user!.id, req.body));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.update(req.user!.id, req.params.id, req.body));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await svc.delete(req.user!.id, req.params.id);
    res.json({ message: 'Service removed' });
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const getMyServices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.getMyServices(req.user!.id));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};
