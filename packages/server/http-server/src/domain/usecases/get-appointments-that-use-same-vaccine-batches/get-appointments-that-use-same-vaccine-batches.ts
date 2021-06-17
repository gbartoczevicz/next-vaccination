import { Conclusion } from '@entities/appointment/conclusion';
import { Either, left, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { IAppointmentsWithVaccineBatchDTO, IGetAppointmentsThatUseSameVaccineBatchesDTO } from './dto';

type Response = Either<InfraError, Array<IAppointmentsWithVaccineBatchDTO>>;

export class GetAppointmentsThatUseSameVaccineBatchesUseCase {
  private conclustionsRepository: IConclusionsRepository;

  constructor(conclustionsRepository: IConclusionsRepository) {
    this.conclustionsRepository = conclustionsRepository;
  }

  async execute(request: IGetAppointmentsThatUseSameVaccineBatchesDTO): Promise<Response> {
    const { vaccineBatches } = request;

    const conclusionsOrError = await Promise.all(
      vaccineBatches.map(async (batch) => {
        const conclusions = await this.conclustionsRepository.findAllByVaccineBatch(batch);

        return {
          batch,
          conclusions
        };
      })
    );

    const hasInfraErrors = conclusionsOrError.find(({ conclusions }) => conclusions.isLeft());

    if (hasInfraErrors) {
      return left(hasInfraErrors.conclusions.value as InfraError);
    }

    const appointments = conclusionsOrError.map(({ batch, conclusions }) => ({
      vaccineBatch: batch,
      appointments: (<Conclusion[]>conclusions.value).map((conclusion) => conclusion.appointment)
    }));

    return right(appointments);
  }
}
