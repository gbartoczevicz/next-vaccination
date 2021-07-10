import { VaccinationPoint } from '@entities/vaccination-point';
import { VaccinationPointNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { Either, left, right } from '@server/shared';
import { IGetVaccinationPointDTO } from './dto';

type Response = Either<InfraError | VaccinationPointNotFound, VaccinationPoint>;

export class GetVaccinationPointUseCase {
  private vaccinationPointsRepository: IVaccinationPointsRepository;

  constructor(vaccinationPointsRepository: IVaccinationPointsRepository) {
    this.vaccinationPointsRepository = vaccinationPointsRepository;
  }

  async execute(dto: IGetVaccinationPointDTO): Promise<Response> {
    const vaccinationPointOrError = await this.vaccinationPointsRepository.findById(dto.vaccination_point_id);

    if (vaccinationPointOrError.isLeft()) {
      return left(vaccinationPointOrError.value);
    }

    if (!vaccinationPointOrError.value) {
      return left(new VaccinationPointNotFound());
    }

    return right(vaccinationPointOrError.value);
  }
}
