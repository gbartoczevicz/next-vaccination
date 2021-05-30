import { Appointment } from '@entities/appointment';
import { InvalidAppointment } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { ICreateAppointmentDTO } from './dto';

type Response = Either<InfraError | InvalidAppointment, Appointment>;

export class CreateAppointmentUseCase {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(appointmentsRepository: IAppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  async execute(request: ICreateAppointmentDTO): Promise<Response> {
    const appointmentOrError = Appointment.create(request);

    if (appointmentOrError.isLeft()) {
      return left(appointmentOrError.value);
    }

    const appointment = appointmentOrError.value;

    const appointmentCreatedOrError = await this.appointmentsRepository.save(appointment);

    if (appointmentCreatedOrError.isLeft()) {
      return left(appointmentCreatedOrError.value);
    }

    return right(appointmentCreatedOrError.value);
  }
}
