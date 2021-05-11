/* eslint-disable max-len */
import { HealthProfessional } from '@entities/health-professional';
import { InvalidHealthProfessional } from '@entities/health-professional/errors';
import { Either, left, right } from '@server/shared';
import { HealthProfessionalNotFound } from '@usecases/errors';
import { VaccinationPointAlreadyHaveResponsible } from '@usecases/errors/vaccination-point-already-have-responsible';
import { InfraError } from '@usecases/output-ports/errors';
import { IHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { ISetHealthProfessionalAsResponsibleDTO } from './dto';

type Response = Either<
  InfraError | HealthProfessionalNotFound | VaccinationPointAlreadyHaveResponsible | InvalidHealthProfessional,
  HealthProfessional
>;

export class SetHealthProfessionalAsResponsibleUseCase {
  private healthProfessionalsRepository: IHealthProfessionalsRepository;

  constructor(healthProfessionalsRepository: IHealthProfessionalsRepository) {
    this.healthProfessionalsRepository = healthProfessionalsRepository;
  }

  async execute(request: ISetHealthProfessionalAsResponsibleDTO): Promise<Response> {
    const toSetResponsibleOrError = await this.healthProfessionalsRepository.findById(request.healthProfessionalId);

    if (toSetResponsibleOrError.isLeft()) {
      return left(toSetResponsibleOrError.value);
    }

    if (!toSetResponsibleOrError.value) {
      return left(new HealthProfessionalNotFound());
    }

    const toSetResponsible = toSetResponsibleOrError.value;

    const vaccinationPointAlreadyHaveAResponsibleOrError = await this.healthProfessionalsRepository.findByVaccinationPointIdAndIsResponsible(
      toSetResponsible.vaccinationPoint.id.value
    );

    if (vaccinationPointAlreadyHaveAResponsibleOrError.isLeft()) {
      return left(vaccinationPointAlreadyHaveAResponsibleOrError.value);
    }

    if (vaccinationPointAlreadyHaveAResponsibleOrError.value) {
      return left(new VaccinationPointAlreadyHaveResponsible());
    }

    const toUpdateNewReponsibleOrError = HealthProfessional.create({
      ...toSetResponsible,
      responsible: true
    });

    if (toUpdateNewReponsibleOrError.isLeft()) {
      return left(toUpdateNewReponsibleOrError.value);
    }

    const updatedNewResponsibleOrError = await this.healthProfessionalsRepository.save(
      toUpdateNewReponsibleOrError.value
    );

    if (updatedNewResponsibleOrError.isLeft()) {
      return left(updatedNewResponsibleOrError.value);
    }

    return right(updatedNewResponsibleOrError.value);
  }
}
