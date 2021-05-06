import { UserEmail } from '@entities/user/values';
import { InvalidUserEmail } from '@entities/user/errors';

const makeSut = () => {
  return {
    sut: UserEmail
  };
};

describe('Email Unitary Tests', () => {
  it('should create a valid email', () => {
    const { sut } = makeSut();

    const testable = sut.create('any_mail@mail.com');

    expect(testable.isRight()).toBeTruthy();
    expect((<UserEmail>testable.value).email).toEqual('any_mail@mail.com');
  });

  describe('Left responses', () => {
    it('should return left when creating value object without value', () => {
      const { sut } = makeSut();

      const testable = sut.create('');

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidUserEmail(`E-mail is required`));
    });

    it('should return left when creating an invalid email', () => {
      const { sut } = makeSut();

      const testable = sut.create('any_wrong_mail');

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidUserEmail(`E-mail any_wrong_mail is invalid`));
    });
  });
});
