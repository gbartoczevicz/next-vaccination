import { HealthProfessional } from '@entities/health-professional';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type FindUnique = Either<InfraError, HealthProfessional | null>;
export type Save = Either<InfraError, HealthProfessional>;

export interface IHealthProfessionalsRepository {
  findByDocument(document: string): Promise<FindUnique>;
  save(healthProfessional: HealthProfessional): Promise<Save>;
}
