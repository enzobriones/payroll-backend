import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

interface CreateDepartmentRequestBody {
  name: string;
  description?: string;
}

interface UpdateDepartmentRequestBody {
  name?: string;
  description?: string;
}

const prisma = new PrismaClient();

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const departments = await prisma.department.findMany();
    if (!departments) {
      res.status(404).json({ message: 'No departments found' });
      return;
    }
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting departments: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
export const getDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
    });
    if (!department) {
      res.status(404).json({ message: 'Department not found' });
      return;
    }
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting department: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private
export const createDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body as CreateDepartmentRequestBody;

    const department = await prisma.department.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating department: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private
export const updateDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const { name, description } = req.body as UpdateDepartmentRequestBody;

    const department = await prisma.department.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating department: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private
export const deleteDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    await prisma.department.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting department: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};