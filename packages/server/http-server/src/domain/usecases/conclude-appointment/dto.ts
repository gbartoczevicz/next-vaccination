import { Appointment } from '@entities/appointment';
import { HealthProfessional } from '@entities/health-professional';
import { VaccineBatch } from '@entities/vaccination-point';

export interface IConcludeAppointmentDTO {
  appointment: Appointment;
  vaccinatedBy: HealthProfessional;
  vaccineBatch: VaccineBatch;
  vaccinatedAt: Date;
}
