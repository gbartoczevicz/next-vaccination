import { Cancellation } from '@entities/appointment';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Cancellation>;

export interface ICancellationsRepository {
  save(cancellation: Cancellation): Promise<Save>;
}
