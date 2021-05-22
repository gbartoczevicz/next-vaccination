import { AvailabilityByPeriod, VaccinationPoint } from '@entities/vaccination-point';
import { EntityID, right } from '@server/shared';
import { Save, FindUnique, IAvailabilityByPeriodRepository } from './availability-by-period';

const makeFixture = ({ morning = 50, evening = 40, dusk = 10, vaccinationPointId = 'any' }) => ({
  morning,
  evening,
  dusk,
  vaccinationPoint: VaccinationPoint.create({
    id: new EntityID(vaccinationPointId),
    document: 'any',
    name: 'any',
    phone: '0000-0000',
    location: {
      address: 'any',
      addressNumber: 10,
      coordinate: {
        latitude: 10,
        longitude: 20
      }
    }
  }).value as VaccinationPoint
});

export class FakeAvailabilityByPeriodRepository implements IAvailabilityByPeriodRepository {
  async findByVaccinationPoint(vaccinationPoint: VaccinationPoint): Promise<FindUnique> {
    const fixture = AvailabilityByPeriod.create(
      makeFixture({
        vaccinationPointId: vaccinationPoint.id.value
      })
    ).value as AvailabilityByPeriod;

    return Promise.resolve(right(fixture));
  }

  async save(availabilityByPeriod: AvailabilityByPeriod): Promise<Save> {
    return Promise.resolve(right(availabilityByPeriod));
  }
}
