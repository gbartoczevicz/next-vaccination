import { HealthProfessional } from '@entities/health-professional';
import { VaccineBatch } from '@entities/vaccination-point';
import { EntityID } from '@server/shared';
import { Conclusion } from './conclusion';
import { InvalidConclusion } from './errors';

const makeSut = () => ({ sut: Conclusion });

const makeFixture = () => {
  const vaccinatedBy = { id: new EntityID('hero_id') } as HealthProfessional;
  const vaccineBatch = { id: new EntityID('vaccine_batch_id') } as VaccineBatch;

  return {
    vaccinatedAt: new Date(),
    vaccinatedBy,
    vaccineBatch
  };
};

describe('Conclusion Unitary Tests', () => {
  it('should create a valid object', () => {
    const { sut } = makeSut();

    const { vaccinatedAt, ...fixture } = makeFixture();

    const testable = sut.create({
      ...fixture,
      vaccinatedAt
    });

    expect(testable.isRight()).toBeTruthy();

    const conclusion = testable.value as Conclusion;

    expect(conclusion.id).toBeDefined();
    expect(conclusion.vaccinatedAt).toEqual(vaccinatedAt);
    expect(conclusion.vaccinatedBy.id.value).toEqual('hero_id');
    expect(conclusion.vaccineBatch.id.value).toEqual('vaccine_batch_id');
  });

  describe('Validate params', () => {
    it('should validate vaccinated at param', () => {
      const { sut } = makeSut();

      const testable = sut.create({ ...makeFixture(), vaccinatedAt: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidConclusion('Vaccinated At is required'));
    });

    it('should validate vaccinated by param', () => {
      const { sut } = makeSut();

      const testable = sut.create({ ...makeFixture(), vaccinatedBy: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidConclusion('Vaccinated By is required'));
    });

    it('should validate vaccine batch param', () => {
      const { sut } = makeSut();

      const testable = sut.create({ ...makeFixture(), vaccineBatch: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidConclusion('Vaccine Batch is required'));
    });
  });
});
