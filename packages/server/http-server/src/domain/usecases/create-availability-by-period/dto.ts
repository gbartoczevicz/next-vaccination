import { VaccinationPoint } from '@entities/vaccination-point';

export interface ICreateAvailabilityByPeriodDTO {
  vaccinationPoint: VaccinationPoint;
  morning: number;
  evening: number;
  dusk: number;
}
