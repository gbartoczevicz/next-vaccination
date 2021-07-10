import { VaccinationPoint } from '@entities/vaccination-point';
import { VaccinationPointNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { left, right } from '../../../../../_shared/src';
import { GetVaccinationPointUseCase } from './get-vaccination-point';

const makeSut = () => {
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();

  return {
    sut: new GetVaccinationPointUseCase(fakeVaccinationPointsRepository),
    fakeVaccinationPointsRepository
  };
};

const makeFixture = () => ({ vaccination_point_id: 'vaccination_point' });

const makeError = () => new InfraError('Unexpected Error');

describe('Get Vaccination Point Unitary Tests', () => {
  it('should get vaccination point', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoint = testable.value as VaccinationPoint;

    expect(vaccinationPoint.id.value).toEqual(makeFixture().vaccination_point_id);
  });

  it('should check if vaccination point exists', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest.spyOn(fakeVaccinationPointsRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccinationPointNotFound());
  });

  it('should validate infra error', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest
      .spyOn(fakeVaccinationPointsRepository, 'findById')
      .mockImplementation(() => Promise.resolve(left(makeError())));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(makeError());
  });
});
