import { EntityID } from '@server/shared';
import { AvailabilityByPeriod } from './availability-by-period';
import { InvalidAvailabilityByPeriod } from './errors';
import { VaccinationPoint } from './vaccination-point';

const makeSut = () => ({ sut: AvailabilityByPeriod });

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

describe('Avaibility By Period Unitary Tests', () => {
  it('should create a valid object', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture({}));

    expect(testable.isRight()).toBeTruthy();

    const availabilityByPeriod = testable.value as AvailabilityByPeriod;

    expect(availabilityByPeriod.vaccinationPoint.id.value).toEqual('any');
    expect(availabilityByPeriod.morning).toEqual(50);
    expect(availabilityByPeriod.evening).toEqual(40);
    expect(availabilityByPeriod.dusk).toEqual(10);
  });

  describe('entity params validation', () => {
    it('should validate morning param', () => {
      const { sut } = makeSut();

      const testable = sut.create(makeFixture({ morning: null }));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidAvailabilityByPeriod('Morning value is required'));
    });
  });

  it('should validate evening param', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture({ evening: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAvailabilityByPeriod('Evening value is required'));
  });

  it('should validate dusk param', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture({ dusk: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAvailabilityByPeriod('Dusk value is required'));
  });

  it('should validate vaccinationPoint param', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture({}),
      vaccinationPoint: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAvailabilityByPeriod('Vaccination Point is required'));
  });
});
