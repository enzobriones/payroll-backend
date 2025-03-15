import type { Company } from "./company.interface";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  company?: Company[];
}

