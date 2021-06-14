import { Cancellation } from '@entities/appointment';
import { InvalidAppointment, InvalidCancellation } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { ICancellationsRepository } from '@usecases/output-ports/repositories/cancellations';
import { IConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { ICancelAppointment } from './dto';

type ResponseErrors =
  | InfraError
  | AppointmentIsAlreadyCancelled
  | AppointmentIsAlreadyConcluded
  | InvalidCancellation
  | InvalidAppointment;

type Response = Either<ResponseErrors, Cancellation>;

export class CancelAppointmentUseCase {
  private cancellationsRepository: ICancellationsRepository;

  private conclusionsRepository: IConclusionsRepository;

  constructor(conclusionsRepository: IConclusionsRepository, cancellationsRepository: ICancellationsRepository) {
    this.conclusionsRepository = conclusionsRepository;
    this.cancellationsRepository = cancellationsRepository;
  }

  async execute(request: ICancelAppointment): Promise<Response> {
    const { appointment } = request;

    const appointmentAlreadyConcludedOrError = await this.conclusionsRepository.findByAppointment(appointment);

    if (appointmentAlreadyConcludedOrError.isLeft()) {
      return left(appointmentAlreadyConcludedOrError.value);
    }

    if (appointmentAlreadyConcludedOrError.value) {
      return left(new AppointmentIsAlreadyConcluded());
    }

    const appointmentAlreadyCancelledOrError = await this.cancellationsRepository.findByAppointment(appointment);

    if (appointmentAlreadyCancelledOrError.isLeft()) {
      return left(appointmentAlreadyCancelledOrError.value);
    }

    if (appointmentAlreadyCancelledOrError.value) {
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

    return right(savedCancellationOrError.value);
  }
}
