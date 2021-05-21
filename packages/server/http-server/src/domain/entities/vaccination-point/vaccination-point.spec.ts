import { InvalidLocation, InvalidVaccinationPoint } from './errors';
import { VaccinationPoint } from './vaccination-point';
import { Location } from './values';

const makeFixture = () => ({
  name: 'Valid Name',
  phone: '0000-0000',
  document: 'document',
  location: Location.create({
    address: 'Avenida Inglaterra',
    addressNumber: 20,
    coordinate: {
      latitude: 41.40338,
      longitude: 2.17403
    }
  }).value as Location
});

const makeSut = () => ({ sut: VaccinationPoint });

describe('Vaccination Point Unitary Tests', () => {
  it('should create a valid vaccination point object', () => {
    const { sut } = makeSut();

    const testable = sut.create(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoint = testable.value as VaccinationPoint;

    expect(vaccinationPoint.name).toEqual('Valid Name');
    expect(vaccinationPoint.phone.phone).toEqual('00000000');
    expect(vaccinationPoint.document).toEqual('document');
    expect(vaccinationPoint.location).toEqual(makeFixture().location);
  });

  it('should validate name param', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      name: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccinationPoint('Name is required'));
  });

  it('should validate phone param', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      phone: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccinationPoint('Phone number is required'));
  });

  it('should validate document param', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      document: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccinationPoint('Document is required'));
  });

  it('should validate location param', () => {
    const { sut } = makeSut();

    const testable = sut.create({
      ...makeFixture(),
      location: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidLocation('Location is required'));
  });
});
