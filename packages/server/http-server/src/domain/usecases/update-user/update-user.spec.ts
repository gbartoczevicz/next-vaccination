import { User } from '@entities/user';
import { InvalidUser } from '@entities/user/errors';
import { UserPassword } from '@entities/user/values';
import { makePassword } from '@entities/user/values/factories/make-password';
import { EntityID, left, right } from '@server/shared';
import { AccountAlreadyExists, PasswordDoesNotMatch } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { UpdateUserUseCase } from './update-user';

const makeSut = () => {
  const fakeUsersRepository = new FakeUsersRepository();

  return {
    sut: new UpdateUserUseCase(fakeUsersRepository),
    fakeUsersRepository
  };
};

const makeFixture = ({
  name = 'Updated User',
  email = 'updated_user@email.com',
  password = 'updated_valid_password',
  phone = '99999-9999',
  currentPassword = 'valid_password'
}) => {
  const user = User.create({
    id: new EntityID('user_id_under_test'),
    name: 'Old User',
    email: 'old_user@mail.com',
    phone: '0000-0000',
    password: makePassword({ password: 'valid_password' }).value as UserPassword
  }).value as User;

  return {
    user,
    name,
    email,
    password,
    phone,
    currentPassword
  };
};

describe('Update User UseCase Unitary Tests', () => {
  it('should update user', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findByEmail').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isRight()).toBeTruthy();

    const user = testable.value as User;

    expect(user.id.value).toEqual('user_id_under_test');
    expect(user.name).toEqual('Updated User');
    expect(user.email.email).toEqual('updated_user@email.com');
    expect(user.password.password).toEqual('updated_valid_password');
    expect(user.phone.phone).toEqual('999999999');
  });

  it('should validate incoming user object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ name: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidUser('Name is required'));
  });

  it('should validate if incoming e-mail is already in use', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ email: 'already_in_use@email.com' }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AccountAlreadyExists('already_in_use@email.com'));
  });

  it('should validate if incoming password does match', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findByEmail').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({ currentPassword: 'to_trigger_error' }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PasswordDoesNotMatch());
  });

  describe('Validate incoming Infra Error from User Repository', () => {
    it('should validate findByEmail', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest
        .spyOn(fakeUsersRepository, 'findByEmail')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate save', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest.spyOn(fakeUsersRepository, 'findByEmail').mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeUsersRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
