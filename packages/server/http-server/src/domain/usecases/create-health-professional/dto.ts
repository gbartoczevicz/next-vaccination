import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';

export interface ICreateHealthProfessionalDTO {
  user: User;
  vaccinationPoint: VaccinationPoint;
  document: string;
  responsible?: boolean;
}
