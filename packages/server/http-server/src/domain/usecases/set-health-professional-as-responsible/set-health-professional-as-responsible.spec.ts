import { HealthProfessional } from '@entities/health-professional';
import { left, right } from '@server/shared';
import { HealthProfessionalNotFound } from '@usecases/errors';
import { VaccinationPointAlreadyHaveResponsible } from '@usecases/errors/vaccination-point-already-have-responsible';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { SetHealthProfessionalAsResponsibleUseCase } from './set-health-professional-as-responsible';

const makeSut = () => {
  const fakeHealthProfessionalsRepository = new FakeHealthProfessionalsRepository();

  return {
    sut: new SetHealthProfessionalAsResponsibleUseCase(fakeHealthProfessionalsRepository),
    fakeHealthProfessionalsRepository
  };
};

describe('Set Health Professional as Responsible usecase Unitary Tests', () => {
  it('should set health professional as responsible', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest
      .spyOn(fakeHealthProfessionalsRepository, 'findByVaccinationPointIdAndIsResponsible')
      .mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({ healthProfessionalId: 'future_responsible_id' });

    expect(testable.isRight()).toBeTruthy();

    const healthProfessional = testable.value as HealthProfessional;

    expect(healthProfessional.id.value).toEqual('future_responsible_id');
    expect(healthProfessional.responsible).toEqual(true);
  });

  it('should check if responsible exists', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest.spyOn(fakeHealthProfessionalsRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute({ healthProfessionalId: 'does_not_exists_id' });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new HealthProfessionalNotFound());
  });

  it('should validate if vaccination point already have a responsible', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({ healthProfessionalId: 'to_check_if_already_exists' });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccinationPointAlreadyHaveResponsible());
  });

  describe('validate infra errors', () => {
    it('should validate findById', async () => {
      const { sut, fakeHealthProfessionalsRepository } = makeSut();

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('error'))));

      const testable = await sut.execute({ healthProfessionalId: 'any' });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('error'));
    });

    it('should validate findByVaccinationPointIdAndIsResponsible', async () => {
      const { sut, fakeHealthProfessionalsRepository } = makeSut();

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'findByVaccinationPointIdAndIsResponsible')
        .mockImplementation(() => Promise.resolve(left(new InfraError('error'))));

      const testable = await sut.execute({ healthProfessionalId: 'any' });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('error'));
    });

    it('should validate findByVaccinationPointIdAndIsResponsible', async () => {
      const { sut, fakeHealthProfessionalsRepository } = makeSut();

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'findByVaccinationPointIdAndIsResponsible')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('error'))));

      const testable = await sut.execute({ healthProfessionalId: 'any' });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('error'));
    });
  });
});
