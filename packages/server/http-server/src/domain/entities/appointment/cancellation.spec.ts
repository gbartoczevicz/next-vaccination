import { User } from '@entities/user';
import { EntityID } from '@server/shared';
import { Appointment } from './appointment';
import { Cancellation } from './cancellation';
import { InvalidCancellation } from './errors';

const makeSut = () => ({ sut: Cancellation });

const makeFixture = () => ({
  reason: 'Cancellation Reason',
  createdAt: new Date(),
  cancelatedBy: { id: new EntityID('cancelated_by') } as User,
  appointment: { id: new EntityID('appointment_id') } as Appointment
});

describe('Cancellation Unitary Tests', () => {
  it('should create a valid cancellation entity', () => {
    const { sut } = makeSut();

    const { createdAt, ...fixture } = makeFixture();

    const testable = sut.create({ createdAt, ...fixture });

    expect(testable.isRight()).toBeTruthy();

    const cancellation = testable.value as Cancellation;

    expect(cancellation.id).toBeDefined();
    expect(cancellation.reason).toEqual('Cancellation Reason');
    expect(cancellation.createdAt).toEqual(createdAt);
    expect(cancellation.cancelatedBy.id.value).toEqual('cancelated_by');
    expect(cancellation.appointment.id.value).toEqual('appointment_id');
  });

  it('should validate reason', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      reason: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Reason is required'));
  });

  it('should validate created at', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      createdAt: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Created at is required'));
  });

  it('should validate cancelated by', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      cancelatedBy: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Cancelated By is required'));
  });

  it('should validate appointment', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      appointment: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Appointment is required'));
  });
});
