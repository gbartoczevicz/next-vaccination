import { Patient } from '@entities/patient';

export interface IUpdatePatientDTO {
  patient: Patient;
  birthday: Date;
  document: string;
}
