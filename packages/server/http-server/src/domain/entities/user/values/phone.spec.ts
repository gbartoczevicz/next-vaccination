import { UserPhone } from '@entities/user/values';
import { InvalidUserPhone } from '@entities/user/errors';

const makeSut = () => {
  return {
    sut: UserPhone
  };
};

describe('Phone Unitary Tests', () => {
  it('should create a valid phone', () => {
    const { sut } = makeSut();

    const testable = sut.create('(99) 4002-8922');

    expect(testable.isRight()).toBeTruthy();
    expect(testable.isLeft()).toBeFalsy();
    if (testable.isRight()) {
      expect(testable.value.value).toEqual('9940028922');
    }
  });

  it('should return left when creating an invalid phone', () => {
    const { sut } = makeSut();

    const testable = sut.create('any_wrong_phone');

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidUserPhone(`Phone number momento ronaldo is invalid`));
  });
});
