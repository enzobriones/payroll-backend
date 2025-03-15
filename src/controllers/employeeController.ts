import { ContractType, PrismaClient } from '@prisma/client';
import type { HealthType } from '../interfaces/health.interface';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

interface CreateEmployeeRequestBody {
  firstName: string;
  lastName: string;
  birthDate: string | Date;
  hireDate: string | Date;
  baseSalary: number;
  jobTitle: string;
  contractType: ContractType;
  healthType: HealthType;
  weeklyHours: number;
  companyId: string;
  afpId?: string;
  healtPlanId?: string;
  departmentId?: string;
}

interface UpdateEmployeeRequestBody {
  firstName?: string;
  lastName?: string;
  birthDate?: string | Date;
  hireDate?: string | Date;
  baseSalary?: number;
  jobTitle?: string;
  contractType?: ContractType;
  healthType?: HealthType;
  weeklyHours?: number;
  afpId?: string;
  healthPlanId?: string;
  departmentId?: string;
}

const prisma = new PrismaClient();

// @desc   Get all employees
// @route  GET /api/employees
// @access Private
export const getEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        afp: true,
        healthPlan: true,
        department: true,
        addresses: true,
      },
    });
    res.json({
      success: true,
      data: employees,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting employees: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get an employee by ID
// @route   GET /api/employees/:id
// @access  Private
export const getEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
      include: {
        afp: true,
        healthPlan: true,
        department: true,
        addresses: true,
      },
    });
    if (!employee) {
      res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
      return;
    }
    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting employee: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

// @desc   Create a new employee
// @route  POST /api/employees
// @access Private
export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      hireDate,
      baseSalary,
      jobTitle,
      contractType,
      healthType,
      weeklyHours,
      companyId,
      afpId,
      healtPlanId,
      departmentId,
    } = req.body as CreateEmployeeRequestBody;

    const companyExists = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
    if (!companyExists) {
      res.status(404).json({
        success: false,
        message: 'Company not found',
      });
      return;
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        hireDate: new Date(hireDate),
        baseSalary,
        jobTitle,
        contractType,
        healthType,
        weeklyHours,
        Company: {
          connect: {
            id: companyId,
          },
        },
        ...(afpId && {
          AFP: {
            connect: {
              id: afpId,
            },
          },
        }),
        ...(healtPlanId && {
          HealthPlan: {
            connect: {
              id: healtPlanId,
            },
          },
        }),
        ...(departmentId && {
          Department: {
            connect: {
              id: departmentId,
            },
          },
        }),
      },
      include: {
        afp: true,
        healthPlan: true,
        department: true,
        addresses: true,
      },
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating employee: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc   Update an employee
// @route  PUT /api/employees/:id
// @access Private
export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const employeeId = req.params.id;
    const {
      firstName,
      lastName,
      birthDate,
      hireDate,
      baseSalary,
      jobTitle,
      contractType,
      healthType,
      weeklyHours,
      afpId,
      healthPlanId,
      departmentId,
    } = req.body as UpdateEmployeeRequestBody;

    // Check if employee exists
    const employeeExists = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employeeExists) {
      res.status(404).json({
        success: false,
        message: 'Empleado no encontrado',
      });
      return;
    }

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);
    if (hireDate !== undefined) updateData.hireDate = new Date(hireDate);
    if (baseSalary !== undefined) updateData.baseSalary = baseSalary;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (contractType !== undefined) updateData.contractType = contractType;
    if (healthType !== undefined) updateData.healthType = healthType;
    if (weeklyHours !== undefined) updateData.weeklyHours = weeklyHours;

    // Handle relations
    if (afpId !== undefined) {
      updateData.afp = afpId
        ? {
            connect: { id: afpId },
          }
        : { disconnect: true };
    }

    if (healthPlanId !== undefined) {
      updateData.healthPlan = healthPlanId
        ? {
            connect: { id: healthPlanId },
          }
        : { disconnect: true };
    }

    if (departmentId !== undefined) {
      updateData.department = departmentId
        ? {
            connect: { id: departmentId },
          }
        : { disconnect: true };
    }

    const employee = await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: updateData,
      include: {
        afp: true,
        healthPlan: true,
        department: true,
        addresses: true,
      },
    });

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating employee: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc   Delete an employee
// @route  DELETE /api/employees/:id
// @access Private
export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.delete({
      where: {
        id,
      },
    });
    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting employee: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}