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

  async execute(dto: IGetPatientDTO): Promise<Response> {
    const patientFoundOrError = await this.patientsRepository.findById(dto.id);

    if (patientFoundOrError.isLeft()) {
      return left(patientFoundOrError.value);
    }

    const patientFound = patientFoundOrError.value;

    if (!patientFound) {
      return left(new PatientNotFound());
    }

    return right(patientFound);
  }
}
