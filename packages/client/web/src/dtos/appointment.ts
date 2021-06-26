import { IPatientDTO } from './patient';

export interface IAppointmentDTO {
  id: string;
  date: Date;
  vaccinated_at?: Date;
  cancellated_at?: Date;
  patient: IPatientDTO;
}
