import { MissingParamsError } from '@adapters/errors';
import { badRequest, created, serverError } from '@adapters/helpers/http-helper';
import { ValidatePayloadHelper } from '@adapters/helpers/validate-payload';
import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { CreateHealthProfessionalUseCase } from '@usecases/create-health-professional';
import { GetUserUseCase } from '@usecases/get-user';
import { GetVaccinationPointUseCase } from '@usecases/get-vaccination-point';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { left, right } from '../../../../../_shared/src';
import { CreateResponsibleController } from './create-responsible';

const makeSut = () => {
  const validatePayload = new ValidatePayloadHelper();
  const getUserUseCase = new GetUserUseCase(new FakeUsersRepository());
  const getVaccinationPointUseCase = new GetVaccinationPointUseCase(new FakeVaccinationPointsRepository());
  const createResponsibleUseCase = new CreateHealthProfessionalUseCase(new FakeHealthProfessionalsRepository());

  const sut = new CreateResponsibleController(
    validatePayload,
    getUserUseCase,
    getVaccinationPointUseCase,
    createResponsibleUseCase
  );

  return {
    validatePayload,
    getUserUseCase,
    getVaccinationPointUseCase,
    createResponsibleUseCase,
    sut
  };
};

const makeFixture = () => ({
  body: { user_id: 'user', vaccination_point_id: 'vaccination_point', document: 'document' }
});

const makeError = () => new InfraError('Unexpected Error');

describe('Create Responsible Controller Unitary Tests', () => {
  it('should create a vaccination point responsible', async () => {
    const { sut, getUserUseCase, getVaccinationPointUseCase, createResponsibleUseCase } = makeSut();

    jest.spyOn(getUserUseCase, 'execute').mockImplementation(() => Promise.resolve(right({} as User)));
    jest
      .spyOn(getVaccinationPointUseCase, 'execute')
      .mockImplementation(() => Promise.resolve(right({} as VaccinationPoint)));
    jest
      .spyOn(createResponsibleUseCase, 'execute')
      .mockImplementation(() => Promise.resolve(right({} as HealthProfessional)));

    const testable = await sut.handle(makeFixture());

    expect(testable).toEqual(created());
  });

  it('should validate request payload', async () => {
    const { sut } = makeSut();

    const testable = await sut.handle({});

    expect(testable).toEqual(badRequest(MissingParamsError.create(['user_id', 'vaccination_point_id', 'document'])));
  });

  describe('validate server error', () => {
    it('should validate Get User Use Case Infra Error', async () => {
      const { sut, getUserUseCase } = makeSut();

      jest.spyOn(getUserUseCase, 'execute').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.handle(makeFixture());

      expect(testable).toEqual(serverError());
    });

    it('should validate Get Vaccination Point Use Case Infra Error', async () => {
      const { sut, getUserUseCase, getVaccinationPointUseCase } = makeSut();

      jest.spyOn(getUserUseCase, 'execute').mockImplementation(() => Promise.resolve(right({} as User)));
      jest.spyOn(getVaccinationPointUseCase, 'execute').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.handle(makeFixture());

      expect(testable).toEqual(serverError());
    });

    it('should validate Create Responsible Use Case Infra Error', async () => {
      const { sut, getUserUseCase, getVaccinationPointUseCase, createResponsibleUseCase } = makeSut();

      jest.spyOn(getUserUseCase, 'execute').mockImplementation(() => Promise.resolve(right({} as User)));
      jest
        .spyOn(getVaccinationPointUseCase, 'execute')
        .mockImplementation(() => Promise.resolve(right({} as VaccinationPoint)));
      jest.spyOn(createResponsibleUseCase, 'execute').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.handle(makeFixture());

      expect(testable).toEqual(serverError());
    });
  });
});
