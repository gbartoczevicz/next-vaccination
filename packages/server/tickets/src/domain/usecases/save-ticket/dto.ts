import { Patient } from '@entities/patient';

export interface ISaveTicketDTO {
  ticket: string;
  patient: Patient;
}
