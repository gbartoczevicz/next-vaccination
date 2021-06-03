import { VaccineBatch } from '@entities/vaccination-point';
import { InvalidExpirationDate, InvalidVaccineBatch } from '@entities/vaccination-point/errors';
import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { IUpdateVaccineBatchDTO } from './dto';

type ResponseErrors = InvalidVaccineBatch | InvalidExpirationDate | InfraError;

type Response = Either<ResponseErrors, VaccineBatch>;

export class UpdateVaccineBatchUseCase {
  private vacineBatchesRepository: IVaccineBatchesRepository;

  constructor(vacineBatchesRepository: IVaccineBatchesRepository) {
    this.vacineBatchesRepository = vacineBatchesRepository;
  }

  async execute(request: IUpdateVaccineBatchDTO): Promise<Response> {
    const { vaccineBatch, ...toUpdateProps } = request;

    const toUpdateVaccineBatchOrError = VaccineBatch.create({
      id: vaccineBatch.id,
      vaccinationPoint: vaccineBatch.vaccinationPoint,
      vaccine: vaccineBatch.vaccine,
      ...toUpdateProps
    });

    if (toUpdateVaccineBatchOrError.isLeft()) {
      return left(toUpdateVaccineBatchOrError.value);
    }

    const updatedVaccineBatchOrError = await this.vacineBatchesRepository.save(toUpdateVaccineBatchOrError.value);

    if (updatedVaccineBatchOrError.isLeft()) {
      return left(updatedVaccineBatchOrError.value);
    }

    return right(updatedVaccineBatchOrError.value);
  }
}
