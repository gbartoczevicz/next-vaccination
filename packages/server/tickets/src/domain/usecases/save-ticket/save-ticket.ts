import { Patient } from '@entities/patient';
import { InvalidPatient } from '@entities/patient/errors';
import { Either, left, right } from '@server/shared';
import { TicketIsRequired } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IPatientsRepository } from '@usecases/output-ports/repositories/patients';
import { ISaveTicketDTO } from './dto';

type Response = Either<TicketIsRequired | InvalidPatient | InfraError, Patient>;

export class SaveTicketUseCase {
  private patientsRepository: IPatientsRepository;

  constructor(patientsRepository: IPatientsRepository) {
    this.patientsRepository = patientsRepository;
  }

  async execute(dto: ISaveTicketDTO): Promise<Response> {
    if (!dto.ticket) {
      return left(new TicketIsRequired());
    }

    const { patient, ticket } = dto;

    const patientToSaveOrError = Patient.create({
      id: patient.id,
      user: patient.user,
      avatar: patient.avatar,
      ticket
    });

    if (patientToSaveOrError.isLeft()) {
      return left(patientToSaveOrError.value);
    }

    const savedPatientOrError = await this.patientsRepository.save(patientToSaveOrError.value);

    if (savedPatientOrError.isLeft()) {
      return left(savedPatientOrError.value);
    }

    return right(savedPatientOrError.value);
  }
}
