import { VaccineBatch } from '@entities/vaccination-point';
import { InvalidExpirationDate, InvalidVaccineBatch } from '@entities/vaccination-point/errors';
import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { ICreateVaccineBatchDTO } from './dto';

type ResponseErrors = InfraError | InvalidExpirationDate | InvalidVaccineBatch;

type Response = Either<ResponseErrors, VaccineBatch>;

export class CreateVaccineBatchUseCase {
  private vaccineBatchesRepository: IVaccineBatchesRepository;

  constructor(vaccineBatchesRepository: IVaccineBatchesRepository) {
    this.vaccineBatchesRepository = vaccineBatchesRepository;
  }

  async execute(request: ICreateVaccineBatchDTO): Promise<Response> {
    const vaccineBatchToCreateOrError = VaccineBatch.create(request);

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
