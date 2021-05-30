/* eslint-disable max-len */
import { AvailabilityByPeriod } from '@entities/vaccination-point/availability-by-period';
import { InvalidAvailabilityByPeriod } from '@entities/vaccination-point/errors';
import { Either, left, right } from '@server/shared';
import { AvailabilityByPeriodAlreadyExists } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IAvailabilityByPeriodRepository } from '@usecases/output-ports/repositories/availability-by-period';
import { ICreateAvailabilityByPeriodDTO } from './dto';

type Response = Either<
  InfraError | InvalidAvailabilityByPeriod | AvailabilityByPeriodAlreadyExists,
  AvailabilityByPeriod
>;

export class CreateAvailabilityByPeriodUseCase {
  private availabilityByPeriodRepository: IAvailabilityByPeriodRepository;

  constructor(availabilityByPeriodRepository: IAvailabilityByPeriodRepository) {
    this.availabilityByPeriodRepository = availabilityByPeriodRepository;
  }

  async execute(request: ICreateAvailabilityByPeriodDTO): Promise<Response> {
    const availabilityByPeriodToSaveOrError = AvailabilityByPeriod.create(request);

    if (availabilityByPeriodToSaveOrError.isLeft()) {
      return left(availabilityByPeriodToSaveOrError.value);
    }

    const availabilityByPeriodRepositoryAlreadyExistsOrError = await this.availabilityByPeriodRepository.findByVaccinationPoint(
      request.vaccinationPoint
    );

    if (availabilityByPeriodRepositoryAlreadyExistsOrError.isLeft()) {
      return left(availabilityByPeriodRepositoryAlreadyExistsOrError.value);
    }

    if (availabilityByPeriodRepositoryAlreadyExistsOrError.value) {
      return left(new AvailabilityByPeriodAlreadyExists());
    }

    const savedAvailabilityByPeriodOrError = await this.availabilityByPeriodRepository.save(
      availabilityByPeriodToSaveOrError.value
    );

    if (savedAvailabilityByPeriodOrError.isLeft()) {
      return left(savedAvailabilityByPeriodOrError.value);
    }

    return right(savedAvailabilityByPeriodOrError.value);
  }
}
