import { InvalidCoordinate, InvalidLocation } from '../errors';
import { Location } from './location';

const makeSut = () => ({ sut: Location });

const makeFixture = (address = 'Avenida Inglaterra', addressNumber = 20, latitude = 41.40338, longitude = 2.17403) => ({
  address,
  addressNumber,
  coordinate: {
    latitude,
    longitude
  }
});

describe('Location Unitary Tests', () => {
  it('should create a valid location object', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const location = testable.value as Location;

    expect(location.address).toEqual('Avenida Inglaterra');
    expect(location.addressNumber).toEqual(20);
    expect(location.coordinate).toEqual({
      latitude: 41.40338,
      longitude: 2.17403
    });
  });

  it('should validate address param', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture(null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidLocation('Address is required'));
  });

  it('should validate address number param', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture(undefined, null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidLocation('Address number is required'));
  });

  it('should validate coordinate param', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture(undefined, undefined, null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCoordinate('Latitude is required'));
  });
});
