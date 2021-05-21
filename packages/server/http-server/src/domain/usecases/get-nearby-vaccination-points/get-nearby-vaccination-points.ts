import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidCoordinate } from '@entities/vaccination-point/errors';
import { Coordinate } from '@entities/vaccination-point/values';
import { Either, left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { IGetNearbyVaccinationPointsDTO } from './dto';

type Response = Either<InfraError | UserNotFound | InvalidCoordinate, VaccinationPoint[]>;

export class GetNearbyVaccinationPointsUseCase {
  private usersRepository: IUsersRepository;

  private vaccintaionPointsRepository: IVaccinationPointsRepository;

  constructor(usersRepository: IUsersRepository, vaccintaionPointsRepository: IVaccinationPointsRepository) {
    this.usersRepository = usersRepository;
    this.vaccintaionPointsRepository = vaccintaionPointsRepository;
  }

  async execute(request: IGetNearbyVaccinationPointsDTO): Promise<Response> {
    const doesUserExistsOrError = await this.usersRepository.findById(request.userId);

    if (doesUserExistsOrError.isLeft()) {
      return left(doesUserExistsOrError.value);
    }

    if (!doesUserExistsOrError.value) {
      return left(new UserNotFound());
    }

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
