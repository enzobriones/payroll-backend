import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface RegisterUserRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginUserRequestBody {
  email: string;
  password: string;
}

const prisma = new PrismaClient();

const generateToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '1d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterUserRequestBody;

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginUserRequestBody;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user && user.password === password) {
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          token: generateToken(user.id),
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};