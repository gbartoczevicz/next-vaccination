import { InvalidExpirationDate } from '../errors';
import { ExpirationDate } from './expiration-date';
import { makeExpirationDate } from './factories/make-expiration-date';

const makeSut = () => ({ sut: makeExpirationDate });

const makeFixture = (days = 5) => {
  const fixture = new Date();

  fixture.setDate(fixture.getDate() + days);

  return fixture;
};

describe('Expiration Date Unitary Tests', () => {
  it('should create a valid expiration date object', () => {
    const { sut } = makeSut();

    const fixture = makeFixture(5);

    const testable = sut(fixture);

    expect(testable.isRight()).toBeTruthy();

    const expirationDate = testable.value as ExpirationDate;

    expect(expirationDate.value).toEqual(fixture);
  });

  it("should validate if date's value is today or before", () => {
    const { sut } = makeSut();

    const fixture = makeFixture(-10);

    const testable = sut(fixture);

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidExpirationDate('The date must be later than today'));
  });

  describe('params validation', () => {
    it('should validate date param', () => {
      const { sut } = makeSut();

      const testable = sut(null);

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidExpirationDate('Value is required'));
    });

    it.todo('should validate dependency param', () => {});
  });
});
