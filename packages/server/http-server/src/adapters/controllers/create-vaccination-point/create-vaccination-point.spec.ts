import { MissingParamsError } from '@adapters/errors';
import { badRequest, created, serverError } from '@adapters/helpers/http-helper';
import { ValidatePayloadHelper } from '@adapters/helpers/validate-payload';
import { VaccinationPoint } from '@entities/vaccination-point';
import { CreateVaccinationPointUseCase } from '@usecases/create-vaccination-point';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { left, right } from '../../../../../_shared/src';
import { CreateVaccinationPointController } from './create-vaccination-point';

const makeSut = () => {
  const validateHttpRequest = new ValidatePayloadHelper();
  const createVaccinationPointUseCase = new CreateVaccinationPointUseCase(new FakeVaccinationPointsRepository());

  return {
    sut: new CreateVaccinationPointController(validateHttpRequest, createVaccinationPointUseCase),
    validateHttpRequest,
    createVaccinationPointUseCase
  };
};

const makeFixture = () => ({
  body: {
    name: 'name',
    phone: 'phone',
    document: 'document',
    location: {},
    availability: 'availability'
  }
});

const makeError = () => new InfraError('Unexpected Error');

describe('Create Vaccination Point Controller Use Case Unitary Tests', () => {
  it('should create a vaccination point', async () => {
    const { sut, createVaccinationPointUseCase } = makeSut();

    jest
      .spyOn(createVaccinationPointUseCase, 'execute')
      .mockImplementation(() => Promise.resolve(right({} as VaccinationPoint)));

    const testable = await sut.handle(makeFixture());

    expect(testable).toEqual(created());
  });

  it('should validate request payload', async () => {
    const { sut } = makeSut();

    const testable = await sut.handle({});

    expect(testable).toEqual(
      badRequest(MissingParamsError.create(['name', 'phone', 'document', 'location', 'availability']))
    );
  });

  describe('server error validation', () => {
    it('should validate Create Vaccination Point Use Case Infra Error', async () => {
      const { sut, createVaccinationPointUseCase } = makeSut();

      jest.spyOn(createVaccinationPointUseCase, 'execute').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.handle(makeFixture());

      expect(testable).toEqual(serverError());
    });
  });
});
