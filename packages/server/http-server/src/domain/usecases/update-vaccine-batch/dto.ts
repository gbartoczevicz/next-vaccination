import { VaccineBatch } from '@entities/vaccination-point';

export interface IUpdateVaccineBatchDTO {
  vaccineBatch: VaccineBatch;
  expirationDate: Date;
  stock: number;
}
