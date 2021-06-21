import { LoginController } from '@adapters/controllers/login';
import { MissingParamError } from '@adapters/errors';
import { badRequest, serverError } from '@adapters/helpers/http-helper';
import { FakeEncrypter } from '@entities/output-ports/encrypter';
import { LoginUseCase } from '@usecases/login';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { left } from '@server/shared';

const makeFixture = () => ({
  body: {
    user: 'any_user@mail.com',
    password: 'any_password'
  }
});

const makeLoginUseCase = () => {
  const makedFakeUsersRepository = new FakeUsersRepository();
  const makedFakeEncrypter = new FakeEncrypter();
  return new LoginUseCase(makedFakeUsersRepository, makedFakeEncrypter);
};

const makeSut = () => {
  const makedLoginUseCase = makeLoginUseCase();
  const sut = new LoginController(makedLoginUseCase);

  return {
    sut,
    makedLoginUseCase
  };
};

describe('Login Controller Unitary Tests', () => {
  test('should return bad request with missing param error if miss param in request', async () => {
    const { sut } = makeSut();

    const testable = await sut.handle({});

    expect(testable).toEqual(badRequest(new MissingParamError('User or password')));
  });

  test('should return internal server error if use case returns any left response', async () => {
    const { sut, makedLoginUseCase } = makeSut();

    jest
      .spyOn(makedLoginUseCase, 'execute')
      .mockImplementationOnce(() => Promise.resolve(left(new InfraError('any_infra_error'))));

    const testable = await sut.handle(makeFixture());

    expect(testable).toEqual(serverError());
  });

  test('should return status 200 case everything works out', async () => {
    const { sut } = makeSut();

    const testable = await sut.handle(makeFixture());

    expect(testable.status_code).toEqual(200);
  });
});
