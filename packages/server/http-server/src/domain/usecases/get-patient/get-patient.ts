import { Patient } from '@entities/patient';
import { Either, left, right } from '@server/shared';
import { PatientNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IPatientsRepository } from '@usecases/output-ports/repositories/patients';
import { IGetPatientDTO } from './dto';

type Response = Either<InfraError | PatientNotFound, Patient>;

export class GetPatientUseCase {
  private patientsRepository: IPatientsRepository;

  constructor(patientsRepository: IPatientsRepository) {
    this.patientsRepository = patientsRepository;
  }

  async execute(request: IGetPatientDTO): Promise<Response> {
    const doesPatientExistsOrError = await this.patientsRepository.findByUser(request.user);

    if (doesPatientExistsOrError.isLeft()) {
      return left(doesPatientExistsOrError.value);
    }

    if (!doesPatientExistsOrError.value) {
      return left(new PatientNotFound());
    }

    return right(doesPatientExistsOrError.value);
  }
}
