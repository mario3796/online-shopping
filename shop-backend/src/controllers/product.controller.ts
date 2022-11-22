import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs';

import Product from '../models/product.model';
import User from '../models/user.model';
import HttpError from '../models/http-error.model';

const ITEMS_PER_PAGES = 2;

const getProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  Product.find().countDocuments()
  .then(totalItems => {
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGES)
    .limit(ITEMS_PER_PAGES)
    .then((products) => {
      res.status(200).json({
        totalItems,
        products
       });
    });
  })
};

const postProduct = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if(req.file) {
      deleteImage(req.file.path);
    }
    throw new HttpError(errors.array()[0].msg, 422);
  }
  if (!req.file) throw new HttpError('please pick a file of type image!', 422);
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    image: req.file?.path,
    description: req.body.description,
  });
  product
    .save()
    .then((product) => {
      res.status(201).json({
        message: 'Product Created',
        product: product,
      });
    })
    .catch((err) => next(err));
};

const getProduct = (req: Request, res: Response, next: NextFunction) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (!product) {
        throw new HttpError('Product not found', 400);
      }
      res.status(200).json({ product: product });
    })
    .catch((err) => next(err));
};

const putProduct = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      deleteImage(req.file.path);
    } 
    throw new HttpError(errors.array()[0].msg, 422);
  }
  if (!req.file) throw new HttpError('please pick a file of type image!', 422);
  Product.findById(req.params.productId)
    .then((product) => {
      if (product) {
        product.image && deleteImage(product.image);

        product.title = req.body.title;
        product.price = req.body.price;
        (product.image = req.file?.path as string),
          (product.description = req.body.description);
        console.log(req.file);
        return product.save();
      }
      throw new HttpError('Product not found', 400);
    })
    .then((product) =>
      res.status(200).json({ message: 'Product Updated', product: product })
    )
    .catch((err) => next(err));
};

const deleteProduct = (req: Request, res: Response, next: NextFunction) => {
  Product.findByIdAndDelete(req.params.productId)
    .then((product) => {
      if (!product) {
        throw new HttpError('Product not found', 400);
      }
      deleteItem(req.params.productId);
      product.image && deleteImage(product.image);
      res.status(200).json({ message: 'Product Deleted' });
    })
    .catch((err) => next(err));
};

const deleteItem = async (productId: string) => {
  const users = await User.find();
  users.forEach((user) => {
    user.cart.items = user.cart.items.filter((item) => item.id !== productId);
    user.save();
  });
};

const deleteImage = (image: string) => {
  fs.unlink(image, (err) => {
    if (err) throw new Error(err.message);
  });
};

export default {
  getProducts,
  postProduct,
  getProduct,
  putProduct,
  deleteProduct,
};
