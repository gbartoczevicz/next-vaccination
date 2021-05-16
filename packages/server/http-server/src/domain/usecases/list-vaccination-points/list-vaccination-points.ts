import { VaccinationPoint } from '@entities/vaccination-point';
import { Either, left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { IListVaccinationPointsDTO } from './dto';

type Response = Either<InfraError | UserNotFound, VaccinationPoint[]>;

export class ListVaccinationPointsUseCase {
  private usersRepository: IUsersRepository;

  private vaccintaionPointsRepository: IVaccinationPointsRepository;

  constructor(usersRepository: IUsersRepository, vaccintaionPointsRepository: IVaccinationPointsRepository) {
    this.usersRepository = usersRepository;
    this.vaccintaionPointsRepository = vaccintaionPointsRepository;
  }

  async execute(request: IListVaccinationPointsDTO): Promise<Response> {
    const doesUserExistsOrError = await this.usersRepository.findById(request.userId);

    if (doesUserExistsOrError.isLeft()) {
      return left(doesUserExistsOrError.value);
    }

    if (!doesUserExistsOrError.value) {
      return left(new UserNotFound());
    }

    const vaccinationPointsOrError = await this.vaccintaionPointsRepository.findAll();

    if (vaccinationPointsOrError.isLeft()) {
      return left(vaccinationPointsOrError.value);
    }

    return right(vaccinationPointsOrError.value);
  }
}
