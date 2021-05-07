import { InvalidBirthday } from '../errors';
import { PatientBirthday } from './birthday';
import { makeBirthday } from './factories/make-birthday';

const makeSut = () => ({
  sut: makeBirthday
});

describe('Birthday Unitary Tests', () => {
  it('should create a valid birthday object', () => {
    const { sut } = makeSut();

    const testable = sut(new Date());

    expect(testable.isRight()).toBeTruthy();
    expect((<PatientBirthday>testable.value).date).toBeInstanceOf(Date);
  });

  describe('create a invalid birthday obect', () => {
    it('should validate a null param', () => {
      const { sut } = makeSut();

      const testable = sut(null);

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidBirthday('Date is required'));
    });
  });
});
