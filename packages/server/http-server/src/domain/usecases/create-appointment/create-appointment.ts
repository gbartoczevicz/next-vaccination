/* eslint-disable max-len */
import { Appointment } from '@entities/appointment';
import { InvalidAppointment } from '@entities/appointment/errors';
import { Either, left, right } from '@server/shared';
import {
  HasNotAvailableVaccineBatches,
  VaccinationPointWithoutAvailability,
  WithoutVaccineBatchesWithinExpirationDate
} from '@usecases/errors';
import { GetAppointmentsThatUseSameVaccineBatchesUseCase } from '@usecases/get-appointments-that-use-same-vaccine-batches';
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

  private getAppointmentsThatUseSameVaccineBatchesUseCase: GetAppointmentsThatUseSameVaccineBatchesUseCase;

  constructor(
    appointmentsRepository: IAppointmentsRepository,
    vaccineBatchesRepository: IVaccineBatchesRepository,
    getAppointmentsThatUseSameVaccineBatchesUseCase: GetAppointmentsThatUseSameVaccineBatchesUseCase
  ) {
    this.appointmentsRepository = appointmentsRepository;
    this.vaccineBatchesRepository = vaccineBatchesRepository;
    this.getAppointmentsThatUseSameVaccineBatchesUseCase = getAppointmentsThatUseSameVaccineBatchesUseCase;
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

    const appointmentsThatUseSameBatchOrError = await this.getAppointmentsThatUseSameVaccineBatchesUseCase.execute({
      vaccineBatches: vaccinationPointBatchesWithinExpirationDate
    });

    if (appointmentsThatUseSameBatchOrError.isLeft()) {
      return left(appointmentsThatUseSameBatchOrError.value);
    }

    const appointmentsThatUseSameBatch = appointmentsThatUseSameBatchOrError.value;

    const hasNotAvailableVaccineBatch = appointmentsThatUseSameBatch.some(
      ({ vaccineBatch, appointments }) => vaccineBatch.stock <= appointments.length
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
}
