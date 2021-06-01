import { Cancellation } from './cancellation';
import { InvalidCancellation } from './errors';

const makeSut = () => ({ sut: Cancellation });

describe('Cancellation Unitary Tests', () => {
  it('should create a valid cancellation entity', () => {
    const { sut } = makeSut();

    const createdAt = new Date();

    const testable = sut.create({
      reason: 'Cancellation Reason',
      createdAt
    });

    expect(testable.isRight()).toBeTruthy();

    const cancellation = testable.value as Cancellation;

    expect(cancellation.id).toBeDefined();
    expect(cancellation.reason).toEqual('Cancellation Reason');
    expect(cancellation.createdAt).toEqual(createdAt);
  });

  it('should validate reason', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      reason: null,
      createdAt: new Date()
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Reason is required'));
  });

  it('should validate created at', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      reason: 'Cancellation Reason',
      createdAt: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCancellation('Created at is required'));
  });
});
