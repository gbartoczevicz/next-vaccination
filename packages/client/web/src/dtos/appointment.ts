import { IPatientDTO } from './patient';

export type AppointmentStatus = 'ALL' | 'PENDING' | 'CANCELLED' | 'CONCLUDED';

export interface IAppointmentDTO {
  id: string;
  date: Date;
  vaccinated_at?: Date;
  cancellated_at?: Date;
  patient: IPatientDTO;
}
