import { Appointment } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { InvalidConclusion } from '@entities/appointment/errors';
import { HealthProfessional } from '@entities/health-professional';
import { Patient } from '@entities/patient';
import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { EntityID, left, right } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeCancellationsRepository } from '@usecases/output-ports/repositories/cancellations';
import { FakeConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { ConcludeAppointmentUseCase } from './conclude-appointment';

const makeSut = () => {
  const fakeCancellationsRepository = new FakeCancellationsRepository();
  const fakeConclusionsRepository = new FakeConclusionsRepository();

  return {
    sut: new ConcludeAppointmentUseCase(fakeConclusionsRepository, fakeCancellationsRepository),
    fakeConclusionsRepository,
    fakeCancellationsRepository
  };
};

const makeFixture = () => {
  const appointment = Appointment.create({
    id: new EntityID('to_keep_id'),
    date: new Date(),
    patient: {} as Patient,
    vaccinationPoint: {} as VaccinationPoint
  }).value as Appointment;
  const vaccinatedBy = { id: new EntityID('who_vaccinated') } as HealthProfessional;
  const vaccineBatch = { id: new EntityID('vaccine_batch_used') } as VaccineBatch;

  return {
    appointment,
    vaccinatedBy,
    vaccineBatch,
    vaccinatedAt: new Date()
  };
};

describe('Conclude Appointment Use Case Unitary Tests', () => {
  it('should conclude a appointment successfully', async () => {
    const { sut, fakeCancellationsRepository, fakeConclusionsRepository } = makeSut();

    jest.spyOn(fakeCancellationsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));
    jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

    const { vaccinatedAt, ...fixture } = makeFixture();

    const testable = await sut.execute({
      vaccinatedAt,
      ...fixture
    });

    expect(testable.isRight()).toBeTruthy();

    const conclusion = testable.value as Conclusion;

    expect(conclusion.id.value).toBeDefined();
    expect(conclusion.vaccinatedAt).toEqual(vaccinatedAt);
    expect(conclusion.vaccinatedBy.id.value).toEqual('who_vaccinated');
    expect(conclusion.vaccineBatch.id.value).toEqual('vaccine_batch_used');
    expect(conclusion.appointment.id.value).toEqual('to_keep_id');
  });

  it('should check if the appointment is already cancelled', async () => {
    const { sut, fakeConclusionsRepository } = makeSut();

    jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyCancelled());
  });

  it('should check if the appointment is already concluded', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyConcluded());
  });

  it('should validate conclusion props', async () => {
    const { sut, fakeCancellationsRepository, fakeConclusionsRepository } = makeSut();

    jest.spyOn(fakeCancellationsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));
    jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({
      ...makeFixture(),
      vaccineBatch: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidConclusion('Vaccine Batch is required'));
  });

  describe('Infra Error validation', () => {
    const makeInfraError = () => new InfraError('Unexpected Error');

    it("should validate ConclusionsRepository's save", async () => {
      const { sut, fakeConclusionsRepository, fakeCancellationsRepository } = makeSut();

      jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));
      jest
        .spyOn(fakeCancellationsRepository, 'findByAppointment')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest.spyOn(fakeConclusionsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });

    it("should validate ConclusionsRepository's findByAppointment", async () => {
      const { sut, fakeConclusionsRepository } = makeSut();

      jest
        .spyOn(fakeConclusionsRepository, 'findByAppointment')
        .mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });

    it("should validate Cancellation's findByAppointment", async () => {
      const { sut, fakeConclusionsRepository, fakeCancellationsRepository } = makeSut();

      jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));
      jest
        .spyOn(fakeCancellationsRepository, 'findByAppointment')
        .mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
