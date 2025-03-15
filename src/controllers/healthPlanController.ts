import { HealthType, PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

interface CreateHealthPlanRequestBody {
  type: HealthType;
  name: string;
  discount: number;
}

interface UpdateHealthPlanRequestBody {
  name?: string;
  discount?: number;
}

const prisma = new PrismaClient();

// @desc   Get all health plans
// @route  GET /api/health-plans
// @access Public
export const getHealthPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const healthPlans = await prisma.healthPlan.findMany();
    res.status(200).json({
      success: true,
      data: healthPlans,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error fetching health plans: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc   Get a health plan by ID
// @route  GET /api/health-plans/:id
// @access Public
export const getHealthPlanById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const healthPlan = await prisma.healthPlan.findUnique({
      where: { id },
    });
  
    if (!healthPlan) {
      res.status(404).json({
        success: false,
        message: 'Health plan not found'
      });
      return;
    }
  
    res.status(200).json({
      success: true,
      data: healthPlan
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error fetching health plan: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc   Create a health plan
// @route  POST /api/health-plans
// @access Public
export const createHealthPlan = async (
  req: Request<unknown, unknown, CreateHealthPlanRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { type, name, discount } = req.body;
    const healthPlan = await prisma.healthPlan.create({
      data: {
        type,
        name,
        discount,
      },
    });
  
    res.status(201).json({
      success: true,
      data: healthPlan
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating health plan: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc   Update a health plan
// @route  PATCH /api/health-plans/:id
// @access Public
export const updateHealthPlan = async (
  req: Request<{ id: string }, unknown, UpdateHealthPlanRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, discount } = req.body;
    const healthPlan = await prisma.healthPlan.update({
      where: { id },
      data: {
        name,
        discount,
      },
    });
  
    res.status(200).json({
      success: true,
      data: healthPlan
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating health plan: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc   Delete a health plan
// @route  DELETE /api/health-plans/:id
// @access Public
export const deleteHealthPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.healthPlan.delete({
      where: { id },
    });
  
    res.status(200).json({
      success: true,
      message: 'Health plan deleted'
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting health plan: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}