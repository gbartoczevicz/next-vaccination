import { Patient } from '@entities/patient';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export interface IPatientsRepository {
  save(patient: Patient): Promise<Either<InfraError, Patient>>;
  findByDocument(document: string): Promise<Either<InfraError, Patient | null>>;
}
