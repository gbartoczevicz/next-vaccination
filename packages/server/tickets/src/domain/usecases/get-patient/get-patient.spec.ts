import { Patient } from '@entities/patient';
import { left, right } from '@server/shared';
import { PatientNotFound } from '@usecases/errors';
import { makeInfraError } from '@usecases/output-ports/errors';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { GetPatientUseCase } from './get-patient';

const makeSut = () => {
  const fakePatientsRepository = new FakePatientsRepository();

  return {
    sut: new GetPatientUseCase(fakePatientsRepository),
    fakePatientsRepository
  };
};

describe('Get Patients Use Case Unitary Tests', () => {
  it('should get a valid patient', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      id: 'to_find_patient'
    });

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.id.value).toEqual('to_find_patient');
    expect(patient.user).toBeDefined();
    expect(patient.avatar).toEqual('avatar.png');
  });

  it('should validate if patient exists', async () => {
    const { sut, fakePatientsRepository } = makeSut();

    jest.spyOn(fakePatientsRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({
      id: 'to_find_patient'
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PatientNotFound());
  });

  describe('infra error validation', () => {
    it('should validate PatientsRepository findById', async () => {
      const { sut, fakePatientsRepository } = makeSut();

      jest.spyOn(fakePatientsRepository, 'findById').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute({
        id: 'to_find_patient'
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
