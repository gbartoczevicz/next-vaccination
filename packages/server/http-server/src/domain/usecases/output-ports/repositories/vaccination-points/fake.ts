import { EntityID, right } from '@server/shared';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Coordinate, Location } from '@entities/vaccination-point/values';
import { Phone } from '@entities/phone';
import { FindAll, FindUnique, IVaccinationPointsRepository, Save } from './vaccination-points';

const makeFixture = (document = 'document', latitude = 41.40338, longitude = 2.17403, id?: EntityID) => ({
  id,
  name: 'Point',
  document,
  phone: '0000-0000',
  location: Location.create({
    address: 'Avenida Inglaterra',
    addressNumber: 20,
    coordinate: Coordinate.create({ latitude, longitude }).value as Coordinate
  }).value as Location,
  availability: 20
});

export class FakeVaccinationPointsRepository implements IVaccinationPointsRepository {
  async findAllByApproximateCoordinate(coordinate: Coordinate): Promise<FindAll> {
    const { latitude, longitude } = coordinate;

    const fixture = VaccinationPoint.create(makeFixture(undefined, latitude, longitude)).value as VaccinationPoint;

    return Promise.resolve(right([fixture]));
  }

  async findById(id: string): Promise<FindUnique> {
    const fixture = VaccinationPoint.create(makeFixture(undefined, undefined, undefined, new EntityID(id)))
      .value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async findByDocument(document: string): Promise<FindUnique> {
    const fixture = VaccinationPoint.create(makeFixture(document)).value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async findByPhone(phone: Phone): Promise<FindUnique> {
    const fixture = VaccinationPoint.create({
      ...makeFixture(),
      phone: phone.value
    }).value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async findByCoordinate(coordinate: Coordinate): Promise<FindUnique> {
    const { latitude, longitude } = coordinate;

    const fixture = VaccinationPoint.create(makeFixture(undefined, latitude, longitude)).value as VaccinationPoint;

    return Promise.resolve(right(fixture));
  }

  async save(vaccinationPoint: VaccinationPoint): Promise<Save> {
    return Promise.resolve(right(vaccinationPoint));
  }
}
