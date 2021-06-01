import { EntityID } from '@server/shared';
import { InvalidExpirationDate, InvalidVaccineBatch } from './errors';
import { VaccinationPoint } from './vaccination-point';
import { VaccineBatch, IVaccineBatchProps } from './vaccine-batch';
import { Location } from './values';

const makeSut = () => ({ sut: VaccineBatch });

const makeFixture = ({
  expirationDate = new Date(),
  stock = 10,
  vaccinationPointId = 'vaccination_point_id',
  vaccineId = 'vaccine_id'
}) =>
  ({
    expirationDate,
    stock,
    vaccinationPoint: VaccinationPoint.create({
      id: new EntityID(vaccinationPointId),
      name: 'Vaccination Point',
      document: 'document',
      phone: '90000-0000',
      location: Location.create({
        address: 'Avenida Inglaterra',
        addressNumber: 20,
        coordinate: {
          latitude: 41.40338,
          longitude: 2.17403
        }
      }).value as Location,
      availability: 20
    }).value as VaccinationPoint,
    vaccine: {
      id: new EntityID(vaccineId),
      name: 'any',
      description: 'any'
    }
  } as IVaccineBatchProps);

const makeExpirationDate = (days = 5) => {
  const fixture = new Date();

  fixture.setDate(fixture.getDate() + days);

  return fixture;
};

describe('Vaccine Batch Unitary Tests', () => {
  it('should create a valid vaccine batch object', () => {
    const { sut } = makeSut();

    const expirationDate = makeExpirationDate();

    const testable = sut.create(makeFixture({ expirationDate }));

    expect(testable.isRight()).toBeTruthy();

    const vaccineBatch = testable.value as VaccineBatch;

    expect(vaccineBatch.expirationDate.value).toEqual(expirationDate);
    expect(vaccineBatch.stock).toEqual(10);
    expect(vaccineBatch.vaccinationPoint.id.value).toEqual('vaccination_point_id');
    expect(vaccineBatch.vaccine.id.value).toEqual('vaccine_id');
  });

  describe('params validation', () => {
    it('should validate props param', () => {
      const { sut } = makeSut();

      const testable = sut.create(undefined);

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidVaccineBatch('Props is required'));
    });

    it('should validate expirationDate param', () => {
      const { sut } = makeSut();

      const testable = sut.create(makeFixture({ expirationDate: null }));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidExpirationDate('Value is required'));
    });

    it('should validate vaccine param', () => {
      const { sut } = makeSut();

      const fixture = makeFixture({ expirationDate: makeExpirationDate() });

      const testable = sut.create({ ...fixture, vaccine: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidExpirationDate('Vaccine is required'));
    });

    it('should validate vaccination point param', () => {
      const { sut } = makeSut();

      const fixture = makeFixture({ expirationDate: makeExpirationDate() });

      const testable = sut.create({ ...fixture, vaccinationPoint: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidExpirationDate('Vaccination Point is required'));
    });

    it('should validate stock param', () => {
      const { sut } = makeSut();

      const fixture = makeFixture({ expirationDate: makeExpirationDate() });

      const testable = sut.create({ ...fixture, stock: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidExpirationDate('Stock is required'));
    });

    it('should if validate stock param is greater than 0', () => {
      const { sut } = makeSut();

      const fixture = makeFixture({ expirationDate: makeExpirationDate() });

      const testable = sut.create({ ...fixture, stock: -1 });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidExpirationDate('Stock must be greater than 0'));
    });
  });
});
