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

describe('Get User UseCase Unitary Tests', () => {
  it('should get a valid user', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({ userId: 'any_user_id' });

    expect(testable.isRight()).toBeTruthy();

    const user = testable.value as User;

    expect(user.id.value).toEqual('any_user_id');
  });

  it('should validate if user exists', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({ userId: 'any_user_id' });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new UserNotFound());
  });

  it('should validate infra error', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

    const testable = await sut.execute({ userId: 'any_user_id' });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('Unexpected Error'));
  });
});
