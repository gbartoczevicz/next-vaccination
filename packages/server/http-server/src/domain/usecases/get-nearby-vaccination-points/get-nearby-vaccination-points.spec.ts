import { VaccinationPoint } from '@entities/vaccination-point';
import { InvalidCoordinate } from '@entities/vaccination-point/errors';
import { left } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { GetNearbyVaccinationPointsUseCase } from './get-nearby-vaccination-points';

const makeSut = () => {
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();

  return {
    sut: new GetNearbyVaccinationPointsUseCase(fakeVaccinationPointsRepository),
    fakeVaccinationPointsRepository
  };
};

describe('List Vaccination Points Unitary Tests', () => {
  it('should list vaccination points', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      coordinate: {
        latitude: 10,
        longitude: 20
      }
    });

    expect(testable.isRight()).toBeTruthy();

    const vaccinationPoints = testable.value as VaccinationPoint[];

    expect(vaccinationPoints.length).toEqual(1);
  });

  it('should validate coordinate object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      coordinate: {
        latitude: 10,
        longitude: null
      }
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidCoordinate('Longitude is required'));
  });

  describe('validate infra errors', () => {
    it('should validate vaccintaion points findAll', async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findAllByApproximateCoordinate')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute({
        coordinate: {
          latitude: 10,
          longitude: 20
        }
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
