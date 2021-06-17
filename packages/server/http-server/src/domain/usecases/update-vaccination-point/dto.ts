import { VaccinationPoint } from '@entities/vaccination-point';
import { ILocationProps } from '@entities/vaccination-point/values';

export interface IUpdateVaccinationPointDTO {
  vaccinationPoint: VaccinationPoint;
  name: string;
  phone: string;
  document: string;
  location: ILocationProps;
}
