/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextFunction, Request, Response } from 'express';
import HttpError from '../models/http-error.model';

import Order from '../models/order.model';
import User from '../models/user.model';

const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = new Order({
      userId: req.body.userId,
      price: req.body.price,
      products: req.body.products,
    });
    await order.save();
    const user = await User.findById(req.body.userId);
    user!.cart.items = [];
    await user?.save();
    res.status(201).json({ message: 'Order added', order: order });
  } catch (err) {
    const error = new HttpError((err as Error).message, 404);
    next(error);
  }
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find({ userId: req.query.userId }).populate(
      'userId'
    );
    res.status(200).json({ message: 'Orders fetched', orders: orders });
  } catch (err) {
    const error = new HttpError((err as Error).message, 404);
    next(error);
  }
};

const getOrder = (req: Request, res: Response) => {
  Order.findById(req.params.orderId)
    .populate('userId')
    .exec((err, order) => {
      if (err) return res.status(404).json({ message: err.message });
      console.log(order?.products);
      res.status(200).json({ message: 'Order fetched', order: order });
    });
};

export default {
  addOrder,
  getOrders,
  getOrder,
};
