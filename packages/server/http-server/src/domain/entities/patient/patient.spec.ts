import { User } from '@entities/user';
import { UserPassword } from '@entities/user/values';
import { makePassword } from '@entities/user/values/factories/make-password';
import { InvalidBirthday, InvalidPatient } from './errors';
import { Patient } from './patient';

const makeFixture = (
  birthday = new Date(),
  avatar = 'avatar.png',
  document = '000.000.000-00',
  ticket = 'ticket.pdf'
) => {
  return {
    birthday,
    avatar,
    document,
    ticket,
    user: User.create({
      name: 'Name',
      email: 'any_correct_email@mail.com',
      phone: '0000-0000',
      password: <UserPassword>makePassword({ password: 'valid_password' }).value
    }).value as User
  };
};

const makeSut = () => ({ sut: Patient });

describe('Patient Unitary Tests', () => {
  it('should create a valid Patient', () => {
    const { sut } = makeSut();

    const { birthday, user } = makeFixture();

    const testable = sut.create({
      ...makeFixture(),
      birthday,
      user
    });

    expect(testable.isRight()).toBeTruthy();

    const patient = testable.value as Patient;

    expect(patient.document).toEqual('000.000.000-00');
    expect(patient.birthday.date).toEqual(birthday);
    expect(patient.avatar).toEqual('avatar.png');
    expect(patient.ticket).toEqual('ticket.pdf');
    expect(patient.user).toEqual(user);
  });

  describe('create an invalid patient object', () => {
    it('should validate user param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture(),
        user: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidPatient('User is required'));
    });

    it('should validate document param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture(),
        document: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidPatient('Document is required'));
    });

    it('should validate birthday param', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture(),
        birthday: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidBirthday('Date is required'));
    });
  });
});
