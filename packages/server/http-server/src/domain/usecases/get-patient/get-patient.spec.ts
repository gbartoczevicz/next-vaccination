import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { EntityID, left, right } from '@server/shared';
import { PatientNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { GetPatientUseCase } from './get-patient';

const makeSut = () => {
  const fakePatientsRepository = new FakePatientsRepository();

  return {
    sut: new GetPatientUseCase(fakePatientsRepository),
    fakePatientsRepository
  };
};

const makeFixture = () => {
  const fixture = User.create({
    id: new EntityID('unique_user_id'),
    name: 'any name',
    email: 'any_email@email.com',
    password: { password: 'any_password' },
    phone: '0000-0000'
  }).value as User;

  return {
    user: fixture
  };
};

describe('Get Patient UseCase Unitary Tests', () => {
  it('should get a valid patient', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.user.id.value).toEqual('unique_user_id');
  });

  it('should validate if patient exists', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest.spyOn(fakePatientsRepository, 'findByUser').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PatientNotFound());
  });

  it('should validate infra error', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest
      .spyOn(fakePatientsRepository, 'findByUser')
      .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('Unexpected Error'));
  });
});
