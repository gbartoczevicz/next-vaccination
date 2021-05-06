import { User } from '@entities/user';
import { InvalidUserEmail } from '@entities/user/errors';
import { left } from '@server/shared';
import { CreateUserUseCase } from '@usecases/create-user';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users/fake';

const makeFixture = ({
  name = 'any_correct_name',
  email = 'any_correct_email@mail.com',
  phone = '(99) 99999-9999',
  password = 'any_correct_password'
}) => ({
  name,
  email,
  phone,
  password
});

interface SutTypes {
  sut: CreateUserUseCase;
  fakeUsersRepository: FakeUsersRepository;
}

const makeSut = (): SutTypes => {
  const fakeUsersRepository = new FakeUsersRepository();
  const sut = new CreateUserUseCase(fakeUsersRepository);

  return {
    sut,
    fakeUsersRepository
  };
};

describe('Create User Use Case Unitary Tests', () => {
  it('should instance correct User', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({}));

    const user = <User>testable.value;

    expect(testable.isRight()).toBeTruthy();
    expect(typeof user.id.value).toEqual('string');
    expect(user.name).toEqual('any_correct_name');
    expect(user.email.email).toEqual('any_correct_email@mail.com');
    expect(user.phone.phone).toEqual('99999999999');
  });

  it('should return left if User params is invalid', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ email: 'any_wrong_email' }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidUserEmail('E-mail any_wrong_email is invalid'));
  });

  it('should return left if email already in use', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    const spyFakeUsersRepository = jest.spyOn(fakeUsersRepository, 'findByEmail');
    spyFakeUsersRepository.mockImplementation(() => Promise.resolve(left(new InfraError('any_infra_error'))));

    const testable = await sut.execute(makeFixture({}));

    expect(spyFakeUsersRepository).toHaveBeenCalledTimes(1);
    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('any_infra_error'));
  });
});
