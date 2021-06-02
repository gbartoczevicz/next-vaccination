import { LoginUseCase } from '@usecases/login/login';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';

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
});
