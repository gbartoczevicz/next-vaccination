import { ILocationProps } from '@entities/vaccination-point/values';

export interface IUpdateVaccinationPointDTO {
  id: string;
  name: string;
  phone: string;
  document: string;
  location: ILocationProps;
  availability: number;
}
