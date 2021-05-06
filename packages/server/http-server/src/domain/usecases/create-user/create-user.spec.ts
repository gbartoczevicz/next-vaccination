import { User } from '@entities/user';
import { CreateUserUseCase } from '@usecases/create-user';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users/fake';

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

    const testable = await sut.execute({
      name: 'any_correct_name',
      email: 'any_correct_email@mail.com',
      phone: '(99) 99999-9999',
      password: 'any_correct_password'
    });

    const user = <User>testable.value;

    expect(testable.isRight()).toBeTruthy();
    expect(typeof user.id.value).toEqual('string');
    expect(user.name).toEqual('any_correct_name');
    expect(user.email.email).toEqual('any_correct_email@mail.com');
    expect(user.phone.phone).toEqual('99999999999');
  });
});
