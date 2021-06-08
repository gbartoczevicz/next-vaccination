import { User } from '@entities/user';
import { left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { GetUserUseCase } from './get-user';

const makeSut = () => {
  const fakeUsersRepository = new FakeUsersRepository();

  return {
    sut: new GetUserUseCase(fakeUsersRepository),
    fakeUsersRepository
  };
};

const makeInfraError = () => new InfraError('Unexpected Error');

describe('Get User Use Case Unitary Tests', () => {
  it('should get a valid user', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({ userId: 'user_to_find' });

    const user = testable.value as User;

    expect(user.id.value).toEqual('user_to_find');
    expect(user.name).toBeDefined();
  });

  it('should validate if user exists', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({ userId: 'user_to_find' });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new UserNotFound());
  });

  describe('infra errors validation', () => {
    it('validate UsersRepository findById', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest.spyOn(fakeUsersRepository, 'findById').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute({ userId: 'user_to_find' });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
