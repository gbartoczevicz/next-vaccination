import { Either } from '@server/shared';

import { VaccinationPoint } from '@entities/vaccination-point';
import { InfraError } from '@usecases/output-ports/errors';

export type FindAll = Either<InfraError, VaccinationPoint[]>;
export type FindUnique = Either<InfraError, VaccinationPoint | null>;
export type Save = Either<InfraError, VaccinationPoint>;

export interface IVaccinationPointsRepository {
  findAll(): Promise<FindAll>;
  findById(id: string): Promise<FindUnique>;
  findByDocument(document: string): Promise<FindUnique>;
  findByLatitudeAndLongitude(latitude: number, longitude: number): Promise<FindUnique>;
  save(vaccinationPoint: VaccinationPoint): Promise<Save>;
}
