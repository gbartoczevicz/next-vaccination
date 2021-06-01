import { Patient } from '@entities/patient';
import { VaccinationPoint } from '@entities/vaccination-point';

export interface ICreateAppointmentDTO {
  patient: Patient;
  vaccinationPoint: VaccinationPoint;
  date: Date;
}
