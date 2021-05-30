import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, Patient>;
export type FindUnique = Either<InfraError, Patient | null>;
export interface IPatientsRepository {
  save(patient: Patient): Promise<Save>;
  findById(id: string): Promise<FindUnique>;
  findByDocument(document: string): Promise<FindUnique>;
  findByUser(user: User): Promise<FindUnique>;
}
