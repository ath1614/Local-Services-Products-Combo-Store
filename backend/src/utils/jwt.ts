import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as { id: string; role: string };
