import { Appointment } from '@entities/appointment';
import { VaccineBatch } from '@entities/vaccination-point';

export interface IGetAppointmentsThatUseSameVaccineBatchesDTO {
  vaccineBatches: VaccineBatch[];
}

export interface IAppointmentsWithVaccineBatchDTO {
  vaccineBatch: VaccineBatch;
  appointments: Appointment[];
}
