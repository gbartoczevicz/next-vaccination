import { right } from '@server/shared';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Location } from '@entities/vaccination-point/values';
import { FindUnique, IVaccinationPointsRepository, Save } from './vaccination-points';

const makeFixture = (document = 'document', latitude = 41.40338, longitude = 2.17403) => ({
  name: 'Point',
  document,
  phone: '0000-0000',
  location: Location.create({
    address: 'Avenida Inglaterra',
    addressNumber: 20,
    latitude,
    longitude
  }).value as Location
});

export class FakeVaccinationPointsRepository implements IVaccinationPointsRepository {
  async findByDocument(document: string): Promise<FindUnique> {
    const fixture = VaccinationPoint.create(makeFixture(document)).value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async findByLatitudeAndLongitude(latitude: number, longitude: number): Promise<FindUnique> {
    const fixture = VaccinationPoint.create(makeFixture(undefined, latitude, longitude)).value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async save(vaccinationPoint: VaccinationPoint): Promise<Save> {
    return Promise.resolve(right(vaccinationPoint));
  }
}
