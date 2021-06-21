import { LoginController } from '@adapters/controllers/login';
import { MissingParamError } from '@adapters/errors';
import { badRequest } from '@adapters/helpers/http-helper';
import { FakeEncrypter } from '@entities/output-ports/encrypter';
import { LoginUseCase } from '@usecases/login';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';

const makeLoginUseCase = () => {
  const makedFakeUsersRepository = new FakeUsersRepository();
  const makedFakeEncrypter = new FakeEncrypter();
  return new LoginUseCase(makedFakeUsersRepository, makedFakeEncrypter);
};

const makeSut = () => {
  const makedLoginUseCase = makeLoginUseCase();
  const sut = new LoginController(makedLoginUseCase);

  return {
    sut
  };
};

describe('Login Controller Unitary Tests', () => {
  test('should return bad request with missing param error if miss param in request', async () => {
    const { sut } = makeSut();

    const testable = await sut.handle({});

    expect(testable).toEqual(badRequest(new MissingParamError('User or password')));
  });
});
