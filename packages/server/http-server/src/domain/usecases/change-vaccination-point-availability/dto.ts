import { VaccinationPoint } from '@entities/vaccination-point';

export interface IChangeVaccinationPointAvailabilityDTO {
  vaccinationPoint: VaccinationPoint;
  availability: number;
}
