import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await authService.register(req.body);
    res.status(201).json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};
