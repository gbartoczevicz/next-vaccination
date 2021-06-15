import { Appointment } from '@entities/appointment';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Appointment>;
export type FindAll = Either<InfraError, Appointment[]>;

export interface IAppointmentsRepository {
  save(appointment: Appointment): Promise<Save>;
  findAllByVaccinationPointAndDate(vaccinationPoint: VaccinationPoint, date: Date): Promise<FindAll>;
}
