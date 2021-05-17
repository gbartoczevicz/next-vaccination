import { AvailabilityByPeriod } from '@entities/vaccination-point/availability-by-period';
import { left } from '@server/shared';
import { VaccinationPointNotFound } from '@usecases/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { ICreateAvailabilityByPeriodDTO } from './dto';

export class CreateAvailabilityByPeriodUseCase {
  private vaccinationPointsRepository: IVaccinationPointsRepository;

  async execute(request: ICreateAvailabilityByPeriodDTO) {
    const vaccinationPointExistsOrError = await this.vaccinationPointsRepository.findById(request.vaccinationPointId);

    if (vaccinationPointExistsOrError.isLeft()) {
      return left(vaccinationPointExistsOrError.value);
    }

    if (!vaccinationPointExistsOrError.value) {
      return left(new VaccinationPointNotFound());
    }

    const vaccinationPoint = vaccinationPointExistsOrError.value;

    const availabilityByPeriodOrError = AvailabilityByPeriod.create({
      ...request,
      vaccinationPoint
    });

    if (availabilityByPeriodOrError.isLeft()) {
      return left(availabilityByPeriodOrError.value);
    }

    const savedAvailabilityByPeriodOrError = await 
  }
}
