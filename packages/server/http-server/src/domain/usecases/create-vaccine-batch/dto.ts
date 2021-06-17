import { VaccinationPoint, Vaccine } from '@entities/vaccination-point';

export interface ICreateVaccineBatchDTO {
  vaccinationPoint: VaccinationPoint;
  vaccine: Vaccine;
  expirationDate: Date;
  stock: number;
}
