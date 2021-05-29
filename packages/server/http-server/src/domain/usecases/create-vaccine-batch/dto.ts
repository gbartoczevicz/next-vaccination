import { HealthProfessional } from '@entities/health-professional';

export interface ICreateVaccineBatchDTO {
  healthProfessional: HealthProfessional;
  vaccineId: string;
  expirationDate: Date;
  stock: number;
}
