import express from 'express';
import { connectDB, disconnectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Testing - Ejercicio 02' });
});

app.use('/auth', authRoutes);

export { app, connectDB, disconnectDB };
