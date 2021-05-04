import { UserPassword, IUserPasswordProps } from '@entities/user/values';
import { InvalidUserPassword } from '@entities/user/errors';

const makeFixture = ({ password, hashed = false }: IUserPasswordProps) => ({
  hashed,
  password
});

const makeSut = () => {
  return {
    sut: UserPassword
  };
};

describe('Password Unitary Tests', () => {
  it('should be create a non hashed valid password', () => {
    const { sut } = makeSut();

    const testableEmptyPassword = sut.create(makeFixture({ password: '' }));
    expect(testableEmptyPassword.value).toEqual(new InvalidUserPassword('Password must not be null or undefined'));
  });
});
