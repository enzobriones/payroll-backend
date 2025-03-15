import type { Address } from "./address.interface";
import type { Employee } from "./employee.interface";

export interface Company {
  id: string;
  name: string;
  rut: string;
  createdAt: Date;
  updatedAt: Date;
  address?: Address[];
  employees?: Employee[];
  userId: string;
}