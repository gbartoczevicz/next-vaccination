import { Appointment, Cancellation } from '@entities/appointment';
import { InvalidCancellation } from '@entities/appointment/errors';
import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { EntityID, left, right } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeCancellationsRepository } from '@usecases/output-ports/repositories/cancellations';
import { FakeConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { CancelAppointmentUseCase } from './cancel-appointment';

const makeSut = () => {
  const fakeConclusionsRepository = new FakeConclusionsRepository();
  const fakeCancellationsRepository = new FakeCancellationsRepository();

  return {
    sut: new CancelAppointmentUseCase(fakeConclusionsRepository, fakeCancellationsRepository),
    fakeConclusionsRepository,
    fakeCancellationsRepository
  };
};

const makeFixture = () => {
  const appointment = Appointment.create({
    id: new EntityID('to_cancel_appointment'),
    date: new Date(),
    patient: {} as Patient,
    vaccinationPoint: {} as VaccinationPoint
  }).value as Appointment;

  const cancelatedBy = { id: new EntityID('who_cancelled') } as User;

  return {
    appointment,
    cancelatedBy,
    reason: "mother's birthday",
    createdAt: new Date()
  };
};

const makeError = () => new InfraError('Unexpected Error');

describe('Cancel Appointment UseCase Unitary Test', () => {
  it('should cancel an appointment', async () => {
    const { sut, fakeCancellationsRepository, fakeConclusionsRepository } = makeSut();

    jest.spyOn(fakeCancellationsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));
    jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

    const { createdAt } = makeFixture();

    const testable = await sut.execute({
      ...makeFixture(),
      createdAt
    });

    expect(testable.isRight()).toBeTruthy();

    const cancellation = testable.value as Cancellation;

    expect(cancellation.id.value).toBeDefined();
    expect(cancellation.createdAt).toEqual(createdAt);
    expect(cancellation.cancelatedBy.id.value).toEqual('who_cancelled');
    expect(cancellation.reason).toEqual("mother's birthday");
    expect(cancellation.appointment.id.value).toEqual('to_cancel_appointment');
  });

  it('should check if appointment is already concluded', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyConcluded());
  });

  it('should check if appointment is already cancelled', async () => {
    const { sut, fakeConclusionsRepository } = makeSut();

    jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyCancelled());
  });

  it('should validate cancellation object', async () => {
    const { sut, fakeConclusionsRepository, fakeCancellationsRepository } = makeSut();

    jest.spyOn(fakeCancellationsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));
    jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({
      ...makeFixture(),
      createdAt: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Created at is required'));
  });

  describe('Infra Error validation', () => {
    it("should validate ConclusionsRepository's save", async () => {
      const { sut, fakeConclusionsRepository } = makeSut();

      jest
        .spyOn(fakeConclusionsRepository, 'findByAppointment')
        .mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeError());
    });

    it("should validate CancellationsRepository's save", async () => {
      const { sut, fakeConclusionsRepository, fakeCancellationsRepository } = makeSut();

      jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeCancellationsRepository, 'findByAppointment')
        .mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeError());
    });

    it("should validate CancellationsRepository's save", async () => {
      const { sut, fakeConclusionsRepository, fakeCancellationsRepository } = makeSut();

      jest.spyOn(fakeConclusionsRepository, 'findByAppointment').mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeCancellationsRepository, 'findByAppointment')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest.spyOn(fakeCancellationsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeError());
    });
  });
});
