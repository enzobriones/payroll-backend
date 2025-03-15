import { PrismaClient } from '@prisma/client';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

const prisma = new PrismaClient();

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
  
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
  
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
        },
        select: {
          password: true,
        }
      });
  
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Not authorized, user not found',
        });
        return;
      }
  
      req.body.user = user;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Not authorized, token failed',
      });
    }
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authorized, no token',
    })
  }
};
