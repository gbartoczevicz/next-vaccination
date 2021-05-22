/* eslint-disable max-len */
import { AvailabilityByPeriod } from '@entities/vaccination-point/availability-by-period';
import { InvalidAvailabilityByPeriod } from '@entities/vaccination-point/errors';
import { Either, left, right } from '@server/shared';
import {
  HealthProfessionalNotFound,
  UserNotFound,
  VaccinationPointNotFound,
  NotResponsible,
  DoesNotBelongToTheVaccinationPoint,
  AvailabilityByPeriodAlreadyExists
} from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IAvailabilityByPeriodRepository } from '@usecases/output-ports/repositories/availability-by-period';
import { IHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { ICreateAvailabilityByPeriodDTO } from './dto';

type Response = Either<
  | InfraError
  | UserNotFound
  | HealthProfessionalNotFound
  | VaccinationPointNotFound
  | DoesNotBelongToTheVaccinationPoint
  | NotResponsible
  | InvalidAvailabilityByPeriod
  | AvailabilityByPeriodAlreadyExists,
  AvailabilityByPeriod
>;

export class CreateAvailabilityByPeriodUseCase {
  private availabilityByPeriodRepository: IAvailabilityByPeriodRepository;

  private healthProfessionalsRepository: IHealthProfessionalsRepository;

  private usersRepository: IUsersRepository;

  private vaccinationPointsRepository: IVaccinationPointsRepository;

  constructor(
    availabilityByPeriodRepository: IAvailabilityByPeriodRepository,
    healthProfessionalsRepository: IHealthProfessionalsRepository,
    usersRepository: IUsersRepository,
    vaccinationPointsRepository: IVaccinationPointsRepository
  ) {
    this.availabilityByPeriodRepository = availabilityByPeriodRepository;
    this.healthProfessionalsRepository = healthProfessionalsRepository;
    this.usersRepository = usersRepository;
    this.vaccinationPointsRepository = vaccinationPointsRepository;
  }

  async execute(request: ICreateAvailabilityByPeriodDTO): Promise<Response> {
    const userExistsOrError = await this.usersRepository.findById(request.userId);

    if (userExistsOrError.isLeft()) {
      return left(userExistsOrError.value);
    }

    if (!userExistsOrError.value) {
      return left(new UserNotFound());
    }

    const vaccinationPointResponsibleExistsOrError = await this.healthProfessionalsRepository.findByUser(
      userExistsOrError.value
    );

    if (vaccinationPointResponsibleExistsOrError.isLeft()) {
      return left(vaccinationPointResponsibleExistsOrError.value);
    }

    if (!vaccinationPointResponsibleExistsOrError.value) {
      return left(new HealthProfessionalNotFound());
    }

    const healthProfessional = vaccinationPointResponsibleExistsOrError.value;

    const vaccinationPointExistsOrError = await this.vaccinationPointsRepository.findById(request.vaccinationPointId);

    if (vaccinationPointExistsOrError.isLeft()) {
      return left(vaccinationPointExistsOrError.value);
    }

    if (!vaccinationPointExistsOrError.value) {
      return left(new VaccinationPointNotFound());
    }

    const vaccinationPoint = vaccinationPointExistsOrError.value;

    if (!healthProfessional.vaccinationPoint.id.equals(vaccinationPoint.id)) {
      return left(new DoesNotBelongToTheVaccinationPoint());
    }

    if (!healthProfessional.responsible) {
      return left(new NotResponsible());
    }

    const availabilityByPeriodToSaveOrError = AvailabilityByPeriod.create({
      ...request,
      vaccinationPoint
    });

    if (availabilityByPeriodToSaveOrError.isLeft()) {
      return left(availabilityByPeriodToSaveOrError.value);
    }

    const availabilityByPeriodRepositoryAlreadyExistsOrError = await this.availabilityByPeriodRepository.findByVaccinationPoint(
      vaccinationPoint
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
