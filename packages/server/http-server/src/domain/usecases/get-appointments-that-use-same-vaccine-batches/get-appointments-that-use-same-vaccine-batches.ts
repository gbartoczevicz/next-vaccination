import { Appointment } from '@entities/appointment';
import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { IAppointmentsWithVaccineBatchDTO, IGetAppointmentsThatUseSameVaccineBatchesDTO } from './dto';

type Response = Either<InfraError, Array<IAppointmentsWithVaccineBatchDTO>>;

export class GetAppointmentsThatUseSameVaccineBatchesUseCase {
  private appointmentsRepository: IAppointmentsRepository;

  constructor(appointmentsRepository: IAppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  async execute(request: IGetAppointmentsThatUseSameVaccineBatchesDTO): Promise<Response> {
    const { vaccineBatches } = request;

    const appointmentsOrError = await Promise.all(
      vaccineBatches.map(async (batch) => {
        const appointments = await this.appointmentsRepository.findAllByVaccineBatch(batch);

        return {
          batch,
          appointments
        };
      })
    );

    const hasInfraErrors = appointmentsOrError.find(({ appointments }) => appointments.isLeft());

    if (hasInfraErrors) {
      return left(hasInfraErrors.appointments.value as InfraError);
    }

    const appointments = appointmentsOrError.map(({ batch, appointments: a }) => ({
      vaccineBatch: batch,
      appointments: a.value as Appointment[]
    }));

    return right(appointments);
  }
}
