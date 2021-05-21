import { InvalidCoordinate } from '../errors';
import { Coordinate } from './coordinate';

const makeSut = () => {
  return {
    sut: Coordinate
  };
};

describe('Coordinate Unitary Tests', () => {
  it('should create a valid object', () => {
    const { sut } = makeSut();

    const testable = sut.create({ latitude: 10.0, longitude: 20.0 });

    expect(testable.isRight()).toBeTruthy();

    const coordinate = testable.value as Coordinate;

    expect(coordinate.latitude).toEqual(10.0);
    expect(coordinate.longitude).toEqual(20.0);
  });

  describe('Props validation', () => {
    it('should validate latitude param', () => {
      const { sut } = makeSut();

      const testable = sut.create({ latitude: null, longitude: 20.0 });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidCoordinate('Latitude is required'));
    });

    it('should validate longitude param', () => {
      const { sut } = makeSut();

      const testable = sut.create({ latitude: 10.0, longitude: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidCoordinate('Longitude is required'));
    });
  });
});
