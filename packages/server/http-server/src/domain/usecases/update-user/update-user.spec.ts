import { User } from '@entities/user';
import { InvalidUserName } from '@entities/user/errors';
import { left, right } from '@server/shared';
import { AccountAlreadyExists, PasswordDoesNotMatch, UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { UpdateUserUseCase } from './update-user';

const makeFixture = (
  id = 'unique_id',
  name = 'any_correct_name',
  email = 'any_correct_email@mail.com',
  phone = '(99) 99999-9999',
  password = 'any_correct_password',
  currentPassword = 'any_password'
) => ({
  id,
  name,
  email,
  phone,
  password,
  currentPassword
});

const makeSut = () => {
  const fakeUsersRepository = new FakeUsersRepository();

  return {
    sut: new UpdateUserUseCase(fakeUsersRepository),
    fakeUsersRepository
  };
};

describe('Update User UseCase Unitary Tests', () => {
  it('should update user', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'findByEmail');
    spyFakeUsersRepository.mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const user = testable.value as User;

    expect(user.id.value).toEqual('unique_id');
    expect(user.name).toEqual('any_correct_name');
    expect(user.email.email).toEqual('any_correct_email@mail.com');
    expect(user.phone.phone).toEqual('99999999999');
  });

  it("should validate user's object", async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(undefined, null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidUserName('Name is required'));
  });

  it('should validate if user exists', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'findById');
    spyFakeUsersRepository.mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new UserNotFound());
  });

  it('should validate if user email already in use', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AccountAlreadyExists(makeFixture().email));
  });

  it('should validate if user password match', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'findByEmail');
    spyFakeUsersRepository.mockImplementation(() => Promise.resolve(right(null)));

    const fixture = {
      ...makeFixture(),
      currentPassword: 'another_password'
    };

    const testable = await sut.execute(fixture);

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PasswordDoesNotMatch());
  });

  describe('validate infra errors', () => {
    it('should validate findById', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'findById');
      spyFakeUsersRepository.mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate findByEmail', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'findByEmail');
      spyFakeUsersRepository.mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate save', async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest.spyOn(fakeUsersRepository, 'findByEmail').mockImplementation(() => Promise.resolve(right(null)));

      const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'save');
      spyFakeUsersRepository.mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
