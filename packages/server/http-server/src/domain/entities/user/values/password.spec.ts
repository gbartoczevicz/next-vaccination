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

    const testableLenghtPassword = sut.create(makeFixture({ password: '>8' }));
    expect(testableLenghtPassword.value).toEqual(new InvalidUserPassword('Password must have at least 8 characters'));

    const testableSpacedPassword = sut.create(makeFixture({ password: '12345678 ' }));
    expect(testableSpacedPassword.value).toEqual(new InvalidUserPassword('Password must not contain white spaces'));
  });
});
