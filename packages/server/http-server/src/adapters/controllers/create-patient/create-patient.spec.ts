import { ValidatePayloadHelper } from '@adapters/helpers/validate-payload';
import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { CreatePatientUseCase } from '@usecases/create-patient';
import { CreateUserUseCase } from '@usecases/create-user';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { left, right } from '@server/shared';
import { badRequest, created, serverError } from '@adapters/helpers/http-helper';
import { MissingParamsError } from '@adapters/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { CreatePatientController } from './create-patient';

const makeFixture = () => ({
  body: {
    name: 'name',
    email: 'patient+01@email.com',
    phone: '00 00000-0000',
    password: 'password',
    birthday: 'birthday',
    document: 'document',
    avatar: 'avatar.temp'
  }
});

const makeSut = () => {
  const validatePayload = new ValidatePayloadHelper();
  const createUserUseCase = new CreateUserUseCase(new FakeUsersRepository());
  const createPatientUseCase = new CreatePatientUseCase(new FakePatientsRepository());

  const sut = new CreatePatientController(validatePayload, createUserUseCase, createPatientUseCase);

  return {
    validatePayload,
    createUserUseCase,
    createPatientUseCase,
    sut
  };
};

describe('Create Patient Controller Unitary Tests', () => {
  it('should create a valid patient', async () => {
    const { sut, createUserUseCase, createPatientUseCase } = makeSut();

    jest.spyOn(createUserUseCase, 'execute').mockImplementation(() => Promise.resolve(right({} as User)));
    jest.spyOn(createPatientUseCase, 'execute').mockImplementation(() => Promise.resolve(right({} as Patient)));

    const testable = await sut.handle(makeFixture());

    expect(testable).toEqual(created());
  });

  it('should validate payload', async () => {
    const { sut } = makeSut();

    const testable = await sut.handle({});

    expect(testable).toEqual(
      badRequest(MissingParamsError.create(['name', 'email', 'phone', 'password', 'birthday', 'document']))
    );
  });

  it('should return serverError when create user usecase returns Infra Error', async () => {
    const { sut, createUserUseCase } = makeSut();

    jest.spyOn(createUserUseCase, 'execute').mockImplementation(() => Promise.resolve(left({} as InfraError)));

    const testable = await sut.handle(makeFixture());

    expect(testable).toEqual(serverError());
  });

  it('should return serverError when create patient usecase returns Infra Error', async () => {
    const { sut, createUserUseCase, createPatientUseCase } = makeSut();

    jest.spyOn(createUserUseCase, 'execute').mockImplementation(() => Promise.resolve(right({} as User)));
    jest.spyOn(createPatientUseCase, 'execute').mockImplementation(() => Promise.resolve(left({} as InfraError)));

    const testable = await sut.handle(makeFixture());

    expect(testable).toEqual(serverError());
  });
});
