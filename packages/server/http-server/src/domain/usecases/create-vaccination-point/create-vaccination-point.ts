import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { CreateVaccinationPointErrors, VaccinationPoint } from '@entities/vaccination-point';
import { DocumentAlreadyInUse, LocationAlreadyInUse, PhoneAlreadyInUse } from '@usecases/errors';
import { ICreateVaccinationPointDTO } from './dto';

type Response = Either<
  InfraError | CreateVaccinationPointErrors | DocumentAlreadyInUse | LocationAlreadyInUse | PhoneAlreadyInUse,
  VaccinationPoint
>;

export class CreateVaccinationPointUseCase {
  private vaccinationPointsRepository: IVaccinationPointsRepository;

  constructor(vaccinationPointsRepository: IVaccinationPointsRepository) {
    this.vaccinationPointsRepository = vaccinationPointsRepository;
  }

  async execute(request: ICreateVaccinationPointDTO): Promise<Response> {
    const vaccinationPointOrError = VaccinationPoint.create(request);

    if (vaccinationPointOrError.isLeft()) {
      return left(vaccinationPointOrError.value);
    }

    const vaccinationPoint = vaccinationPointOrError.value;

    const documentAlreadyInUseOrError = await this.vaccinationPointsRepository.findByDocument(
      vaccinationPoint.document
    );

    if (documentAlreadyInUseOrError.isLeft()) {
      return left(documentAlreadyInUseOrError.value);
    }

    if (documentAlreadyInUseOrError.value) {
      return left(new DocumentAlreadyInUse());
    }

    const latitudeAndLongitudeAlreadyInUseOrError = await this.vaccinationPointsRepository.findByCoordinate(
      vaccinationPoint.location.coordinate
    );

    if (latitudeAndLongitudeAlreadyInUseOrError.isLeft()) {
      return left(latitudeAndLongitudeAlreadyInUseOrError.value);
    }

    if (latitudeAndLongitudeAlreadyInUseOrError.value) {
      return left(new LocationAlreadyInUse());
    }

    const phoneAlreadyInUseOrError = await this.vaccinationPointsRepository.findByPhone(vaccinationPoint.phone);

    if (phoneAlreadyInUseOrError.isLeft()) {
      return left(phoneAlreadyInUseOrError.value);
    }

    if (phoneAlreadyInUseOrError.value) {
      return left(new PhoneAlreadyInUse());
    }

    const vaccinationPointCreatedOrError = await this.vaccinationPointsRepository.save(vaccinationPoint);

    if (vaccinationPointCreatedOrError.isLeft()) {
      return left(vaccinationPointCreatedOrError.value);
    }

    return right(vaccinationPointCreatedOrError.value);
  }
}
