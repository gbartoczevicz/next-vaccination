import { VaccinationPoint, Vaccine, VaccineBatch } from '@entities/vaccination-point';
import { EntityID, right } from '@server/shared';
import { FindAll, IVaccineBatchesRepository, Save } from './vaccine-batches';

export class FakeVaccineBatchesRepository implements IVaccineBatchesRepository {
  async save(vaccineBatch: VaccineBatch): Promise<Save> {
    return Promise.resolve(right(vaccineBatch));
  }

  async findAllByVaccinationPointAndExpirationDateAfterThan(
    vaccinationPoint: VaccinationPoint,
    expirationDate: Date
  ): Promise<FindAll> {
    const fixture = VaccineBatch.create({
      expirationDate,
      stock: 10,
      vaccinationPoint,
      vaccine: { id: new EntityID() } as Vaccine
    }).value as VaccineBatch;

    return Promise.resolve(right([fixture]));
  }
}
