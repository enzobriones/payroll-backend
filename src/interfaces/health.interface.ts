import type { Employee } from "./employee.interface";

export interface HealthPlan {
  id: string;
  name: string;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  Employee?: Employee[];
}

export enum HealthType {
  FONASA = 'FONASA',
  ISAPRE = 'ISAPRE',
}