import { LoginUseCase } from '@usecases/login/login';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { InfraError } from '@usecases/output-ports/errors';
import { left } from '@server/shared';
import { InvalidUserEmail } from '@entities/user/errors';
import { FakeEncrypter } from '@entities/output-ports/encrypter';
import { UserEmail } from '@entities/user/values';
import { PasswordDoesNotMatch } from '@usecases/errors';

const makeSut = () => {
  const makedFakeUsersRepository = new FakeUsersRepository();
  const makedFakeEncrypter = new FakeEncrypter();
  const sut = new LoginUseCase(makedFakeUsersRepository, makedFakeEncrypter);

  return {
    sut,
    makedFakeUsersRepository,
    makedFakeEncrypter
  };
};

describe('Login UseCase Unitary Tests', () => {
  test('should returns left if UserEmail value object is wrong', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      user: 'wrong_mail',
      password: 'any_password'
    });

    expect(testable.value).toEqual(new InvalidUserEmail('E-mail wrong_mail is invalid'));
  });

  test('should calls correctly findByEmail correctly', async () => {
    const { sut, makedFakeUsersRepository } = makeSut();

    const spyFindByEmail = jest.spyOn(makedFakeUsersRepository, 'findByEmail');
    await sut.execute({
      user: 'any_mail@mail.com',
      password: 'any_password'
    });

    expect(spyFindByEmail).toHaveBeenCalledTimes(1);
    expect(spyFindByEmail).toHaveBeenCalledWith(UserEmail.create('any_mail@mail.com').value);
  });

  test('should returns left if findByEmail result is wrong', async () => {
    const { sut, makedFakeUsersRepository } = makeSut();

    jest
      .spyOn(makedFakeUsersRepository, 'findByEmail')
      .mockImplementation(() => Promise.resolve(left(new InfraError('any_reason'))));

    const testable = await sut.execute({
      user: 'any_mail@mail.com',
      password: 'any_password'
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('any_reason'));
  });

  test('should calls correctly encrypter.compare correctly', async () => {
    const { sut, makedFakeEncrypter } = makeSut();

    const spyEncrypterCompare = jest.spyOn(makedFakeEncrypter, 'compare');
    await sut.execute({
      user: 'any_mail@mail.com',
      password: 'any_password'
    });

    expect(spyEncrypterCompare).toHaveBeenCalledTimes(1);
    expect(spyEncrypterCompare).toHaveBeenCalledWith('any_password', 'any_password');
  });

  test('should returns left if encrypter.compare result is wrong', async () => {
    const { sut, makedFakeEncrypter } = makeSut();

    jest.spyOn(makedFakeEncrypter, 'compare').mockImplementation(() => Promise.resolve(false));
    const testable = await sut.execute({
      user: 'any_mail@mail.com',
      password: 'wrong_password'
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PasswordDoesNotMatch());
  });
});
