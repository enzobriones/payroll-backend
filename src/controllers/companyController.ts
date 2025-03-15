import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

interface CreateCompanyRequestBody {
  name: string;
  rut: string;
  userId: string;
}

interface UpdateCompanyResponseBody {
  name?: string;
  rut?: string;
}

const prisma = new PrismaClient();

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companies = await prisma.company.findMany({
      include: {
        User: true,
      },
    });

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting companies: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private
export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, rut, userId } = req.body as CreateCompanyRequestBody;

    const companyExists = await prisma.company.findFirst({
      where: {
        rut,
      },
    });
    if (companyExists) {
      res.status(400).json({
        success: false,
        message: 'Company already exists',
      });
      return;
    }

    const company = await prisma.company.create({
      data: {
        name,
        rut,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: company,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating company: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Get a company by ID
// @route   GET /api/companies/:id
// @access  Private
export const getCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        id: id as string,
      },
      include: {
        User: true,
      },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting company: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Update a company by ID
// @route   PATCH /api/companies/:id
// @access  Private
export const updateCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, rut } = req.body as UpdateCompanyResponseBody;

    const company = await prisma.company.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: id as string,
      },
      data: {
        name,
        rut,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedCompany,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating company: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc    Delete a company by ID
// @route   DELETE /api/companies/:id
// @access  Private
export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!company) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    await prisma.company.delete({
      where: {
        id: id as string,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Company deleted',
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting company: ${err.message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};