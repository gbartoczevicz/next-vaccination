import { User } from '@entities/user';
import { UserPassword } from '@entities/user/values';
import { makePassword } from '@entities/user/values/factories/make-password';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Location } from '@entities/vaccination-point/values';
import { InvalidHealthProfessional } from './errors';
import { HealthProfessional } from './health-professional';

const makeSut = () => ({ sut: HealthProfessional });

const makeFixture = (document = 'health_professional_document') => {
  return {
    document,
    user: User.create({
      name: 'Health Professional',
      email: 'health@mail.com',
      phone: '0000-0000',
      password: makePassword({ password: 'valid_password' }).value as UserPassword
    }).value as User,
    vaccinationPoint: VaccinationPoint.create({
      name: 'Vaccination Point',
      document: 'document',
      phone: '90000-0000',
      location: Location.create({
        address: 'Avenida Inglaterra',
        addressNumber: 20,
        latitude: 41.40338,
        longitude: 2.17403
      }).value as Location
    }).value as VaccinationPoint
  };
};

describe('Health Professional Unitary Tests', () => {
  it('should create a valid non responsible health professional object', () => {
    const { sut } = makeSut();

    const fixture = makeFixture();

    const testable = sut.create(fixture);

    expect(testable.isRight()).toBeTruthy();

    const healthProfessional = testable.value as HealthProfessional;

    expect(healthProfessional.document).toEqual('health_professional_document');
    expect(healthProfessional.user).toEqual(fixture.user);
    expect(healthProfessional.responsible).toBe(false);
    expect(healthProfessional.vaccinationPoint).toEqual(fixture.vaccinationPoint);
  });

  it('should create a valid responsible health professional object', () => {
    const { sut } = makeSut();

    const fixture = { ...makeFixture(), responsible: true };

    const testable = sut.create(fixture);

    expect(testable.isRight()).toBeTruthy();

    const healthProfessional = testable.value as HealthProfessional;

    expect(healthProfessional.document).toEqual('health_professional_document');
    expect(healthProfessional.user).toEqual(fixture.user);
    expect(healthProfessional.responsible).toBe(true);
    expect(healthProfessional.vaccinationPoint).toEqual(fixture.vaccinationPoint);
  });

  describe('should validate health professional params', () => {
    it('should validate document', () => {
      const { sut } = makeSut();

      const testable = sut.create(makeFixture(null));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidHealthProfessional('Document is required'));
    });

    it('should validate user', () => {
      const { sut } = makeSut();

      const testable = sut.create({ ...makeFixture(), user: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidHealthProfessional('User is required'));
    });

    it('should validate vaccinationPoint', () => {
      const { sut } = makeSut();

      const testable = sut.create({ ...makeFixture(), vaccinationPoint: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidHealthProfessional('Vaccination Point is required'));
    });
  });
});
