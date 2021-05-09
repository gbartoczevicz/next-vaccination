import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidVaccinationPoint } from '@entities/vaccination-point/errors';
import { ILocationProps } from '@entities/vaccination-point/values';
import { left, right } from '@server/shared';
import { DocumentAlreadyInUse, LocationAlreadyInUse, VaccinationPointNotFound } from '@usecases/errors';
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
  id = 'unique_id',
  name = 'Updated Name',
  phone = '43 99999-9999',
  document = 'updated_document',
  latitude = 88.888,
  longitude = 99.999
) => ({
  id,
  name,
  document,
  phone,
  location: {
    address: 'New Address',
    addressNumber: 10,
    latitude,
    longitude
  } as ILocationProps
});

describe('Update Vaccination Point usecase Unitary Tests', () => {
  it('should update vaccination point', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
      .mockImplementation(() => Promise.resolve(right(null)));

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findByLatitudeAndLongitude')
      .mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoint = testable.value as VaccinationPoint;

    expect(vaccinationPoint.id.value).toEqual('unique_id');
    expect(vaccinationPoint.name).toEqual('Updated Name');
    expect(vaccinationPoint.phone.phone).toEqual('43999999999');
    expect(vaccinationPoint.document).toEqual('updated_document');
    expect(vaccinationPoint.location).toEqual(makeFixture().location);
  });

  it('should validate vaccination point object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(null, null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccinationPoint('Name is required'));
  });

  it('should validate if vaccination point exists', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest.spyOn(fakeVaccinationPointsRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccinationPointNotFound());
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

  describe('validate infra errors', () => {
    it('should validate findById', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate findByDocument', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate findByLatitudeAndLongitude', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByLatitudeAndLongitude')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate save', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findByLatitudeAndLongitude')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinationPointsRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
