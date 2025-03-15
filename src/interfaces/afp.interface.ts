import type { Employee } from "./employee.interface";

export interface AFP {
  id: string;
  name: string;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  Employee?: Employee[];
}