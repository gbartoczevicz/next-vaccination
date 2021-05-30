import { ILocationProps } from '@entities/vaccination-point/values';

export interface ICreateVaccinationPointDTO {
  name: string;
  phone: string;
  document: string;
  location: ILocationProps;
  availability: number;
}
