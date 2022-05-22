/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from 'express';

import User, { Item } from '../models/user.model';
import Product from '../models/product.model';
import HttpError from '../models/http-error.model';

const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const productId = req.body.productId;
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    const itemIndex = user?.cart.items.findIndex(
      (item: Item) => item.id === productId
    );
    if (itemIndex! < 0) {
      user?.cart.items.push({
        id: productId,
        quantity: 1,
      });
    } else {
      const quantity = user!.cart.items[itemIndex!].quantity + 1;
      user!.cart.items[itemIndex!] = {
        id: productId,
        quantity: quantity,
      };
    }

    await user?.save();
    res.status(201).json({ message: 'Product added', user: user });
  } catch (err) {
    const error = new HttpError((err as Error).message, 404);
    next(error);
  }
};

const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productId = req.body.productId;
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    const itemIndex = user!.cart.items.findIndex(
      (item: Item) => item.id === productId
    );
    const quantity = user!.cart.items[itemIndex].quantity - 1;
    if (quantity === 0) {
      user!.cart.items = user!.cart.items.filter(
        (item: Item) => item.id !== productId
      );
    } else {
      user!.cart.items[itemIndex] = {
        id: productId,
        quantity: quantity,
      };
    }

    await user?.save();
    res.status(201).json({ message: 'Product removed', user: user });
  } catch (err) {
    const error = new HttpError((err as Error).message, 404);
    next(error);
  }
};

const getCart = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  User.findById(userId)
    .then(async (user) => {
      const items = user?.cart.items;
      const products = await Product.find();

      let totalPrice = 0;
      const cartItems = items!
        .filter((item) => products!.find(({ id }) => item.id === id))
        .map((item) => {
          const product = products.find(({ id }) => item.id === id);
          totalPrice += product!.price * item.quantity;
          return {
            ...product?.toObject(),
            quantity: item.quantity,
          };
        });
      return res.status(200).json({
        message: 'Cart fetched',
        cart: cartItems,
        totalPrice: totalPrice.toFixed(2),
      });
    })
    .catch((err) => {
      const error = new HttpError(err.message, 404);
      next(error);
    });
};

const clearCart = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      user!.cart.items = [];
      user?.save();
    })
    .then((user) => {
      res.status(200).json({
        message: 'Cart cleared',
        user: user,
      });
    })
    .catch((err) => {
      const error = new HttpError(err.message, 404);
      next(error);
    });
};

export default {
  addProduct,
  removeProduct,
  getCart,
  clearCart,
};
