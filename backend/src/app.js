import express from 'express';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js'

const app = express();

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);

export default app;