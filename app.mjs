import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRouter from './routes/userRouters.mjs';
import tourRouter from './routes/tourRoutes.mjs';

dotenv.config({ path: './config.env' });

// Initialising express app
const app = express();

// middleware

// 1.
const environment = process.env.NODE_ENV;
if (environment === 'development') {
  app.use(morgan('dev'));
}

// 2.
app.use(express.json());

// middleware
// 3. (mounting router)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;

// ===================================================================================================
