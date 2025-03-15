export interface Address {
  id: string;
  street: string;
  number: string;
  apartment?: string;
  commune: string;
  province: string;
  city: string;
  region: string;
  postalCode?: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId?: string;
  companyId?: string;
}