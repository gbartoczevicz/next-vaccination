import { Phone } from '@entities/phone';
import { InvalidPhone } from '@entities/phone/errors';

const makeSut = () => {
  return {
    sut: Phone
  };
};

describe('Phone Unitary Tests', () => {
  it('should create a valid phone', () => {
    const { sut } = makeSut();

    let testable = sut.create('(99) 4002-8922');
    expect(testable.isRight()).toBeTruthy();
    expect((<Phone>testable.value).value).toEqual('9940028922');

    testable = sut.create('(099) 91029-1029');
    expect(testable.isRight()).toBeTruthy();
    expect((<Phone>testable.value).value).toEqual('099910291029');

    testable = sut.create('1029-1029');
    expect(testable.isRight()).toBeTruthy();
    expect((<Phone>testable.value).value).toEqual('10291029');
  });

  it('should return left when creating an invalid phone', () => {
    const { sut } = makeSut();

    let testable = sut.create('any_wrong_phone');
    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidPhone(`Phone number any_wrong_phone is invalid`));

    testable = sut.create('(099) 99999-99999');
    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidPhone(`Phone number (099) 99999-99999 is invalid`));

    testable = sut.create('99999');
    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidPhone(`Phone number 99999 is invalid`));
  });
});
