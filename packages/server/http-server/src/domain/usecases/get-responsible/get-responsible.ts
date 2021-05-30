import { HealthProfessional } from '@entities/health-professional';
import { Either, left, right } from '@server/shared';
import { ResponsibleNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { IGetResponsibleDTO } from './dto';

type Response = Either<InfraError | ResponsibleNotFound, HealthProfessional>;

export class GetResponsibleUseCase {
  private healthProfessionalsRepository: IHealthProfessionalsRepository;

  constructor(healthProfessionalsRepository: IHealthProfessionalsRepository) {
    this.healthProfessionalsRepository = healthProfessionalsRepository;
  }

  async execute(request: IGetResponsibleDTO): Promise<Response> {
    const doesResponsibleExistsOrError = await this.healthProfessionalsRepository.findByUserAndIsResponsible(
      request.user
    );

    if (doesResponsibleExistsOrError.isLeft()) {
      return left(doesResponsibleExistsOrError.value);
    }

    if (!doesResponsibleExistsOrError.value) {
      return left(new ResponsibleNotFound());
    }

    return right(doesResponsibleExistsOrError.value);
  }
}
