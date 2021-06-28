import { IPatientDTO } from './patient';

export enum AppointmentStatus {
  ALL = 'ALL',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  CONCLUDED = 'CONCLUDED'
}

export interface IAppointmentDTO {
  id: string;
  date: Date;
  vaccinated_at?: Date;
  cancellated_at?: Date;
  patient: IPatientDTO;
}
