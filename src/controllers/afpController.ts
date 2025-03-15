import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import logger from "../utils/logger";

interface CreateAfpRequestBody {
  name: string;
  discount: number;
}

interface UpdateAfpRequestBody {
  name?: string;
  discount?: number;
}

const prisma = new PrismaClient();

// @desc   Get all AFPs
// @route  GET /api/afps
// @access Private
export const getAfps = async (req: Request, res: Response): Promise<void> => {
  try {
    const afps = await prisma.aFP.findMany();
    res.status(200).json({
      success: true,
      data: afps,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting AFPs: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc   Get an AFP by ID
// @route  GET /api/afps/:id
// @access Private
export const getAfp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const afp = await prisma.aFP.findUnique({
      where: {
        id,
      },
    });
    if (!afp) {
      res.status(404).json({
        success: false,
        error: `AFP with ID ${id} not found`,
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: afp,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting AFP: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc   Create an AFP
// @route  POST /api/afps
// @access Private
export const createAfp = async (req: Request, res: Response): Promise<void> => {
  const { name, discount } = req.body as CreateAfpRequestBody;
  try {
    const afp = await prisma.aFP.create({
      data: {
        name,
        discount,
      },
    });
    res.status(201).json({
      success: true,
      data: afp,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating AFP: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc   Update an AFP
// @route  PATCH /api/afps/:id
// @access Private
export const updateAfp = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, discount } = req.body as UpdateAfpRequestBody;
  try {
    const afp = await prisma.aFP.update({
      where: {
        id,
      },
      data: {
        name,
        discount,
      },
    });
    res.status(200).json({
      success: true,
      data: afp,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating AFP: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc   Delete an AFP
// @route  DELETE /api/afps/:id
// @access Private
export const deleteAfp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const afp = await prisma.aFP.delete({
      where: {
        id,
      },
    });
    res.status(200).json({
      success: true,
      data: afp,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting AFP: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};