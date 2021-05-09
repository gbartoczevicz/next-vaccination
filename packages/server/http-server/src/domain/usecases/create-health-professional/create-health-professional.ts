import { HealthProfessional } from '@entities/health-professional';
import { InvalidHealthProfessional } from '@entities/health-professional/errors';
import { Either, left, right } from '@server/shared';
import { DocumentAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { ICreateHealthProfessionalDTO } from './dto';

type Response = Either<InfraError | DocumentAlreadyInUse | InvalidHealthProfessional, HealthProfessional>;

export class CreateHealthProfessionalUseCase {
  private healthProfessionalsRepository: IHealthProfessionalsRepository;

  constructor(healthProfessionalsRepository: IHealthProfessionalsRepository) {
    this.healthProfessionalsRepository = healthProfessionalsRepository;
  }

  async execute(request: ICreateHealthProfessionalDTO): Promise<Response> {
    const toCreatehealthProfessionalOrError = HealthProfessional.create(request);

    if (toCreatehealthProfessionalOrError.isLeft()) {
      return left(toCreatehealthProfessionalOrError.value);
    }

    const toCreatehealthProfessional = toCreatehealthProfessionalOrError.value;

    const documentAlreadyInUseOrError = await this.healthProfessionalsRepository.findByDocument(
      toCreatehealthProfessional.document
    );

    if (documentAlreadyInUseOrError.isLeft()) {
      return left(documentAlreadyInUseOrError.value);
    }

    if (documentAlreadyInUseOrError.value) {
      return left(new DocumentAlreadyInUse());
    }

    const createdHealthProfessionalOrError = await this.healthProfessionalsRepository.save(toCreatehealthProfessional);

    if (createdHealthProfessionalOrError.isLeft()) {
      return left(createdHealthProfessionalOrError.value);
    }

    return right(createdHealthProfessionalOrError.value);
  }
}
