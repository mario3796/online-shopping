import mongoose from 'mongoose';

interface Product {
  id?: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

const productSchema = new mongoose.Schema<Product>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: String,
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
