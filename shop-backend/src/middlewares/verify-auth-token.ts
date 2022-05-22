import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

declare module 'express-serve-static-core' {
  interface Request {
    userData: { userId: string };
  }
}

interface JwtPayload {
  userId: string;
}

const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader as string;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as string);
    req.userData = { userId: (decodedToken as JwtPayload).userId };
    next();
  } catch (err) {
    res.status(500).json('Access Denied, Invalid Token');
  }
};

export default verifyAuthToken;
