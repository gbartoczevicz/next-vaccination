import { CreateVaccinationPointErrors, VaccinationPoint } from '@entities/vaccination-point';
import { Either, left, right } from '@server/shared';
import {
  DocumentAlreadyInUse,
  LocationAlreadyInUse,
  PhoneAlreadyInUse,
  VaccinationPointNotFound
} from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { IUpdateVaccinationPointDTO } from './dto';

type ResponseErrors =
  | InfraError
  | CreateVaccinationPointErrors
  | VaccinationPointNotFound
  | DocumentAlreadyInUse
  | LocationAlreadyInUse
  | PhoneAlreadyInUse;

type Response = Either<ResponseErrors, VaccinationPoint>;

export class UpdateVaccinationPointUseCase {
  private vaccinationPointsRepository: IVaccinationPointsRepository;

  constructor(vaccinationPointsRepository: IVaccinationPointsRepository) {
    this.vaccinationPointsRepository = vaccinationPointsRepository;
  }

  async execute(request: IUpdateVaccinationPointDTO): Promise<Response> {
    const { vaccinationPoint, ...toUpdateProps } = request;

    const toUpdateVaccinationPointOrError = VaccinationPoint.create({
      ...toUpdateProps,
      id: vaccinationPoint.id,
      availability: vaccinationPoint.availability
    });

    if (toUpdateVaccinationPointOrError.isLeft()) {
      return left(toUpdateVaccinationPointOrError.value);
    }

    const toUpdateVaccinationPoint = toUpdateVaccinationPointOrError.value;

    const documentAlreadyInUseOrError = await this.vaccinationPointsRepository.findByDocument(
      toUpdateVaccinationPoint.document
    );

    if (documentAlreadyInUseOrError.isLeft()) {
      return left(documentAlreadyInUseOrError.value);
    }

    if (documentAlreadyInUseOrError.value) {
      const documentAlreadyInUse = documentAlreadyInUseOrError.value;

      if (!documentAlreadyInUse.id.equals(toUpdateVaccinationPoint.id)) {
        return left(new DocumentAlreadyInUse());
      }
    }

    const latitudeAndLongitudeAlreadyInUseOrError = await this.vaccinationPointsRepository.findByCoordinate(
      toUpdateVaccinationPoint.location.coordinate
    );

    if (latitudeAndLongitudeAlreadyInUseOrError.isLeft()) {
      return left(latitudeAndLongitudeAlreadyInUseOrError.value);
    }

    if (latitudeAndLongitudeAlreadyInUseOrError.value) {
      const latitudeAndLongitudeAlreadyInUse = latitudeAndLongitudeAlreadyInUseOrError.value;

      if (!latitudeAndLongitudeAlreadyInUse.id.equals(toUpdateVaccinationPoint.id)) {
        return left(new LocationAlreadyInUse());
      }
    }

    const doesPhoneAlreadyInUseOrError = await this.vaccinationPointsRepository.findByPhone(
      toUpdateVaccinationPoint.phone
    );

    if (doesPhoneAlreadyInUseOrError.isLeft()) {
      return left(doesPhoneAlreadyInUseOrError.value);
    }

    if (doesPhoneAlreadyInUseOrError.value) {
      const doesPhoneAlreadyInUse = doesPhoneAlreadyInUseOrError.value;

      if (!doesPhoneAlreadyInUse.id.equals(toUpdateVaccinationPoint.id)) {
        return left(new PhoneAlreadyInUse());
      }
    }

    const vaccinationPointUpdatedOrError = await this.vaccinationPointsRepository.save(toUpdateVaccinationPoint);

    if (vaccinationPointUpdatedOrError.isLeft()) {
      return left(vaccinationPointUpdatedOrError.value);
    }

    return right(vaccinationPointUpdatedOrError.value);
  }
}
