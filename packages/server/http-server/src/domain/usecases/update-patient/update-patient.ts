import { CreatePatientErrors, Patient } from '@entities/patient';
import { Either, EntityID, left, right } from '@server/shared';
import { DocumentAlreadyInUse, PatientNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IPatientsRepository } from '@usecases/output-ports/repositories/patients';
import { IUpdatePatientDTO } from './dto';

type Request = Either<InfraError | PatientNotFound | DocumentAlreadyInUse | CreatePatientErrors, Patient>;

export class UpdatePatientUseCase {
  private patientsRepository: IPatientsRepository;

  constructor(patientsRepository: IPatientsRepository) {
    this.patientsRepository = patientsRepository;
  }

  async execute(request: IUpdatePatientDTO): Promise<Request> {
    const { id, user, document, birthday } = request;

    const persistedPatientOrError = await this.patientsRepository.findById(id);

    if (persistedPatientOrError.isLeft()) {
      return left(persistedPatientOrError.value);
    }

    if (!persistedPatientOrError.value) {
      return left(new PatientNotFound());
    }

    const persistedPatient = persistedPatientOrError.value;

    const toUpdatePatientOrError = Patient.create({
      id: new EntityID(id),
      user,
      document,
      birthday,
      avatar: persistedPatient.avatar
    });

    if (toUpdatePatientOrError.isLeft()) {
      return left(toUpdatePatientOrError.value);
    }

    const toUpdatePatient = toUpdatePatientOrError.value;

    const doesDocumentAlreadyInUseOrError = await this.patientsRepository.findByDocument(document);

    if (doesDocumentAlreadyInUseOrError.isLeft()) {
      return left(doesDocumentAlreadyInUseOrError.value);
    }

    const doesDocumentAlreadyInUse = doesDocumentAlreadyInUseOrError.value;

    if (doesDocumentAlreadyInUse) {
      return left(new DocumentAlreadyInUse());
    }

    const updatedPatientOrError = await this.patientsRepository.save(toUpdatePatient);

    if (updatedPatientOrError.isLeft()) {
      return left(updatedPatientOrError.value);
    }

    return right(updatedPatientOrError.value);
  }
}
