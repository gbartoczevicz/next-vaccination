import { Appointment, Cancellation } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { InvalidAppointment, InvalidConclusion } from '@entities/appointment/errors';
import { HealthProfessional } from '@entities/health-professional';
import { Patient } from '@entities/patient';
import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { EntityID, left } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { FakeConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { ConcludeAppointmentUseCase } from './conclude-appointment';

const makeSut = () => {
  const fakeAppointmentsRepository = new FakeAppointmentsRepository();
  const fakeConclusionsRepository = new FakeConclusionsRepository();

  return {
    sut: new ConcludeAppointmentUseCase(fakeAppointmentsRepository, fakeConclusionsRepository),
    fakeAppointmentsRepository,
    fakeConclusionsRepository
  };
};

const makeFixture = (conclusion?: Conclusion, cancellation?: Cancellation) => {
  const appointment = Appointment.create({
    id: new EntityID('to_keep_id'),
    date: new Date(),
    cancellation,
    conclusion,
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
    const { sut } = makeSut();

    const { vaccinatedAt, ...fixture } = makeFixture();

    const testable = await sut.execute({
      ...fixture,
      vaccinatedAt
    });

    expect(testable.isRight()).toBeTruthy();

    const appointment = testable.value as Appointment;

    expect(appointment.id.value).toEqual('to_keep_id');
    expect(appointment.conclusion).toBeDefined();
    expect(appointment.cancellation).toBeUndefined();

    const { conclusion } = appointment;

    expect(conclusion.id.value).toBeDefined();
    expect(conclusion.vaccinatedAt).toEqual(vaccinatedAt);
    expect(conclusion.vaccinatedBy.id.value).toEqual('who_vaccinated');
    expect(conclusion.vaccineBatch.id.value).toEqual('vaccine_batch_used');
  });

  it('should check if the appointment is already cancelled', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(undefined, {} as Cancellation));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyCancelled());
  });

  it('should check if the appointment is already concluded', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({} as Conclusion));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyConcluded());
  });

  it('should validate conclusion props', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      ...makeFixture(),
      vaccineBatch: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidConclusion('Vaccine Batch is required'));
  });

  it('should validate appointment props', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      ...makeFixture(),
      appointment: {} as Appointment
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAppointment('Patient is required'));
  });

  describe('Infra Error validation', () => {
    const makeInfraError = () => new InfraError('Unexpected Error');

    it("should validate ConclusionsRepository's save", async () => {
      const { sut, fakeConclusionsRepository } = makeSut();

      jest.spyOn(fakeConclusionsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });

    it("should validate AppointmentsRepository's save", async () => {
      const { sut, fakeAppointmentsRepository } = makeSut();

      jest.spyOn(fakeAppointmentsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
