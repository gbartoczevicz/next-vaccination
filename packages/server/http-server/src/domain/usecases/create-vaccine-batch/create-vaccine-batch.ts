import { VaccineBatch } from '@entities/vaccination-point';
import { InvalidExpirationDate, InvalidVaccineBatch } from '@entities/vaccination-point/errors';
import { Either, left, right } from '@server/shared';
import { VaccineNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { IVaccinesRepository } from '@usecases/output-ports/repositories/vaccines';
import { ICreateVaccineBatchDTO } from './dto';

type ResponseErrors = InfraError | VaccineNotFound | InvalidExpirationDate | InvalidVaccineBatch;

type Response = Either<ResponseErrors, VaccineBatch>;

export class CreateVaccineBatchUseCase {
  private vaccineBatchesRepository: IVaccineBatchesRepository;

  private vaccinesRepotitory: IVaccinesRepository;

  constructor(vaccineBatchesRepository: IVaccineBatchesRepository, vaccinesRepotitory: IVaccinesRepository) {
    this.vaccineBatchesRepository = vaccineBatchesRepository;
    this.vaccinesRepotitory = vaccinesRepotitory;
  }

  async execute(request: ICreateVaccineBatchDTO): Promise<Response> {
    const vaccineExistsOrError = await this.vaccinesRepotitory.findById(request.vaccineId);

    if (vaccineExistsOrError.isLeft()) {
      return left(vaccineExistsOrError.value);
    }

    if (!vaccineExistsOrError.value) {
      return left(new VaccineNotFound());
    }

    const { vaccinationPoint } = request.healthProfessional;

    const vaccineBatchToCreateOrError = VaccineBatch.create({
      ...request,
      vaccine: vaccineExistsOrError.value,
      vaccinationPoint
    });

    if (vaccineBatchToCreateOrError.isLeft()) {
      return left(vaccineBatchToCreateOrError.value);
    }

    const savedVaccineBatchOrError = await this.vaccineBatchesRepository.save(vaccineBatchToCreateOrError.value);

    if (savedVaccineBatchOrError.isLeft()) {
      return left(savedVaccineBatchOrError.value);
    }

    return right(savedVaccineBatchOrError.value);
  }
}
