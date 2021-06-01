/* eslint-disable max-len */
import { Appointment } from '@entities/appointment';
import { InvalidAppointment } from '@entities/appointment/errors';
import { VaccineBatch } from '@entities/vaccination-point';
import { Either, left, right } from '@server/shared';
import {
  HasNotAvailableVaccineBatches,
  VaccinationPointWithoutAvailability,
  WithoutVaccineBatchesWithinExpirationDate
} from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { IVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { ICreateAppointmentDTO } from './dto';

type ResponseErrors =
  | InfraError
  | InvalidAppointment
  | VaccinationPointWithoutAvailability
  | WithoutVaccineBatchesWithinExpirationDate
  | HasNotAvailableVaccineBatches;

type Response = Either<ResponseErrors, Appointment>;

export class CreateAppointmentUseCase {
  private appointmentsRepository: IAppointmentsRepository;

  private vaccineBatchesRepository: IVaccineBatchesRepository;

  constructor(appointmentsRepository: IAppointmentsRepository, vaccineBatchesRepository: IVaccineBatchesRepository) {
    this.appointmentsRepository = appointmentsRepository;
    this.vaccineBatchesRepository = vaccineBatchesRepository;
  }

  async execute(request: ICreateAppointmentDTO): Promise<Response> {
    const appointmentOrError = Appointment.create(request);

    if (appointmentOrError.isLeft()) {
      return left(appointmentOrError.value);
    }

    const appointment = appointmentOrError.value;

    const appointmentsAlreadyCreatedOnDateOrError = await this.appointmentsRepository.findAllByVaccinationPointAndDate(
      appointment.vaccinationPoint,
      appointment.date
    );

    if (appointmentsAlreadyCreatedOnDateOrError.isLeft()) {
      return left(appointmentsAlreadyCreatedOnDateOrError.value);
    }

    const appointmentsAlreadyCreatedOnDate = appointmentsAlreadyCreatedOnDateOrError.value;

    if (appointmentsAlreadyCreatedOnDate.length >= appointment.vaccinationPoint.availability) {
      return left(new VaccinationPointWithoutAvailability());
    }

    const vaccinationPointBatchesWithinExpirationDateOrError = await this.vaccineBatchesRepository.findAllByVaccinationPointAndExpirationDateAfterThan(
      appointment.vaccinationPoint,
      appointment.date
    );

    if (vaccinationPointBatchesWithinExpirationDateOrError.isLeft()) {
      return left(vaccinationPointBatchesWithinExpirationDateOrError.value);
    }

    const vaccinationPointBatchesWithinExpirationDate = vaccinationPointBatchesWithinExpirationDateOrError.value;

    if (vaccinationPointBatchesWithinExpirationDate.length === 0) {
      return left(new WithoutVaccineBatchesWithinExpirationDate());
    }

    const appointmentsThatUseSameBatch = await this.findAllAppointmentsThatUseSameBatch(
      vaccinationPointBatchesWithinExpirationDate
    );

    const hadInfraError = appointmentsThatUseSameBatch.find(({ appointments }) => appointments.isLeft());

    if (hadInfraError) {
      return left(hadInfraError.appointments.value as InfraError);
    }

    const hasNotAvailableVaccineBatch = appointmentsThatUseSameBatch.some(
      ({ batch, appointments }) => batch.stock <= (appointments.value as Appointment[]).length
    );

    if (hasNotAvailableVaccineBatch) {
      return left(new HasNotAvailableVaccineBatches());
    }

    const appointmentCreatedOrError = await this.appointmentsRepository.save(appointment);

    if (appointmentCreatedOrError.isLeft()) {
      return left(appointmentCreatedOrError.value);
    }

    return right(appointmentCreatedOrError.value);
  }

  private async findAllAppointmentsThatUseSameBatch(vaccineBatches: VaccineBatch[]) {
    const fetch = async () => {
      return Promise.all(
        vaccineBatches.map(async (batch) => {
          const appointments = await this.appointmentsRepository.findAllByVaccineBatch(batch);

          return {
            batch,
            appointments
          };
        })
      );
    };

    return fetch();
  }
}
