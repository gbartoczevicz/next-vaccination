import { User } from '@entities/user';

const makeSut = () => {
  return {
    sut: User
  };
};

describe('User Unitary Tests', () => {
  it('should create a valid user', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      phone: '(99) 99999-9999',
      password: {
        password: 'any_password'
      }
    });

    const user = <User>testable.value;

    expect(testable.isRight()).toBeTruthy();
    expect(typeof user.id.value).toEqual('string');
    expect(user.name).toEqual('any_name');
    expect(user.email.email).toEqual('any_email@mail.com');
    expect(user.phone.phone).toEqual('99999999999');
  });
});
