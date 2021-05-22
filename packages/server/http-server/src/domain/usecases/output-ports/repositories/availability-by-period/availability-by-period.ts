import { AvailabilityByPeriod, VaccinationPoint } from '@entities/vaccination-point';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type Save = Either<InfraError, AvailabilityByPeriod>;
export type FindUnique = Either<InfraError, AvailabilityByPeriod | null>;

export interface IAvailabilityByPeriodRepository {
  findByVaccinationPoint(vaccinationPoint: VaccinationPoint): Promise<FindUnique>;
  save(AvailabilityByPeriod: AvailabilityByPeriod): Promise<Save>;
}
