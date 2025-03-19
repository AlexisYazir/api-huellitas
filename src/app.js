import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import companyRouter from './routes/company.routes.js';
import deviceRouter from './routes/device.routes.js';

const app = express();

// Permitir que cualquier dominio se comunique con el servidor
app.use(cors({ origin: true, credentials: true }));

app.use(morgan('dev'));
app.use(express.json()); // Para que pueda entender JSON
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", productsRoutes);
app.use('/api', companyRouter);
app.use('/api', deviceRouter);

export default app;
