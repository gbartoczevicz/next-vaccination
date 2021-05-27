import { VaccineBatch } from '@entities/vaccination-point';
import { right } from '@server/shared';
import { IVaccineBatchesRepository, Save } from './vaccine-batches';

export class FakeVaccineBatchesRepository implements IVaccineBatchesRepository {
  async save(vaccineBatch: VaccineBatch): Promise<Save> {
    return Promise.resolve(right(vaccineBatch));
  }
}
