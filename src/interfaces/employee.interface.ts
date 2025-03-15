import type { Address } from "./address.interface";
import type { Company } from "./company.interface";
import type { HealthType } from "./health.interface";
import type { Payroll } from "./payroll.interface";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  hireDate: Date;
  baseSalary: number;
  jobTitle: string;
  contractType: ContractType;
  healthType: HealthType;
  weeklyHours: number;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
  afpId?: string;
  healthPlanId?: string;
  departmentId?: string;
  Company?: Company;
  companyId?: string;
  Payroll?: Payroll[];
}

enum ContractType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = '  PART_TIME',
  TEMPORARY = '  TEMPORARY',
  CONTRACTOR = '  CONTRACTOR',
}