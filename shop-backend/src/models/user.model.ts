import mongoose from 'mongoose';

export interface Item {
  id?: string;
  quantity: number;
}

export interface User {
  id?: string;
  email: string;
  username: string;
  password: string;
  cart: {
    items: Item[];
  };
}

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: {
      items: [],
      totalPrice: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
