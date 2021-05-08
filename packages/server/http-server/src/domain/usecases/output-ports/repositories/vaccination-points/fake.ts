import { right } from '@server/shared';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Location } from '@entities/vaccination-point/values';
import { FindByDocument, IVaccinationPointsRepository, Save } from './vaccination-points';

export class FakeVaccinationPointsRepository implements IVaccinationPointsRepository {
  async findByDocument(document: string): Promise<FindByDocument> {
    const fixture = VaccinationPoint.create({
      name: 'Point',
      document,
      phone: '0000-0000',
      location: Location.create({
        address: 'Avenida Inglaterra',
        addressNumber: 20,
        latitude: 41.40338,
        longitude: 2.17403
      }).value as Location
    }).value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async save(vaccinationPoint: VaccinationPoint): Promise<Save> {
    return Promise.resolve(right(vaccinationPoint));
  }
}