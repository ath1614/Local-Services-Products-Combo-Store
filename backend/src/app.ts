import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

import authRoutes from './routes/auth.routes';

app.get('/health', (_req, res) => {
  res.json({ status: 'LocalLink API is running' });
});

app.use('/api/auth', authRoutes);

export default app;
