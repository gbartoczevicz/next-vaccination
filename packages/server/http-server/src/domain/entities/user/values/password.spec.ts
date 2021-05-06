import { makePassword } from '@entities/user/values/factories/make-password';
import { UserPassword, IUserPasswordProps } from '@entities/user/values';
import { InvalidUserPassword } from '@entities/user/errors';

const makeFixture = ({ password, hashed = false }: IUserPasswordProps) => ({
  hashed,
  password
});

const makeSut = () => {
  return {
    sut: makePassword
  };
};

describe('Password Unitary Tests', () => {
  it('should be create a non hashed valid password', () => {
    const { sut } = makeSut();

    const testableEmptyPassword = sut(makeFixture({ password: '' }));
    expect(testableEmptyPassword.value).toEqual(new InvalidUserPassword('Password must not be null or undefined'));

    const testableLenghtPassword = sut(makeFixture({ password: '>8' }));
    expect(testableLenghtPassword.value).toEqual(new InvalidUserPassword('Password must have at least 8 characters'));

    const testableSpacedPassword = sut(makeFixture({ password: '12345678 ' }));
    expect(testableSpacedPassword.value).toEqual(new InvalidUserPassword('Password must not contain white spaces'));
  });

  describe('Encrypt', () => {
    it('should be encrypt password', async () => {
      const { sut } = makeSut();

      const makedSut = sut(makeFixture({ password: 'any_correct_password' }));
      const testable = <UserPassword>makedSut.value;

      const spyEncrypt = jest.spyOn(testable.encrypter, 'encrypt');

      await testable.encrypt();

      expect(spyEncrypt).toHaveBeenCalledTimes(1);
      expect(spyEncrypt).toHaveBeenCalledWith('any_correct_password');
    });

    it('should be encrypt password if hashed === false', async () => {
      const { sut } = makeSut();

      const makedSut = sut(makeFixture({ password: 'any_correct_password', hashed: true }));
      const testable = <UserPassword>makedSut.value;

      const spyEncrypt = jest.spyOn(testable.encrypter, 'encrypt');

      await testable.encrypt();

      expect(spyEncrypt).toHaveBeenCalledTimes(0);
    });
  });

  describe('Compare', () => {
    it('should be compare non encrypted passwords', async () => {
      const { sut } = makeSut();

      const makedSut = sut(makeFixture({ password: 'any_correct_password' }));
      const testable = <UserPassword>makedSut.value;

      expect(await testable.compare('another_correct_password')).toBeFalsy();
    });

    it('should be compare encrypted passwords', async () => {
      const { sut } = makeSut();

      const makedSut = sut(makeFixture({ password: 'any_correct_password', hashed: true }));
      const testable = <UserPassword>makedSut.value;

      const spyCompare = jest.spyOn(testable.encrypter, 'compare');

      await testable.compare('another_correct_password');

      expect(spyCompare).toHaveBeenCalledTimes(1);
      expect(spyCompare).toHaveBeenCalledWith('any_correct_password', 'another_correct_password');
    });
  });
});
