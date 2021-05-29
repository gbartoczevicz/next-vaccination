import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { InvalidVaccineBatch } from '@entities/vaccination-point/errors';
import { Coordinate } from '@entities/vaccination-point/values';
import { EntityID, left, right } from '@server/shared';
import { VaccineNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { FakeVaccinesRepository } from '@usecases/output-ports/repositories/vaccines';
import { CreateVaccineBatchUseCase } from './create-vaccine-batch';

const makeSut = () => {
  const fakeVaccineBatchesRepository = new FakeVaccineBatchesRepository();
  const fakeVaccinesRepotitory = new FakeVaccinesRepository();

  return {
    sut: new CreateVaccineBatchUseCase(fakeVaccineBatchesRepository, fakeVaccinesRepotitory),
    fakeVaccineBatchesRepository,
    fakeVaccinesRepotitory
  };
};

const makeFixture = ({ vaccineId = 'vaccine_id', expirationDate = new Date(), stock = 10 }) => ({
  healthProfessional: HealthProfessional.create({
    id: new EntityID('health_professional_id'),
    document: 'health_professional_document',
    responsible: true,
    user: User.create({
      id: new EntityID('user_id'),
      name: 'name',
      email: 'user@email.com',
      phone: '9999-9999',
      password: { password: '1234567890' }
    }).value as User,
    vaccinationPoint: VaccinationPoint.create({
      id: new EntityID('vaccination_point_id'),
      name: 'Vaccination Point',
      phone: '0000-0000',
      document: 'vaccination_point_document',
      location: {
        address: 'vaccination point address',
        addressNumber: 25,
        coordinate: Coordinate.create({
          latitude: 20.0,
          longitude: 30.0
        }).value as Coordinate
      }
    }).value as VaccinationPoint
  }).value as HealthProfessional,
  vaccineId,
  expirationDate,
  stock
});

const makeExpirationDate = (days = 5) => {
  const fixture = new Date();

  fixture.setDate(fixture.getDate() + days);

  return fixture;
};

describe('Create Vaccine Batch UseCase Unitary Tests', () => {
  it('should create a valid vaccine batch', async () => {
    const { sut } = makeSut();

    const expirationDate = makeExpirationDate();

    const testable = await sut.execute(makeFixture({ expirationDate }));

    expect(testable.isRight()).toBeTruthy();

    const vaccineBatch = testable.value as VaccineBatch;

    expect(vaccineBatch.expirationDate.value).toEqual(expirationDate);
    expect(vaccineBatch.stock).toEqual(10);
    expect(vaccineBatch.vaccinationPoint.id.value).toEqual('vaccination_point_id');
    expect(vaccineBatch.vaccine.id.value).toEqual('vaccine_id');
  });

  it('should validate if vaccine exists', async () => {
    const { sut, fakeVaccinesRepotitory } = makeSut();

    jest.spyOn(fakeVaccinesRepotitory, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccineNotFound());
  });

  it('should validate vaccination batch param', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ stock: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccineBatch('Stock is required'));
  });

  describe('Validate Infra Errors', () => {
    it("should validate Vaccines Repository's findById", async () => {
      const { sut, fakeVaccinesRepotitory } = makeSut();

      jest
        .spyOn(fakeVaccinesRepotitory, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('any'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('any'));
    });

    it("should validate Vaccine Batches Repository's save", async () => {
      const { sut, fakeVaccineBatchesRepository } = makeSut();

      jest
        .spyOn(fakeVaccineBatchesRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('any'))));

      const testable = await sut.execute(makeFixture({ expirationDate: makeExpirationDate() }));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('any'));
    });
  });
});
