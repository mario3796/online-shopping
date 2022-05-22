import { Router } from 'express';
import { body } from 'express-validator';

import authController from '../controllers/auth.controller';
import User from '../models/user.model';

const router = Router();

router.post(
  '/signup',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('please fill the email field!')
      .isEmail()
      .withMessage('please enter a valid email!')
      .custom((value) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) throw new Error('email already exists!');
        });
      }),
    body('username')
      .trim()
      .notEmpty()
      .withMessage('please enter a valid username!')
      .custom((value) => {
        return User.findOne({ username: value }).then((user) => {
          if (user) throw new Error('username already exists!');
        });
      }),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('please fill the password field!')
      .isLength({ min: 6 })
      .withMessage('password must be not less than 6 characters!'),
  ],
  authController.signup
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('please fill the email field!')
      .isEmail()
      .withMessage('please enter a valid email!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('please fill the password field!')
      .isLength({ min: 6 })
      .withMessage('password must be not less than 6 characters!'),
  ],
  authController.login
);

export default router;
