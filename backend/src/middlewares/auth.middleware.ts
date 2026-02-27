import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../models/User';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }
  try {
    req.user = verifyToken(header.split(' ')[1]);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const restrictTo = (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    next();
  };
