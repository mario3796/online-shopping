import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/user.model';
import HttpError from '../models/http-error.model';

dotenv.config();

interface JwtPayload {
  exp: string;
}

const signup = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(errors.array()[0].msg, 422);
  }
  bcrypt
    .hash(req.body.password, +(process.env.SALT_ROUNDS as string))
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
      });
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: 'Successfully signed up',
        user: user,
      });
    })
    .catch((err) => next(err));
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(errors.array()[0].msg, 422);
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw new HttpError('User not Found!', 401);
      }
      return bcrypt
        .compare(req.body.password, user.password)
        .then((isEqual) => {
          if (!isEqual) {
            throw new HttpError('Wrong Password!', 401);
          }
          const token = jwt.sign(
            { id: user._id },
            process.env.TOKEN_SECRET as string,
            { expiresIn: '1H' }
          );
          const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
          res.status(201).json({
            message: 'Successfully Logged in',
            token: token,
            userId: user._id,
            expirationTime: (decoded as unknown as JwtPayload).exp,
          });
        });
    })
    .catch((err) => next(err));
};

export default {
  signup,
  login,
};
