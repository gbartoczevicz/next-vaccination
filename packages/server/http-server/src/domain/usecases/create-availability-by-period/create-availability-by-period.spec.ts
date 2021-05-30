import { AvailabilityByPeriod, VaccinationPoint } from '@entities/vaccination-point';
import { InvalidAvailabilityByPeriod } from '@entities/vaccination-point/errors';
import { Coordinate } from '@entities/vaccination-point/values';
import { EntityID, left, right } from '@server/shared';
import { AvailabilityByPeriodAlreadyExists } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeAvailabilityByPeriodRepository } from '@usecases/output-ports/repositories/availability-by-period/fake';
import { CreateAvailabilityByPeriodUseCase } from './create-availability-by-period';

const makeSut = () => {
  const fakeAvailabilityByPeriodRepository = new FakeAvailabilityByPeriodRepository();

  return {
    sut: new CreateAvailabilityByPeriodUseCase(fakeAvailabilityByPeriodRepository),
    fakeAvailabilityByPeriodRepository
  };
};

const makeFixture = ({ morning = 50, evening = 20, dusk = 10 }) => {
  const vaccinationPoint = VaccinationPoint.create({
    id: new EntityID('vaccination_point_id'),
    name: 'Vaccination Point',
    phone: '0000-0000',
    document: 'vaccination_point_document',
    location: {
      address: 'vaccination point address',
      addressNumber: 25,
      coordinate: Coordinate.create({
        latitude: 20.0,
        longitude: 30.0
      }).value as Coordinate
    }
  }).value as VaccinationPoint;

  return {
    vaccinationPoint,
    morning,
    evening,
    dusk
  };
};

describe('Create Availability By Period UseCase Unitary Tests', () => {
  it('should create a availability by period object', async () => {
    const { sut, fakeAvailabilityByPeriodRepository } = makeSut();

    jest
      .spyOn(fakeAvailabilityByPeriodRepository, 'findByVaccinationPoint')
      .mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isRight()).toBeTruthy();

    const availabilityByPeriod = testable.value as AvailabilityByPeriod;

    expect(availabilityByPeriod.morning).toEqual(50);
    expect(availabilityByPeriod.evening).toEqual(20);
    expect(availabilityByPeriod.evening).toEqual(20);
    expect(availabilityByPeriod.vaccinationPoint.id.value).toEqual('vaccination_point_id');
  });

  it('should validate AvailabilityByPeriod params', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ evening: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAvailabilityByPeriod('Evening value is required'));
  });

  it("should check if vaccination point's availability by period already exists", async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AvailabilityByPeriodAlreadyExists());
  });

  describe('Infra error validation', () => {
    it('should validate findByVaccinationPoint', async () => {
      const { sut, fakeAvailabilityByPeriodRepository } = makeSut();

      jest
        .spyOn(fakeAvailabilityByPeriodRepository, 'findByVaccinationPoint')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate save', async () => {
      const { sut, fakeAvailabilityByPeriodRepository } = makeSut();

      jest
        .spyOn(fakeAvailabilityByPeriodRepository, 'findByVaccinationPoint')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeAvailabilityByPeriodRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
