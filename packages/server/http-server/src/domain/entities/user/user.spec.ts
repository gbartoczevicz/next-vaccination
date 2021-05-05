import { User } from '@entities/user';
import { InvalidUserName, InvalidUserPhone } from '@entities/user/errors';

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

  it('should be return left if name to be false', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      name: '',
      email: 'any_email@mail.com',
      phone: '(99) 99999-9999',
      password: {
        password: 'any_password'
      }
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidUserName('Name is required'));
  });

  it('should be return left if any value object is wrong', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      name: 'any_name',
      email: 'any_email@mail.com',
      phone: 'any_wrong_phone',
      password: {
        password: 'any_password'
      }
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidUserPhone('Phone number any_wrong_phone is invalid'));
  });
});
