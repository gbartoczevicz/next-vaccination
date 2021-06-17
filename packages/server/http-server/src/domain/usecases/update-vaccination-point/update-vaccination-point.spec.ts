import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidVaccinationPoint } from '@entities/vaccination-point/errors';
import { EntityID, left, right } from '@server/shared';
import { DocumentAlreadyInUse, LocationAlreadyInUse, PhoneAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { UpdateVaccinationPointUseCase } from './update-vaccination-point';

const makeSut = () => {
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();

  return {
    sut: new UpdateVaccinationPointUseCase(fakeVaccinationPointsRepository),
    fakeVaccinationPointsRepository
  };
};

const makeFixture = (
  name = 'Updated Name',
  phone = '43 99999-9999',
  document = 'updated_document',
  latitude = 88.888,
  longitude = 99.999
) => {
  const vaccinationPoint = {
    id: new EntityID('to_keep_id'),
    availability: 3
  } as VaccinationPoint;

  return {
    vaccinationPoint,
    name,
    document,
    phone,
    location: {
      address: 'New Address',
      addressNumber: 10,
      coordinate: { latitude, longitude }
    }
  };
};

const makeInfraError = () => new InfraError('Unexpected Error');

describe('Update Vaccination Point usecase Unitary Tests', () => {
  it('should update vaccination point', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
      .mockImplementation(() => Promise.resolve(right(null)));

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByCoordinate')
      .mockImplementation(() => Promise.resolve(right(null)));

    jest.spyOn(fakeVaccinationPointsRepository, 'findByPhone').mockImplementation(() => Promise.resolve(right(null)));

    const { location, ...fixture } = makeFixture();

    const testable = await sut.execute({
      ...fixture,
      location
    });

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoint = testable.value as VaccinationPoint;

    expect(vaccinationPoint.id.value).toEqual('to_keep_id');
    expect(vaccinationPoint.availability).toEqual(3);

    expect(vaccinationPoint.name).toEqual('Updated Name');
    expect(vaccinationPoint.phone.value).toEqual('43999999999');
    expect(vaccinationPoint.document).toEqual('updated_document');
    expect(vaccinationPoint.location).toEqual(location);
  });

  it('should validate vaccination point object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccinationPoint('Name is required'));
  });

  it('should validate if vaccination point document is already in use', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new DocumentAlreadyInUse());
  });

  it('should validate if vaccination point coordinate is already in use', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
      .mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new LocationAlreadyInUse());
  });

  it('should validate if vaccination point phone is already in use', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
      .mockImplementation(() => Promise.resolve(right(null)));

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByCoordinate')
      .mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PhoneAlreadyInUse());
  });

  describe('validate infra errors', () => {
    it('should validate findByDocument', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });

    it('should validate findByCoordinate', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByCoordinate')
        .mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });

    it('should validate findByPhone', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByCoordinate')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByPhone')
        .mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });

    it('should validate save', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByCoordinate')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest.spyOn(fakeVaccinationPointsRepository, 'findByPhone').mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
