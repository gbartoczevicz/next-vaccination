import { LoginUseCase } from '@usecases/login/login';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { InfraError } from '@usecases/output-ports/errors';
import { left } from '@server/shared';
import { User } from '@entities/user';

const makeUser = (email: string, password: string) => {
  const user = User.create({
    name: 'any_name',
    email,
    phone: '(99) 99999-9999',
    password: {
      password
    }
  });

  return user.value;
};

const makeFakeUsersRepository = () => {
  return new FakeUsersRepository();
};

const makeSut = () => {
  const makedFakeUsersRepository = makeFakeUsersRepository();
  const sut = new LoginUseCase(makedFakeUsersRepository);

  return {
    sut,
    makedFakeUsersRepository
  };
};

describe('Login UseCase Unitary Tests', () => {
  test('should call email and password infrastructure query correctly', async () => {
    const { sut, makedFakeUsersRepository } = makeSut();

    const spyFindByEmailAndPassword = jest.spyOn(makedFakeUsersRepository, 'findByEmailAndPassword');
    await sut.execute({
      user: 'any_user',
      password: 'any_password'
    });

    expect(spyFindByEmailAndPassword).toHaveBeenCalledTimes(1);
    expect(spyFindByEmailAndPassword).toHaveBeenCalledWith('any_user', 'any_password');
  });

  test('should returns left if findByEmailAndPassword result is wrong', async () => {
    const { sut, makedFakeUsersRepository } = makeSut();

    jest
      .spyOn(makedFakeUsersRepository, 'findByEmailAndPassword')
      .mockImplementation(() => Promise.resolve(left(new InfraError('any_reason'))));

    const testable = await sut.execute({
      user: 'any_user',
      password: 'any_password'
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('any_reason'));
  });

  test('should return right with User entitiy if result has been succeded', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      user: 'any_user',
      password: 'any_password'
    });

    expect(testable.isRight()).toBeTruthy();
    expect(testable.value).toEqual(makeUser('any_user', 'any_password'));
  });
});
