import { Vaccine } from '@entities/vaccination-point';
import { InvalidVaccine } from '@entities/vaccination-point/errors';
import { left, right } from '@server/shared';
import { VaccineNameAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccinesRepository } from '@usecases/output-ports/repositories/vaccines';
import { CreateVaccineUseCase } from './create-vaccine';

const makeSut = () => {
  const fakeVaccinesRepository = new FakeVaccinesRepository();

  return {
    sut: new CreateVaccineUseCase(fakeVaccinesRepository),
    fakeVaccinesRepository
  };
};

const makeFixture = ({ name = 'Vaccine Name', description = 'Vaccine Description' }) => ({ name, description });

describe('Create Vaccine UseCase Unitary Tests', () => {
  it('should create a valid vaccine object', async () => {
    const { sut, fakeVaccinesRepository } = makeSut();

    jest.spyOn(fakeVaccinesRepository, 'findByName').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isRight()).toBeTruthy();

    const vaccine = testable.value as Vaccine;

    expect(vaccine.id).toBeDefined();
    expect(vaccine.name).toEqual('Vaccine Name');
    expect(vaccine.description).toEqual('Vaccine Description');
  });

  it('should validate request object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ name: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidVaccine('Name is required'));
  });

  it("should validate if the vaccine's name is already in use", async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({ name: "Fulano's Vaccine" }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccineNameAlreadyInUse("Fulano's Vaccine"));
  });

  describe('Infra Error validation', () => {
    it('should validate findByName', async () => {
      const { sut, fakeVaccinesRepository } = makeSut();

      jest
        .spyOn(fakeVaccinesRepository, 'findByName')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Failed'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Failed'));
    });

    it('should validate save', async () => {
      const { sut, fakeVaccinesRepository } = makeSut();

      jest.spyOn(fakeVaccinesRepository, 'findByName').mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeVaccinesRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Failed'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Failed'));
    });
  });
});
