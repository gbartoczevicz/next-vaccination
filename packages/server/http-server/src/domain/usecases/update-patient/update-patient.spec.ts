import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { left, right } from '@server/shared';
import { DocumentAlreadyInUse, PatientNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { UpdatePatientUseCase } from './update-patient';

const makeSut = () => {
  const fakePatientsRepository = new FakePatientsRepository();

  return {
    sut: new UpdatePatientUseCase(fakePatientsRepository),
    fakePatientsRepository
  };
};

const makeBirthday = (date: Date) => {
  const dateAtStartOfDay = new Date(date);

  dateAtStartOfDay.setHours(0, 0, 0, 0);

  return dateAtStartOfDay;
};

const makeFixture = (document = '000.000.000-00', birthday = new Date()) => {
  const user = User.create({
    name: 'any_correct_name',
    email: 'any_correct_email@mail.com',
    phone: '(99) 99999-9999',
    password: { password: 'any_correct_password' }
  }).value as User;

  return {
    id: 'unique_id',
    document,
    user,
    birthday
  };
};

describe('Update Patient UseCase Unitary Tests', () => {
  it('should update patient', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'findByDocument');
    spyFakePatientsRepository.mockImplementation(() => Promise.resolve(right(null)));

    const date = makeBirthday(new Date());

    const testable = await sut.execute(makeFixture(undefined, date));

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.id.value).toEqual('unique_id');
    expect(patient.birthday.value).toEqual(date);
    expect(patient.document).toEqual('000.000.000-00');
  });

  it('should check if patient exists', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'findById');
    spyFakePatientsRepository.mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PatientNotFound());
  });

  it("should check if the patient's document is already in use", async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new DocumentAlreadyInUse());
  });

  describe('validate infra errors', () => {
    it('should validate findById', async () => {
      const { sut, fakePatientsRepository } = makeSut();

      const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'findById');
      spyFakePatientsRepository.mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate findByDocument', async () => {
      const { sut, fakePatientsRepository } = makeSut();

      const spyFakePatientsRepository = jest.spyOn(fakePatientsRepository, 'findByDocument');
      spyFakePatientsRepository.mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
