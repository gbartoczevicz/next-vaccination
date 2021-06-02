import { WrongProperty } from '@usecases/errors/wrong-property';
import { LoginUseCase } from '@usecases/login/login';

const makeSut = () => {
  const sut = new LoginUseCase();

  return {
    sut
  };
};

describe('Login UseCase Unitary Tests', () => {
  test('should returns left if contains invalid requested property', async () => {
    const { sut } = makeSut();

    const testableWithEmptyUser = await sut.execute({ user: '', password: 'any_pass' });
    expect(testableWithEmptyUser.isLeft()).toBeTruthy();
    expect(testableWithEmptyUser.value).toEqual(new WrongProperty('user'));

    const testableWithEmptyPassword = await sut.execute({ user: 'any_user', password: '' });
    expect(testableWithEmptyPassword.isLeft()).toBeTruthy();
    expect(testableWithEmptyPassword.value).toEqual(new WrongProperty('password'));

    const testableWithAllEmpties = await sut.execute({ user: '', password: '' });
    expect(testableWithAllEmpties.isLeft()).toBeTruthy();
    expect(testableWithAllEmpties.value).toEqual(new WrongProperty('user and password'));
  });
});
