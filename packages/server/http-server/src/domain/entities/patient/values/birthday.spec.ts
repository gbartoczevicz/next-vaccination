import { InvalidBirthday } from '../errors';
import { PatientBirthday } from './birthday';
import { makeBirthday } from './factories/make-birthday';

const makeSut = () => ({
  sut: makeBirthday
});

const makeFixture = (date: Date) => {
  const dateAtStartOfDay = new Date(date);

  dateAtStartOfDay.setHours(0, 0, 0, 0);

  return dateAtStartOfDay;
};

describe('Birthday Unitary Tests', () => {
  it('should create a valid birthday object', () => {
    const { sut } = makeSut();

    const fixture = makeFixture(new Date());

    const testable = sut(fixture);

    expect(testable.isRight()).toBeTruthy();

    const birthday = testable.value as PatientBirthday;

    expect(birthday.value).toEqual(fixture);
  });

  it('should validate a null param', () => {
    const { sut } = makeSut();

    const testable = sut(null);

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidBirthday('Date is required'));
  });
});
