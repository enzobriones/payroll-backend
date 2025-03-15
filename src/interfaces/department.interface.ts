import type { Employee } from "./employee.interface";

export interface Department {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  Employee?: Employee[];
}