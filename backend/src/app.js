import express from 'express';
import userRoutes from './routes/userRoute.js';

const app = express();

app.use(express.json());

app.use('/api/auth', userRoutes);

export default app;