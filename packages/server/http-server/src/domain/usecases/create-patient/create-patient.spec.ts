import { Patient } from '@entities/patient';
import { InvalidPatient } from '@entities/patient/errors';
import { User } from '@entities/user';
import { left, right } from '@server/shared';
import { DocumentAlreadyInUse } from '@usecases/errors/document-already-in-use';
import { InfraError } from '@usecases/output-ports/errors';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { CreatePatientUseCase } from './create-patient';

const makeSut = () => {
  const fakePatientsRepository = new FakePatientsRepository();

  return {
    fakePatientsRepository,
    sut: new CreatePatientUseCase(fakePatientsRepository)
  };
};

const makeFixture = (document = '000.000.000-00', birthday = new Date(), avatar = 'avatar.png') => {
  const user = User.create({
    name: 'any_correct_name',
    email: 'any_correct_email@mail.com',
    phone: '(99) 99999-9999',
    password: { password: 'any_correct_password' }
  }).value as User;

  return {
    document,
    user,
    birthday,
    avatar
  };
};

describe('Create Patient Use Case Unitary Tests', () => {
  it('should create a patient', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'findByDocument');
    spyFakePatientsRepository.mockImplementation(() => Promise.resolve(right(null)));

    const date = new Date();

    const testable = await sut.execute(makeFixture(undefined, date, undefined));

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.document).toEqual('000.000.000-00');
    expect(patient.birthday.date).toEqual(date);
    expect(patient.avatar).toEqual('avatar.png');
    expect(patient.user).toBeDefined();
  });

  it('should validate patient object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidPatient('Document is required'));
  });

  it('should check if document is already in use', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'findByDocument');

    const testable = await sut.execute(makeFixture());

    expect(spyFakePatientsRepository).toHaveBeenCalledTimes(1);
    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new DocumentAlreadyInUse());
  });

  it('should return left if save returns an infra error', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest.spyOn(fakePatientsRepository, 'findByDocument').mockImplementation(() => Promise.resolve(right(null)));

    const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'save');
    spyFakePatientsRepository.mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

    const testable = await sut.execute(makeFixture());

    expect(spyFakePatientsRepository).toHaveBeenCalledTimes(1);
    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('Unexpected Error'));
  });
});
