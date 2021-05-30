import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidCoordinate } from '@entities/vaccination-point/errors';
import { Coordinate } from '@entities/vaccination-point/values';
import { Either, left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { IGetNearbyVaccinationPointsDTO } from './dto';

type Response = Either<InfraError | UserNotFound | InvalidCoordinate, VaccinationPoint[]>;

export class GetNearbyVaccinationPointsUseCase {
  private vaccintaionPointsRepository: IVaccinationPointsRepository;

  constructor(vaccintaionPointsRepository: IVaccinationPointsRepository) {
    this.vaccintaionPointsRepository = vaccintaionPointsRepository;
  }

  async execute(request: IGetNearbyVaccinationPointsDTO): Promise<Response> {
    const coordinateOrError = Coordinate.create(request.coordinate);

    if (coordinateOrError.isLeft()) {
      return left(coordinateOrError.value);
    }

    const vaccinationPointsOrError = await this.vaccintaionPointsRepository.findAllByApproximateCoordinate(
      coordinateOrError.value
    );

    if (vaccinationPointsOrError.isLeft()) {
      return left(vaccinationPointsOrError.value);
    }

    return right(vaccinationPointsOrError.value);
  }
}
