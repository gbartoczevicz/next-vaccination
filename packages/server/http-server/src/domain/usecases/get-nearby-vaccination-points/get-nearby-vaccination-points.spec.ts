import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidCoordinate } from '@entities/vaccination-point/errors';
import { left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { GetNearbyVaccinationPointsUseCase } from './get-nearby-vaccination-points';

const makeSut = () => {
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();
  const fakeUsersRepository = new FakeUsersRepository();

  return {
    sut: new GetNearbyVaccinationPointsUseCase(fakeUsersRepository, fakeVaccinationPointsRepository),
    fakeUsersRepository,
    fakeVaccinationPointsRepository
  };
};

describe('List Vaccination Points Unitary Tests', () => {
  it('should list vaccination points', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      userId: 'user_id',
      coordinate: {
        latitude: 10,
        longitude: 20
      }
    });

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoints = testable.value as VaccinationPoint[];

    expect(vaccinationPoints.length).toEqual(1);
  });

  it('should validate if user exists', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({
      userId: 'any',
      coordinate: {
        latitude: 10,
        longitude: 20
      }
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new UserNotFound());
  });

  it('should validate coordinate object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      userId: 'any',
      coordinate: {
        latitude: 10,
        longitude: null
      }
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCoordinate('Longitude is required'));
  });

  describe('validate infra errors', () => {
    it('should validate user findById', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest
        .spyOn(fakeUsersRepository, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute({
        userId: 'any',
        coordinate: {
          latitude: 10,
          longitude: 20
        }
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate vaccintaion points findAll', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findAllByApproximateCoordinate')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute({
        userId: 'any',
        coordinate: {
          latitude: 10,
          longitude: 20
        }
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
