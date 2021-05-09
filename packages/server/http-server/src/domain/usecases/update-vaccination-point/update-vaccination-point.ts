import { CreateVaccinationPointErrors, VaccinationPoint } from '@entities/vaccination-point';
import { Either, EntityID, left, right } from '@server/shared';
import { DocumentAlreadyInUse, LocationAlreadyInUse, VaccinationPointNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { IUpdateVaccinationPointDTO } from './dto';

type Response = Either<
  InfraError | CreateVaccinationPointErrors | VaccinationPointNotFound | DocumentAlreadyInUse | LocationAlreadyInUse,
  VaccinationPoint
>;

export class UpdateVaccinationPointUseCase {
  private vaccinationPointsRepository: IVaccinationPointsRepository;

  constructor(vaccinationPointsRepository: IVaccinationPointsRepository) {
    this.vaccinationPointsRepository = vaccinationPointsRepository;
  }

  async execute(request: IUpdateVaccinationPointDTO): Promise<Response> {
    const toUpdateVaccinationPointOrError = VaccinationPoint.create({
      ...request,
      id: new EntityID(request.id)
    });

    if (toUpdateVaccinationPointOrError.isLeft()) {
      return left(toUpdateVaccinationPointOrError.value);
    }

    const toUpdateVaccinationPoint = toUpdateVaccinationPointOrError.value;

    const doesVaccinationPointExistsOrError = await this.vaccinationPointsRepository.findById(
      toUpdateVaccinationPoint.id.value
    );

    if (doesVaccinationPointExistsOrError.isLeft()) {
      return left(doesVaccinationPointExistsOrError.value);
    }

    if (!doesVaccinationPointExistsOrError.value) {
      return left(new VaccinationPointNotFound());
    }

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

    const { latitude, longitude } = toUpdateVaccinationPoint.location;

    const latitudeAndLongitudeAlreadyInUseOrError = await this.vaccinationPointsRepository.findByLatitudeAndLongitude(
      latitude,
      longitude
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

    const vaccinationPointUpdatedOrError = await this.vaccinationPointsRepository.save(toUpdateVaccinationPoint);

    if (vaccinationPointUpdatedOrError.isLeft()) {
      return left(vaccinationPointUpdatedOrError.value);
    }

    return right(vaccinationPointUpdatedOrError.value);
  }
}
