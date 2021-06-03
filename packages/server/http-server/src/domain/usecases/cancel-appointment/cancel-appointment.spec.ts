import { Appointment, Cancellation } from '@entities/appointment';
import { Conclusion } from '@entities/appointment/conclusion';
import { InvalidAppointment, InvalidCancellation } from '@entities/appointment/errors';
import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { EntityID, left } from '@server/shared';
import { AppointmentIsAlreadyCancelled, AppointmentIsAlreadyConcluded } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { FakeCancellationsRepository } from '@usecases/output-ports/repositories/cancellations';
import { CancelAppointmentUseCase } from './cancel-appointment';

const makeSut = () => {
  const fakeAppointmentsRepository = new FakeAppointmentsRepository();
  const fakeCancellationsRepository = new FakeCancellationsRepository();

  return {
    sut: new CancelAppointmentUseCase(fakeAppointmentsRepository, fakeCancellationsRepository),
    fakeAppointmentsRepository,
    fakeCancellationsRepository
  };
};

const makeFixture = (cancellation?: Cancellation, conclusion?: Conclusion) => {
  const appointment = Appointment.create({
    id: new EntityID('to_cancel_appointment'),
    date: new Date(),
    patient: {} as Patient,
    vaccinationPoint: {} as VaccinationPoint,
    cancellation,
    conclusion
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
    const { sut } = makeSut();

    const { createdAt } = makeFixture();

    const testable = await sut.execute({
      ...makeFixture(),
      createdAt
    });

    expect(testable.isRight()).toBeTruthy();

    const appointment = testable.value as Appointment;
    expect(appointment.id.value).toEqual('to_cancel_appointment');

    const { cancellation } = appointment;
    expect(cancellation.id.value).toBeDefined();
    expect(cancellation.createdAt).toEqual(createdAt);
    expect(cancellation.cancelatedBy.id.value).toEqual('who_cancelled');
    expect(cancellation.reason).toEqual("mother's birthday");
  });

  it('should check if appointment is already cancelled', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({} as Cancellation));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyCancelled());
  });

  it('should check if appointment is already concluded', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(undefined, {} as Conclusion));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AppointmentIsAlreadyConcluded());
  });

  it('should validate cancellation object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      ...makeFixture(),
      createdAt: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Created at is required'));
  });

  it('should validate appointment object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      ...makeFixture(),
      appointment: { id: new EntityID() } as Appointment
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAppointment('Patient is required'));
  });

  describe('Infra Error validation', () => {
    it("should validate AppointmentsRepository's save", async () => {
      const { sut, fakeAppointmentsRepository } = makeSut();

      jest.spyOn(fakeAppointmentsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeError());
    });

    it("should validate CancellationsRepository's save", async () => {
      const { sut, fakeCancellationsRepository } = makeSut();

      jest.spyOn(fakeCancellationsRepository, 'save').mockImplementation(() => Promise.resolve(left(makeError())));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeError());
    });
  });
});
