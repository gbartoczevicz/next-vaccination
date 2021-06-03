import { Appointment, Cancellation } from '@entities/appointment';
import { InvalidAppointment, InvalidCancellation } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { ICancellationsRepository } from '@usecases/output-ports/repositories/cancellations';
import { ICancelAppointment } from './dto';

type ResponseErrors =
  | InfraError
  | AppointmentIsAlreadyCancelled
  | AppointmentIsAlreadyConcluded
  | InvalidCancellation
  | InvalidAppointment;

type Response = Either<ResponseErrors, Appointment>;

export class CancelAppointmentUseCase {
  private appointmentsRepository: IAppointmentsRepository;

  private cancellationsRepository: ICancellationsRepository;

  constructor(appointmentsRepository: IAppointmentsRepository, cancellationsRepository: ICancellationsRepository) {
    this.appointmentsRepository = appointmentsRepository;
    this.cancellationsRepository = cancellationsRepository;
  }

  async execute(request: ICancelAppointment): Promise<Response> {
    const { appointment } = request;

    if (appointment.conclusion) {
      return left(new AppointmentIsAlreadyConcluded());
    }

    if (appointment.cancellation) {
      return left(new AppointmentIsAlreadyCancelled());
    }

    const cancellationToCreateOrError = Cancellation.create(request);

    if (cancellationToCreateOrError.isLeft()) {
      return left(cancellationToCreateOrError.value);
    }

    const savedCancellationOrError = await this.cancellationsRepository.save(cancellationToCreateOrError.value);

    if (savedCancellationOrError.isLeft()) {
      return left(savedCancellationOrError.value);
    }

    const savedCancellation = savedCancellationOrError.value;

    const appointmentToUpdateOrError = Appointment.create({
      ...appointment,
      cancellation: savedCancellation
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
