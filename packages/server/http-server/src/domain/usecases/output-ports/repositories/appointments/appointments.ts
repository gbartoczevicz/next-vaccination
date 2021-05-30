import { Appointment } from '@entities/appointment';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Appointment>;

export interface IAppointmentsRepository {
  save(appointment: Appointment): Promise<Save>;
}
