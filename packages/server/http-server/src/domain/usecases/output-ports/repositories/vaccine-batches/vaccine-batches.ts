import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, VaccineBatch>;
export type FindAll = Either<InfraError, VaccineBatch[]>;

export interface IVaccineBatchesRepository {
  save(vaccineBatch: VaccineBatch): Promise<Save>;
  findAllByVaccinationPointAndExpirationDateAfterThan(
    vaccinationPoint: VaccinationPoint,
    expirationDate: Date
  ): Promise<FindAll>;
}
