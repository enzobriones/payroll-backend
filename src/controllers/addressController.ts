import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

interface CreateAddressRequestBody {
  street: string;
  number: string;
  apartment?: string;
  commune: string;
  province: string;
  city: string;
  region: string;
  postalCode?: string;
  country?: string;
  employeeId?: string;
  companyId?: string;
}

const prisma = new PrismaClient();

// @desc  Get all addresses
// @route GET /api/v1/addresses
// @access Public
export const getAddresses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addresses = await prisma.address.findMany();
    if (!addresses) {
      res.status(404).json({
        success: false,
        data: 'No addresses found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting addresses: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc  Get single address
// @route GET /api/v1/addresses/:id
// @access Public
export const getAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      res.status(404).json({
        success: false,
        data: `No address found with id: ${id}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting address: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc  Create address
// @route POST /api/v1/addresses
// @access Public
export const createAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      street,
      number,
      apartment,
      commune,
      province,
      city,
      region,
      postalCode,
      country,
      employeeId,
      companyId,
    } = req.body;

    const address = await prisma.address.create({
      data: {
        street,
        number,
        apartment,
        commune,
        province,
        city,
        region,
        postalCode,
        country,
        employeeId,
        companyId,
      },
    });

    res.status(201).json({
      success: true,
      data: address,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating address: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc  Update address
// @route PATCH /api/v1/addresses/:id
// @access Public
export const updateAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    const {
      street,
      number,
      apartment,
      commune,
      province,
      city,
      region,
      postalCode,
      country,
      employeeId,
      companyId,
    } = req.body;

    const address = await prisma.address.update({
      where: { id },
      data: {
        street,
        number,
        apartment,
        commune,
        province,
        city,
        region,
        postalCode,
        country,
        employeeId,
        companyId,
      },
    });

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating address: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc  Delete address
// @route DELETE /api/v1/addresses/:id
// @access Public
export const deleteAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;
    await prisma.address.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      data: `Address with id: ${id} deleted`,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting address: ${err.message}`);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};