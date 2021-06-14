import { Appointment, Cancellation } from '@entities/appointment';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Cancellation>;
export type FindUnique = Either<InfraError, Cancellation | null>;

export interface ICancellationsRepository {
  save(cancellation: Cancellation): Promise<Save>;
  findByAppointment(appointment: Appointment): Promise<FindUnique>;
}
