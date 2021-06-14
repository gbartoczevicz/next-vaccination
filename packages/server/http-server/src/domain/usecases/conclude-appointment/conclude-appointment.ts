import { Conclusion } from '@entities/appointment/conclusion';
import { InvalidAppointment, InvalidConclusion } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { ICancellationsRepository } from '@usecases/output-ports/repositories/cancellations';
import { IConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { IConcludeAppointmentDTO } from './dto';

type ResponseErrors =
  | InfraError
  | AppointmentIsAlreadyCancelled
  | AppointmentIsAlreadyConcluded
  | InvalidConclusion
  | InvalidAppointment;

type Response = Either<ResponseErrors, Conclusion>;

export class ConcludeAppointmentUseCase {
  private conclusionsRepository: IConclusionsRepository;

  private cancellationsRepository: ICancellationsRepository;

  constructor(conclusionsRepository: IConclusionsRepository, cancellationsRepository: ICancellationsRepository) {
    this.conclusionsRepository = conclusionsRepository;
    this.cancellationsRepository = cancellationsRepository;
  }

  async execute(request: IConcludeAppointmentDTO): Promise<Response> {
    const { appointment, ...toCreateConclusionProps } = request;

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

    const conclusionToCreateOrError = Conclusion.create({
      appointment,
      ...toCreateConclusionProps
    });

    if (conclusionToCreateOrError.isLeft()) {
      return left(conclusionToCreateOrError.value);
    }

    const savedConclusionOrError = await this.conclusionsRepository.save(conclusionToCreateOrError.value);

    if (savedConclusionOrError.isLeft()) {
      return left(savedConclusionOrError.value);
    }

    return right(savedConclusionOrError.value);
  }
}
