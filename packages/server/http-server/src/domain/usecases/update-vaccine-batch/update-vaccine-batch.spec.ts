import { VaccinationPoint, Vaccine, VaccineBatch } from '@entities/vaccination-point';
import { InvalidVaccineBatch } from '@entities/vaccination-point/errors';
import { EntityID, left } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { UpdateVaccineBatchUseCase } from './update-vaccine-batch';

const makeSut = () => {
  const fakeVacineBatchesRepository = new FakeVaccineBatchesRepository();

  return {
    sut: new UpdateVaccineBatchUseCase(fakeVacineBatchesRepository),
    fakeVacineBatchesRepository
  };
};

const makeExpirationDate = (days = 5) => {
  const fixture = new Date();

  fixture.setDate(fixture.getDate() + days);

  return fixture;
};

const makeFixture = ({ stock = 40, expirationDate = new Date() }) => {
  const vaccine = Vaccine.create({
    id: new EntityID('to_keep_id'),
    name: 'any',
    description: 'any'
  }).value as Vaccine;

  const vaccineBatch = VaccineBatch.create({
    id: new EntityID('to_keep_id'),
    vaccine,
    vaccinationPoint: { id: new EntityID('to_keep_id') } as VaccinationPoint,
    stock: 10,
    expirationDate: makeExpirationDate(30)
  }).value as VaccineBatch;

  return {
    vaccineBatch,
    expirationDate,
    stock
  };
};

const makeInfraError = () => new InfraError('Unexpected Error');

describe('Update Vaccine Batch Use Case Unitary Tests', () => {
  it('should update vaccine batch', async () => {
    const { sut } = makeSut();

    const { expirationDate, ...fixture } = makeFixture({});

    const testable = await sut.execute({
      ...fixture,
      expirationDate
    });

    expect(testable.isRight()).toBeTruthy();

    const vaccineBatch = testable.value as VaccineBatch;

    expect(vaccineBatch.id.value).toEqual('to_keep_id');
    expect(vaccineBatch.expirationDate.value).toEqual(expirationDate);
    expect(vaccineBatch.stock).toEqual(40);
    expect(vaccineBatch.vaccinationPoint.id.value).toEqual('to_keep_id');
    expect(vaccineBatch.vaccine.id.value).toEqual('to_keep_id');
  });

  it('should validate vaccine batch object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ stock: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccineBatch('Stock is required'));
  });

  describe('Infra Error validation', () => {
    it('should validate save', async () => {
      const { sut, fakeVacineBatchesRepository } = makeSut();

      jest.spyOn(fakeVacineBatchesRepository, 'save').mockImplementation(() => Promise.resolve(left(makeInfraError())));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(makeInfraError());
    });
  });
});
