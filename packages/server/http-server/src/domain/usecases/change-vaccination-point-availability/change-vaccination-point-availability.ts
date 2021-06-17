import { CreateVaccinationPointErrors, VaccinationPoint } from '@entities/vaccination-point';
import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { IChangeVaccinationPointAvailabilityDTO } from './dto';

type Response = Either<InfraError | CreateVaccinationPointErrors, VaccinationPoint>;

export class ChangeVaccinationPointAvailabilityUseCase {
  private vaccinationPointsRepository: IVaccinationPointsRepository;

  constructor(vaccinationPointsRepository: IVaccinationPointsRepository) {
    this.vaccinationPointsRepository = vaccinationPointsRepository;
  }

  async execute(request: IChangeVaccinationPointAvailabilityDTO): Promise<Response> {
    const { availability, vaccinationPoint } = request;

    const vaccinationPointToUpdateOrError = VaccinationPoint.create({
      ...vaccinationPoint,
      phone: vaccinationPoint.phone.value,
      availability
    });

    if (vaccinationPointToUpdateOrError.isLeft()) {
      return left(vaccinationPointToUpdateOrError.value);
    }

    const updatedVaccinationPointOrError = await this.vaccinationPointsRepository.save(
      vaccinationPointToUpdateOrError.value
    );

    if (updatedVaccinationPointOrError.isLeft()) {
      return left(updatedVaccinationPointOrError.value);
    }

    return right(updatedVaccinationPointOrError.value);
  }
}
