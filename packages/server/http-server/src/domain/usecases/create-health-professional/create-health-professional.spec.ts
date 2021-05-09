import { HealthProfessional } from '@entities/health-professional';
import { InvalidHealthProfessional } from '@entities/health-professional/errors';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { left, right } from '@server/shared';
import { DocumentAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { CreateHealthProfessionalUseCase } from './create-health-professional';

const makeSut = () => {
  const fakeHealthProfessionalsRepository = new FakeHealthProfessionalsRepository();

  return {
    sut: new CreateHealthProfessionalUseCase(fakeHealthProfessionalsRepository),
    fakeHealthProfessionalsRepository
  };
};

const makeFixture = (document = 'health_professional_document') => ({
  document,
  user: User.create({
    name: 'name',
    email: 'user@email.com',
    phone: '9999-9999',
    password: { password: 'secret' }
  }).value as User,
  vaccinationPoint: VaccinationPoint.create({
    name: 'Vaccination Point',
    phone: '0000-0000',
    document: 'vaccination_point_document',
    location: {
      address: 'vaccination point address',
      addressNumber: 25,
      latitude: 20.0,
      longitude: 30.0
    }
  }).value as VaccinationPoint
});

describe('Create Health Professional usecase Unitary Tests', () => {
  it('should create a health professional', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest
      .spyOn(fakeHealthProfessionalsRepository, 'findByDocument')
      .mockImplementation(() => Promise.resolve(right(null)));

    const { document, user, vaccinationPoint } = makeFixture();

    const testable = await sut.execute({ document, user, vaccinationPoint });

    expect(testable.isRight()).toBeTruthy();

    const healthProfessional = testable.value as HealthProfessional;

    expect(healthProfessional.document).toEqual(document);
    expect(healthProfessional.user).toEqual(user);
    expect(healthProfessional.vaccinationPoint).toEqual(vaccinationPoint);
  });

  it('should validate health professional object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidHealthProfessional('Document is required'));
  });

  it('should validate if health professional document is already in use', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new DocumentAlreadyInUse());
  });

  describe('validate infra errors', () => {
    it('should validate findByDocument', async () => {
      const { sut, fakeHealthProfessionalsRepository } = makeSut();

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it('should validate save', async () => {
      const { sut, fakeHealthProfessionalsRepository } = makeSut();

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'findByDocument')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
