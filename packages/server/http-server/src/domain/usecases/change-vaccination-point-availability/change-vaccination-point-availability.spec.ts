import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidVaccinationPoint } from '@entities/vaccination-point/errors';
import { EntityID, left } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { ChangeVaccinationPointAvailabilityUseCase } from './change-vaccination-point-availability';

const makeSut = () => {
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();

  return {
    sut: new ChangeVaccinationPointAvailabilityUseCase(fakeVaccinationPointsRepository),
    fakeVaccinationPointsRepository
  };
};

const makeFixture = (availability = 0) => {
  const vaccinationPoint = VaccinationPoint.create({
    id: new EntityID('to_keep_id'),
    name: 'To keep name',
    document: 'To keep document',
    phone: '0000-0000',
    availability: 20,
    location: {
      address: 'To keep address',
      addressNumber: 10,
      coordinate: {
        latitude: 10,
        longitude: 10
      }
    }
  }).value as VaccinationPoint;

  return {
    vaccinationPoint,
    availability
  };
};

const makeError = () => new InfraError('How Unexpected');

describe('Change Vaccination Point Availability Use Case Unitary Tests', () => {
  it('should update vaccination point availability', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoint = testable.value as VaccinationPoint;

    expect(vaccinationPoint.id.value).toEqual('to_keep_id');
    expect(vaccinationPoint.name).toEqual('To keep name');
    expect(vaccinationPoint.availability).toEqual(0);
    expect(vaccinationPoint.document).toEqual('To keep document');
    expect(vaccinationPoint.phone.value).toEqual('00000000');
    expect(vaccinationPoint.location.address).toEqual('To keep address');
    expect(vaccinationPoint.location.addressNumber).toEqual(10);
    expect(vaccinationPoint.location.coordinate.latitude).toEqual(10);
    expect(vaccinationPoint.location.coordinate.longitude).toEqual(10);
  });

  it('should validate vaccination point object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(-1));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccinationPoint('Availability must be greater or equal than 0'));
  });

  describe('Infra Error validation', () => {
    it("should validate VaccinationPointsRepository's save", async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest.spyOn(fakeVaccinationPointsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeError());
    });
  });
});
