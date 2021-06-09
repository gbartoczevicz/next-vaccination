import { Patient } from '@entities/patient';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type FindUnique = Either<InfraError, Patient | null>;

export interface IPatientsRepository {
  findById(id: string): Promise<FindUnique>;
}
