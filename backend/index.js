import express from 'express';
import cors from 'cors';
import estudiantesRouter from './src/routes/estudiantes.js';
import empresasRouter from './src/routes/empresas.js';
import adminRouter from './src/routes/admin.js';
import authRoutes from './src/routes/auth.js'; 
import { getTransporter } from './src/routes/emailTransporter.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api1', estudiantesRouter);

app.use('/api2', empresasRouter);

app.use('/api3', adminRouter);

app.use('/api', authRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
