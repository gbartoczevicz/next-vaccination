import { Either } from '@server/shared';

import { VaccinationPoint } from '@entities/vaccination-point';
import { InfraError } from '@usecases/output-ports/errors';
import { Coordinate } from '@entities/vaccination-point/values';

export type FindAll = Either<InfraError, VaccinationPoint[]>;
export type FindUnique = Either<InfraError, VaccinationPoint | null>;
export type Save = Either<InfraError, VaccinationPoint>;

export interface IVaccinationPointsRepository {
  findAllByApproximateCoordinate(coordinate: Coordinate): Promise<FindAll>;
  findById(id: string): Promise<FindUnique>;
  findByDocument(document: string): Promise<FindUnique>;
  findByCoordinate(coordinate: Coordinate): Promise<FindUnique>;
  save(vaccinationPoint: VaccinationPoint): Promise<Save>;
}
