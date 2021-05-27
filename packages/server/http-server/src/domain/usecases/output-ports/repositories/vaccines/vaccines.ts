import { Vaccine } from '@entities/vaccination-point';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type FindUnique = Either<InfraError, Vaccine | null>;
export type Save = Either<InfraError, Vaccine>;

export interface IVaccinesRepository {
  findByName(name: string): Promise<FindUnique>;
  findById(id: string): Promise<FindUnique>;
  save(vaccine: Vaccine): Promise<Save>;
}
