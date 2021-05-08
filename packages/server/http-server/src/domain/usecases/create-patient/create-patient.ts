import { Patient, CreatePatientErrors } from '@entities/patient';
import { Either, left, right } from '@server/shared';
import { DocumentAlreadyInUse } from '@usecases/errors/document-already-in-use';
import { InfraError } from '@usecases/output-ports/errors';
import { IPatientsRepository } from '@usecases/output-ports/repositories/patients';
import { ICreatePatientDTO } from './dto';

type Response = Either<DocumentAlreadyInUse | CreatePatientErrors | InfraError, Patient>;

export class CreatePatientUseCase {
  private patientsRepository: IPatientsRepository;

  constructor(patientsReposiory: IPatientsRepository) {
    this.patientsRepository = patientsReposiory;
  }

  async execute(request: ICreatePatientDTO): Promise<Response> {
    const patientOrError = Patient.create(request);

    if (patientOrError.isLeft()) {
      return left(patientOrError.value);
    }

    const patient = patientOrError.value;

    const doesDocumentAlreadyInUseOrError = await this.patientsRepository.findByDocument(patient.document);

    if (doesDocumentAlreadyInUseOrError.isLeft()) {
      return left(doesDocumentAlreadyInUseOrError.value);
    }

    const doesDocumentAlreadyInUse = doesDocumentAlreadyInUseOrError.value;

    if (doesDocumentAlreadyInUse) {
      return left(new DocumentAlreadyInUse());
    }

    const savedPatientOrError = await this.patientsRepository.save(patient);

    if (savedPatientOrError.isLeft()) {
      return left(savedPatientOrError.value);
    }

    return right(patient);
  }
}
