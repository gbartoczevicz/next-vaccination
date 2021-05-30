import { HealthProfessional } from '@entities/health-professional';
import { Either, left, right } from '@server/shared';
import { HealthProfessionalNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { IGetHealthProfessionalDTO } from './dto';

type Response = Either<InfraError | HealthProfessionalNotFound, HealthProfessional>;

export class GetHealthProfessionalUseCase {
  private healthProfessionalsRepository: IHealthProfessionalsRepository;

  constructor(healthProfessionalsRepository: IHealthProfessionalsRepository) {
    this.healthProfessionalsRepository = healthProfessionalsRepository;
  }

  async execute(request: IGetHealthProfessionalDTO): Promise<Response> {
    const doesHealthProfessionalExistsOrError = await this.healthProfessionalsRepository.findByUser(request.user);

    if (doesHealthProfessionalExistsOrError.isLeft()) {
      return left(doesHealthProfessionalExistsOrError.value);
    }

    if (!doesHealthProfessionalExistsOrError.value) {
      return left(new HealthProfessionalNotFound());
    }

    return right(doesHealthProfessionalExistsOrError.value);
  }
}
