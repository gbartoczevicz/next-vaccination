import { VaccinationPoint, Vaccine, VaccineBatch } from '@entities/vaccination-point';
import { InvalidVaccineBatch } from '@entities/vaccination-point/errors';
import { Coordinate } from '@entities/vaccination-point/values';
import { EntityID, left } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { CreateVaccineBatchUseCase } from './create-vaccine-batch';

const makeSut = () => {
  const fakeVaccineBatchesRepository = new FakeVaccineBatchesRepository();

  return {
    sut: new CreateVaccineBatchUseCase(fakeVaccineBatchesRepository),
    fakeVaccineBatchesRepository
  };
};

const makeExpirationDate = (days = 5) => {
  const fixture = new Date();

  fixture.setDate(fixture.getDate() + days);

  return fixture;
};

const makeFixture = () => {
  const vaccinationPoint = VaccinationPoint.create({
    id: new EntityID('to_keep_id'),
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
    },
    availability: 20
  }).value as VaccinationPoint;

  const vaccine = Vaccine.create({
    id: new EntityID('to_keep_id'),
    name: 'any',
    description: 'any'
  }).value as Vaccine;

  return {
    vaccinationPoint,
    vaccine,
    expirationDate: makeExpirationDate(),
    stock: 20
  };
};

describe('Create Vaccine Batch UseCase Unitary Tests', () => {
  it('should create a valid vaccine batch', async () => {
    const { sut } = makeSut();

    const { expirationDate, ...fixture } = makeFixture();

    const testable = await sut.execute({ ...fixture, expirationDate });

    expect(testable.isRight()).toBeTruthy();

    const vaccineBatch = testable.value as VaccineBatch;

    expect(vaccineBatch.expirationDate.value).toEqual(expirationDate);
    expect(vaccineBatch.stock).toEqual(20);
    expect(vaccineBatch.vaccinationPoint.id.value).toEqual('to_keep_id');
    expect(vaccineBatch.vaccine.id.value).toEqual('to_keep_id');
  });

  it('should validate vaccination batch param', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      ...makeFixture(),
      stock: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccineBatch('Stock is required'));
  });

  describe('Validate Infra Errors', () => {
    it("should validate Vaccine Batches Repository's save", async () => {
      const { sut, fakeVaccineBatchesRepository } = makeSut();

      jest
        .spyOn(fakeVaccineBatchesRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('any'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('any'));
    });
  });
});
