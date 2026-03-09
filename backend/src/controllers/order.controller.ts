import { Response } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { OrderStatus } from '../models/Order';

const svc = new OrderService();

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, deliveryAddress } = req.body;
    const order = await svc.createOrder(req.user!.id, items, deliveryAddress);
    res.status(201).json(order);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.getMyOrders(req.user!.id));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const getOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.getOrderById(req.user!.id, req.params.id));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await svc.updateStatus(req.params.id, req.body.status as OrderStatus);
    res.json(order);
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};

export const cancelOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json(await svc.cancelOrder(req.user!.id, req.params.id));
  } catch (err: any) { res.status(400).json({ message: err.message }); }
};
