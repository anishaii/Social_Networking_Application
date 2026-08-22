import express from 'express';
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js'
import profileRoutes from './routes/profileRoute.js';

const app = express();

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', profileRoutes);

export default app;