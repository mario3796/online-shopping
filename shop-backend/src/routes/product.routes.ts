import { Router } from 'express';
import { check } from 'express-validator';

import productController from '../controllers/product.controller';
import verifyAuthToken from '../middlewares/verify-auth-token';
import fileUpload from '../middlewares/file-upload';

const router = Router();

router.get('/', productController.getProducts);

router.get('/:productId', productController.getProduct);

router.use(verifyAuthToken);

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').trim().notEmpty().withMessage('product title is required!'),
    check('price')
      .trim()
      .notEmpty()
      .withMessage('product price is required!')
      .toFloat()
      .isFloat({ gt: 0 })
      .withMessage('please enter a valid price!'),
  ],
  productController.postProduct
);

router.put(
  '/:productId',
  fileUpload.single('image'),
  [
    check('title').trim().notEmpty().withMessage('product title is required!'),
    check('price')
      .trim()
      .notEmpty()
      .withMessage('product price is required!')
      .toFloat()
      .isFloat({ gt: 0 })
      .withMessage('please enter a valid price!'),
  ],
  productController.putProduct
);

router.delete('/:productId', productController.deleteProduct);

export default router;
