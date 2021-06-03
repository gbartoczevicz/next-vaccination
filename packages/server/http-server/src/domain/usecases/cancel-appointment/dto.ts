import { Appointment } from '@entities/appointment';
import { User } from '@entities/user';

export interface ICancelAppointment {
  appointment: Appointment;
  cancelatedBy: User;
  reason: string;
  createdAt: Date;
}
