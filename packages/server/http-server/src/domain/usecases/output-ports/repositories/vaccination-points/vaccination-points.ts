import { Either } from '@server/shared';

import { VaccinationPoint } from '@entities/vaccination-point';
import { InfraError } from '@usecases/output-ports/errors';

export type FindByDocument = Either<InfraError, VaccinationPoint | null>;
export type Save = Either<InfraError, VaccinationPoint>;

export interface IVaccinationPointsRepository {
  findByDocument(document: string): Promise<FindByDocument>;
  save(vaccinationPoint: VaccinationPoint): Promise<Save>;
}
