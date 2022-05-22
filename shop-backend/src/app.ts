/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

dotenv.config();

const port = process.env.PORT || 8080;

app.use(cors());
app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use(bodyParser.json());
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use(authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use(userRoutes);

app.use(
  (error: any, req: any, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
  }
);

mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6lrvc.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true`
  ).then(() => {
  app.listen(port, () => console.log(`Connected to localhost:${port}`));
});
