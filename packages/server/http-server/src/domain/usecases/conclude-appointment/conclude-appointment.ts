import { Appointment } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { InvalidAppointment, InvalidConclusion } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { IConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { IConcludeAppointmentDTO } from './dto';

type ResponseErrors =
  | InfraError
  | AppointmentIsAlreadyCancelled
  | AppointmentIsAlreadyConcluded
  | InvalidConclusion
  | InvalidAppointment;

type Response = Either<ResponseErrors, Appointment>;

export class ConcludeAppointmentUseCase {
  private appointmentsRepository: IAppointmentsRepository;

  private conclusionsRepository: IConclusionsRepository;

  constructor(appointmentsRepository: IAppointmentsRepository, conclusionsRepository: IConclusionsRepository) {
    this.appointmentsRepository = appointmentsRepository;
    this.conclusionsRepository = conclusionsRepository;
  }

  async execute(request: IConcludeAppointmentDTO): Promise<Response> {
    const { appointment, ...toCreateConclusionProps } = request;

    if (appointment.cancellation) {
      return left(new AppointmentIsAlreadyCancelled());
    }

    if (appointment.conclusion) {
      return left(new AppointmentIsAlreadyConcluded());
    }

    const conclusionToCreateOrError = Conclusion.create(toCreateConclusionProps);

    if (conclusionToCreateOrError.isLeft()) {
      return left(conclusionToCreateOrError.value);
    }

    const savedConclusionOrError = await this.conclusionsRepository.save(conclusionToCreateOrError.value);

    if (savedConclusionOrError.isLeft()) {
      return left(savedConclusionOrError.value);
    }

    const appointmentToUpdateOrError = Appointment.create({
      ...appointment,
      conclusion: savedConclusionOrError.value
    });

    if (appointmentToUpdateOrError.isLeft()) {
      return left(appointmentToUpdateOrError.value);
    }

    const updatedAppointmentOrError = await this.appointmentsRepository.save(appointmentToUpdateOrError.value);

    if (updatedAppointmentOrError.isLeft()) {
      return left(updatedAppointmentOrError.value);
    }

    return right(updatedAppointmentOrError.value);
  }
}
