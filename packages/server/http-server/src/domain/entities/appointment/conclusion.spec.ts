import { HealthProfessional } from '@entities/health-professional';
import { VaccineBatch } from '@entities/vaccination-point';
import { EntityID } from '@server/shared';
import { Appointment } from './appointment';
import { Conclusion } from './conclusion';
import { InvalidConclusion } from './errors';

const makeSut = () => ({ sut: Conclusion });

const makeFixture = () => {
  const vaccinatedBy = { id: new EntityID('hero_id') } as HealthProfessional;
  const vaccineBatch = { id: new EntityID('vaccine_batch_id') } as VaccineBatch;
  const appointment = { id: new EntityID('appointment_id') } as Appointment;

  return {
    vaccinatedAt: new Date(),
    vaccinatedBy,
    vaccineBatch,
    appointment
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
    expect(conclusion.appointment.id.value).toEqual('appointment_id');
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

    it('should validate appointment param', () => {
      const { sut } = makeSut();

      const testable = sut.create({ ...makeFixture(), appointment: null });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidConclusion('Appointment is required'));
    });
  });
});
