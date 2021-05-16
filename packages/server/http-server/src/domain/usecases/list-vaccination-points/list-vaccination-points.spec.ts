import { VaccinationPoint } from '@entities/vaccination-point';
import { left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { ListVaccinationPointsUseCase } from './list-vaccination-points';

const makeSut = () => {
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();
  const fakeUsersRepository = new FakeUsersRepository();

  return {
    sut: new ListVaccinationPointsUseCase(fakeUsersRepository, fakeVaccinationPointsRepository),
    fakeUsersRepository,
    fakeVaccinationPointsRepository
  };
};

describe('List Vaccination Points Unitary Tests', () => {
  it('should list vaccination points', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({ userId: 'user_id' });

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoints = testable.value as VaccinationPoint[];

    expect(vaccinationPoints.length).toEqual(1);
  });

  it('should validate if user exists', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({ userId: 'any' });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new UserNotFound());
  });

  describe('validate infra errors', () => {
    it('should validate user findById', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest
        .spyOn(fakeUsersRepository, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute({ userId: 'any' });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate vaccintaion points findAll', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findAll')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute({ userId: 'any' });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
