import { CreatePatientErrors, Patient } from '@entities/patient';
import { Either, left, right } from '@server/shared';
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
    const { patient } = request;

    const patientToUpdateOrError = Patient.create({
      ...request,
      id: patient.id,
      user: patient.user,
      avatar: patient.avatar,
      ticket: patient.ticket
    });

    if (patientToUpdateOrError.isLeft()) {
      return left(patientToUpdateOrError.value);
    }

    const patientToUpdate = patientToUpdateOrError.value;

    const doesDocumentAlreadyInUseOrError = await this.patientsRepository.findByDocument(patientToUpdate.document);

    if (doesDocumentAlreadyInUseOrError.isLeft()) {
      return left(doesDocumentAlreadyInUseOrError.value);
    }

    const doesDocumentAlreadyInUse = doesDocumentAlreadyInUseOrError.value;

    if (doesDocumentAlreadyInUse && !doesDocumentAlreadyInUse.id.equals(patientToUpdate.id)) {
      return left(new DocumentAlreadyInUse());
    }

    const updatedPatientOrError = await this.patientsRepository.save(patientToUpdate);

    if (updatedPatientOrError.isLeft()) {
      return left(updatedPatientOrError.value);
    }

    return right(updatedPatientOrError.value);
  }
}
