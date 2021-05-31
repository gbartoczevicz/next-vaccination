import { Appointment } from '@entities/appointment';
import { InvalidAppointment } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import { VaccinationPointWithoutAvailability } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { ICreateAppointmentDTO } from './dto';

type ResponseErrors = InfraError | InvalidAppointment | VaccinationPointWithoutAvailability;

type Response = Either<ResponseErrors, Appointment>;

/**
 * @todo Check vaccination point's vaccine batches'
 * stock and it's expiration date before creating
 * a new appointment
 */
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

    const appointmentsAlreadyCreatedOrError = await this.appointmentsRepository.findAllByVaccinationPointAndDate(
      appointment.vaccinationPoint,
      appointment.date
    );

    if (appointmentsAlreadyCreatedOrError.isLeft()) {
      return left(appointmentsAlreadyCreatedOrError.value);
    }

    const appointmentsAlreadyCreated = appointmentsAlreadyCreatedOrError.value;

    if (appointmentsAlreadyCreated.length > appointment.vaccinationPoint.availability) {
      return left(new VaccinationPointWithoutAvailability());
    }

    const appointmentCreatedOrError = await this.appointmentsRepository.save(appointment);

    if (appointmentCreatedOrError.isLeft()) {
      return left(appointmentCreatedOrError.value);
    }

    return right(appointmentCreatedOrError.value);
  }
}
