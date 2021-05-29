import { Vaccine } from '@entities/vaccination-point';
import { InvalidVaccine } from '@entities/vaccination-point/errors';
import { Either, left, right } from '@server/shared';
import { VaccineNameAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IVaccinesRepository } from '@usecases/output-ports/repositories/vaccines';
import { ICreateVaccineDTO } from './dto';

type Response = Either<InvalidVaccine | InfraError | VaccineNameAlreadyInUse, Vaccine>;

export class CreateVaccineUseCase {
  private vaccinesRepository: IVaccinesRepository;

  constructor(vaccinesRepository: IVaccinesRepository) {
    this.vaccinesRepository = vaccinesRepository;
  }

  async execute(request: ICreateVaccineDTO): Promise<Response> {
    const vaccineToCreateOrError = Vaccine.create(request);

    if (vaccineToCreateOrError.isLeft()) {
      return left(vaccineToCreateOrError.value);
    }

    const vaccinetoCreate = vaccineToCreateOrError.value;

    const isVaccineNameAlreadyInUseOrError = await this.vaccinesRepository.findByName(vaccinetoCreate.name);

    if (isVaccineNameAlreadyInUseOrError.isLeft()) {
      return left(isVaccineNameAlreadyInUseOrError.value);
    }

    if (isVaccineNameAlreadyInUseOrError.value) {
      return left(new VaccineNameAlreadyInUse(vaccinetoCreate.name));
    }

    const savedVaccineOrError = await this.vaccinesRepository.save(vaccinetoCreate);

    if (savedVaccineOrError.isLeft()) {
      return left(savedVaccineOrError.value);
    }

    return right(savedVaccineOrError.value);
  }
}
