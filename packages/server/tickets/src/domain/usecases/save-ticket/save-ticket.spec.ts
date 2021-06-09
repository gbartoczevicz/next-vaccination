import { Patient } from '@entities/patient';
import { InvalidPatient } from '@entities/patient/errors';
import { makePatient } from '@entities/patient/fake';
import { EntityID, left } from '@server/shared';
import { TicketIsRequired } from '@usecases/errors';
import { makeInfraError } from '@usecases/output-ports/errors';
import { FakePatientsRepository } from '@usecases/output-ports/repositories/patients';
import { SaveTicketUseCase } from './save-ticket';

const makeSut = () => {
  const fakePatientsRepository = new FakePatientsRepository();

  return {
    sut: new SaveTicketUseCase(fakePatientsRepository),
    fakePatientsRepository
  };
};

describe('Save Ticket Use Case Unitary Tests', () => {
  it('should save patient with a ticket', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      patient: makePatient({}) as Patient,
      ticket: 'new_ticket.pdf'
    });

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.id.value).toEqual('patient_id');
    expect(patient.user).toBeDefined();
    expect(patient.avatar).toEqual('avatar.png');
    expect(patient.ticket).toEqual('new_ticket.pdf');
  });

  it('should validate ticket', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      patient: makePatient({}) as Patient,
      ticket: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new TicketIsRequired());
  });

  it('should validate patient object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      patient: { id: new EntityID(), avatar: null } as Patient,
      ticket: 'new_ticket.pdf'
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidPatient('Avatar is required'));
  });

  describe('infra error validation', () => {
    it('should validate PatientsRepository save', async () => {
      const { sut, fakePatientsRepository } = makeSut();

      jest.spyOn(fakePatientsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute({
        patient: makePatient({}) as Patient,
        ticket: 'any'
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
