import { User } from '@entities/user';
import { EntityID } from '@server/shared';
import { Cancellation } from './cancellation';
import { InvalidCancellation } from './errors';

const makeSut = () => ({ sut: Cancellation });

describe('Cancellation Unitary Tests', () => {
  it('should create a valid cancellation entity', () => {
    const { sut } = makeSut();

    const createdAt = new Date();

    const testable = sut.create({
      reason: 'Cancellation Reason',
      createdAt,
      cancelatedBy: { id: new EntityID('cancelated_by') } as User
    });

    expect(testable.isRight()).toBeTruthy();

    const cancellation = testable.value as Cancellation;

    expect(cancellation.id).toBeDefined();
    expect(cancellation.reason).toEqual('Cancellation Reason');
    expect(cancellation.createdAt).toEqual(createdAt);
    expect(cancellation.cancelatedBy.id.value).toEqual('cancelated_by');
  });

  it('should validate reason', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      reason: null,
      createdAt: new Date(),
      cancelatedBy: { id: new EntityID('cancelated_by') } as User
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Reason is required'));
  });

  it('should validate created at', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      reason: 'Cancellation Reason',
      createdAt: null,
      cancelatedBy: { id: new EntityID('cancelated_by') } as User
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Created at is required'));
  });

  it('should validate cancelated by', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      reason: 'Cancellation Reason',
      createdAt: new Date(),
      cancelatedBy: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Cancelated By is required'));
  });
});
