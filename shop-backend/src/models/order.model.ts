import mongoose from 'mongoose';

import { Item } from './user.model';

interface Order {
  id?: string;
  userId: string;
  price: number;
  products: Item[];
}

const orderSchema = new mongoose.Schema<Order>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    price: Number,
    products: [],
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
