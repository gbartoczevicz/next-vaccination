import { Vaccine } from '@entities/vaccination-point';
import { EntityID, right } from '@server/shared';
import { FindUnique, IVaccinesRepository, Save } from './vaccines';

export class FakeVaccinesRepository implements IVaccinesRepository {
  async findByName(name: string): Promise<FindUnique> {
    const fixture = Vaccine.create({
      name,
      description: 'Vaccine Description'
    }).value as Vaccine;

    return Promise.resolve(right(fixture));
  }

  async findById(id: string): Promise<FindUnique> {
    const fixture = Vaccine.create({
      id: new EntityID(id),
      name: 'Any Vaccine',
      description: 'Any Vaccine Description'
    }).value as Vaccine;

    return Promise.resolve(right(fixture));
  }

  async save(vaccine: Vaccine): Promise<Save> {
    return Promise.resolve(right(vaccine));
  }
}
