import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type FindUnique = Either<InfraError, HealthProfessional | null>;
export type Save = Either<InfraError, HealthProfessional>;

export interface IHealthProfessionalsRepository {
  findById(id: string): Promise<FindUnique>;
  findByUser(user: User): Promise<FindUnique>;
  findByUserAndIsResponsible(user: User): Promise<FindUnique>;
  findByDocument(document: string): Promise<FindUnique>;
  findByVaccinationPointIdAndIsResponsible(vaccinationPointId: string): Promise<FindUnique>;
  save(healthProfessional: HealthProfessional): Promise<Save>;
}
