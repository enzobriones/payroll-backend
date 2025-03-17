import { PayrollStatus, PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import logger from '../utils/logger';

interface CreatePayrollRequestBody {
  month: number;
  year: number;
  grossSalary: number;
  netSalary: number;
  employeeId: string;
  afpDiscount: number;
  healthDiscount: number;
  unemploymentDiscount: number;
  totalDiscount: number;
  status?: PayrollStatus;
}

interface UpdatePayrollRequestBody {
  grossSalary?: number;
  netSalary?: number;
  afpDiscount?: number;
  healthDiscount?: number;
  unemploymentDiscount?: number;
  totalDiscount?: number;
  status?: PayrollStatus;
  paidAt?: Date | string | null;
}

const prisma = new PrismaClient();

// @desc    Get all payrolls
// @route   GET /api/payrolls
// @access  Public
export const getPayrolls = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { employeeId, month, year, status } = req.query;

    const where: any = {};

    if (employeeId) where.employeeId = employeeId as string;
    if (month) where.month = Number(month);
    if (year) where.year = Number(year);
    if (status) where.status = status as PayrollStatus;

    const payrolls = await prisma.payroll.findMany({
      where,
      include: {
        Employee: true,
      },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });

    res.status(200).json({
      success: true,
      data: payrolls,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting payrolls: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get single payroll
// @route   GET /api/payrolls/:id
// @access  Public
export const getPayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const payroll = await prisma.payroll.findUnique({
      where: { id: id as string },
      include: {
        Employee: true,
      },
    });

    if (!payroll) {
      res.status(404).json({
        success: false,
        error: 'Payroll not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting payroll: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Create payroll
// @route   POST /api/payrolls
// @access  Public
export const createPayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      month,
      year,
      grossSalary,
      netSalary,
      employeeId,
      afpDiscount,
      healthDiscount,
      unemploymentDiscount,
      totalDiscount,
      status = PayrollStatus.PENDING,
    } = req.body as CreatePayrollRequestBody;

    if (month < 1 || month > 12) {
      res.status(400).json({
        success: false,
        error: 'Invalid month',
      });
      return;
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });
    if (!employee) {
      res.status(404).json({
        success: false,
        error: 'Employee not found',
      });
      return;
    }

    const existingPayroll = await prisma.payroll.findFirst({
      where: {
        employeeId,
        month,
        year,
      },
    });

    if (existingPayroll) {
      res.status(400).json({
        success: false,
        error: `Payroll already exists for the employee in ${month}/${year}`,
      });
      return;
    }

    const payroll = await prisma.payroll.create({
      data: {
        month,
        year,
        grossSalary,
        netSalary,
        Employee: {
          connect: {
            id: employeeId,
          },
        },
        afpDiscount,
        healthDiscount,
        unemploymentDiscount,
        totalDiscount,
        status,
      },
      include: {
        Employee: true,
      },
    });

    res.status(201).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating payroll: ${err.message}`);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update payroll
// @route   PUT /api/payrolls/:id
// @access  Public
export const updatePayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payrollId = req.params.id;
    const {
      grossSalary,
      netSalary,
      afpDiscount,
      healthDiscount,
      unemploymentDiscount,
      totalDiscount,
      status,
      paidAt,
    } = req.body as UpdatePayrollRequestBody;

    // Check if payroll exists
    const payrollExists = await prisma.payroll.findUnique({
      where: {
        id: payrollId,
      },
    });

    if (!payrollExists) {
      res.status(404).json({
        success: false,
        message: 'Payroll not found',
      });
      return;
    }

    // Set paidAt to current date when changing status to PAID
    let paidAtValue = paidAt;
    if (status === 'PAID' && payrollExists.status !== 'PAID') {
      paidAtValue = new Date();
    }

    const updateData: any = {};

    if (grossSalary !== undefined) updateData.grossSalary = grossSalary;
    if (netSalary !== undefined) updateData.netSalary = netSalary;
    if (afpDiscount !== undefined) updateData.afpDiscount = afpDiscount;
    if (healthDiscount !== undefined)
      updateData.healthDiscount = healthDiscount;
    if (unemploymentDiscount !== undefined)
      updateData.unemploymentDiscount = unemploymentDiscount;
    if (totalDiscount !== undefined) updateData.totalDiscount = totalDiscount;
    if (status !== undefined) updateData.status = status;
    if (paidAtValue !== undefined) updateData.paidAt = paidAtValue;

    const payroll = await prisma.payroll.update({
      where: {
        id: payrollId,
      },
      data: updateData,
      include: {
        Employee: true,
      },
    });

    res.status(200).json({
      success: true,
      data: payroll,
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating payroll: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete payroll
// @route   DELETE /api/payrolls/:id
// @access  Private
export const deletePayroll = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payrollId = req.params.id;

    // Check if payroll exists
    const payrollExists = await prisma.payroll.findUnique({
      where: {
        id: payrollId,
      },
    });

    if (!payrollExists) {
      res.status(404).json({
        success: false,
        message: 'Payroll not found',
      });
      return;
    }

    // Can't delete paid payrolls for audit purposes
    if (payrollExists.status === 'PAID') {
      res.status(400).json({
        success: false,
        message: 'Can\'t delete a paid payroll',
      });
      return;
    }

    await prisma.payroll.delete({
      where: {
        id: payrollId,
      },
    });

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting payroll: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Generate payrolls for all employees in a company
// @route   POST /api/payrolls/generate
// @access  Private
export const generatePayrolls = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId, month, year } = req.body;

    // Validate month and year
    if (month < 1 || month > 12) {
      res.status(400).json({
        success: false,
        message: 'Invalid month, must be between 1 and 12',
      });
      return;
    }

    // Get all employees from the company
    const employees = await prisma.employee.findMany({
      where: {
        companyId,
      },
      include: {
        afp: true,
        healthPlan: true,
      },
    });

    if (employees.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No employees found in this company',
      });
      return;
    }

    const results = [];
    const errors = [];

    // Generate payroll for each employee
    for (const employee of employees) {
      try {
        // Check if payroll already exists for this employee, month, and year
        const existingPayroll = await prisma.payroll.findFirst({
          where: {
            employeeId: employee.id,
            month,
            year,
          },
        });

        if (existingPayroll) {
          errors.push({
            employeeId: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            message: `Payroll already exists for ${month}/${year}`,
          });
          continue;
        }

        // Calculate discounts
        const afpDiscount = employee.afp
          ? Math.round((employee.baseSalary * employee.afp.discount) / 100)
          : 0;
        const healthDiscount = employee.healthPlan
          ? Math.round(
              (employee.baseSalary * employee.healthPlan.discount) / 100
            )
          : 0;
        const unemploymentDiscount = Math.round(employee.baseSalary * 0.03); // 3% fixed rate for unemployment insurance in Chile
        const totalDiscount =
          afpDiscount + healthDiscount + unemploymentDiscount;
        const netSalary = employee.baseSalary - totalDiscount;

        // Create payroll
        const payroll = await prisma.payroll.create({
          data: {
            month,
            year,
            grossSalary: employee.baseSalary,
            netSalary,
            afpDiscount,
            healthDiscount,
            unemploymentDiscount,
            totalDiscount,
            status: 'PENDING',
            Employee: {
              connect: {
                id: employee.id,
              },
            },
          },
        });

        results.push({
          employeeId: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          payrollId: payroll.id,
        });
      } catch (error) {
        const err = error as Error;
        errors.push({
          employeeId: employee.id,
          name: `${employee.firstName} ${employee.lastName}`,
          message: err.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        processed: employees.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors,
      },
    });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error generating payrolls: ${err.message}`);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
