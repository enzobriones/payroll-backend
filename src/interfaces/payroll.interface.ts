export interface Payroll {
  id: string;
  month: string;
  year: string;
  grossSalary: number;
  netSalary: number;
  status: PayrollStatus;
  unemploymentDiscount: number;
  paidAt?: Date;
  healthDiscount: number;
  afpDiscount: number;
  totalDiscount: number;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PayrollStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}