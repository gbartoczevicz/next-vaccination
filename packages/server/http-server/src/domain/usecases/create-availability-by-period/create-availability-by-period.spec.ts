import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { AvailabilityByPeriod, VaccinationPoint } from '@entities/vaccination-point';
import { InvalidAvailabilityByPeriod } from '@entities/vaccination-point/errors';
import { Coordinate } from '@entities/vaccination-point/values';
import { EntityID, left, right } from '@server/shared';
import {
  AvailabilityByPeriodAlreadyExists,
  DoesNotBelongToTheVaccinationPoint,
  HealthProfessionalNotFound,
  NotResponsible,
  UserNotFound,
  VaccinationPointNotFound
} from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeAvailabilityByPeriodRepository } from '@usecases/output-ports/repositories/availability-by-period/fake';
import { FakeHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { FakeUsersRepository } from '@usecases/output-ports/repositories/users';
import { FakeVaccinationPointsRepository } from '@usecases/output-ports/repositories/vaccination-points';
import { CreateAvailabilityByPeriodUseCase } from './create-availability-by-period';

const makeSut = () => {
  const fakeAvailabilityByPeriodRepository = new FakeAvailabilityByPeriodRepository();
  const fakeHealthProfessionalsRepository = new FakeHealthProfessionalsRepository();
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeVaccinationPointsRepository = new FakeVaccinationPointsRepository();

  return {
    sut: new CreateAvailabilityByPeriodUseCase(
      fakeAvailabilityByPeriodRepository,
      fakeHealthProfessionalsRepository,
      fakeUsersRepository,
      fakeVaccinationPointsRepository
    ),
    fakeAvailabilityByPeriodRepository,
    fakeHealthProfessionalsRepository,
    fakeUsersRepository,
    fakeVaccinationPointsRepository
  };
};

const makeFixture = ({
  userId = 'user_id',
  morning = 50,
  evening = 20,
  dusk = 10,
  vaccinationPointId = 'vaccination_point_id'
}) => ({ userId, morning, evening, dusk, vaccinationPointId });

const makeVaccinationPointResponsible = () => {
  const fixture = HealthProfessional.create({
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
  }).value as HealthProfessional;

  return fixture;
};

describe('Create Availability By Period UseCase Unitary Tests', () => {
  it('should create a availability by period object', async () => {
    const { sut, fakeAvailabilityByPeriodRepository, fakeHealthProfessionalsRepository } = makeSut();

    jest
      .spyOn(fakeAvailabilityByPeriodRepository, 'findByVaccinationPoint')
      .mockImplementation(() => Promise.resolve(right(null)));

    jest.spyOn(fakeHealthProfessionalsRepository, 'findByUser').mockImplementation(() => {
      const fixture = makeVaccinationPointResponsible();

      return Promise.resolve(right(fixture));
    });

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isRight()).toBeTruthy();

    const availabilityByPeriod = testable.value as AvailabilityByPeriod;

    expect(availabilityByPeriod.morning).toEqual(50);
    expect(availabilityByPeriod.evening).toEqual(20);
    expect(availabilityByPeriod.evening).toEqual(20);
    expect(availabilityByPeriod.vaccinationPoint.id.value).toEqual('vaccination_point_id');
  });

  it('should validate AvailabilityByPeriod params', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest.spyOn(fakeHealthProfessionalsRepository, 'findByUser').mockImplementation(() => {
      const fixture = makeVaccinationPointResponsible();

      return Promise.resolve(right(fixture));
    });

    const testable = await sut.execute(makeFixture({ evening: null }));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAvailabilityByPeriod('Evening value is required'));
  });

  it('shoud check if user exists', async () => {
    const { sut, fakeUsersRepository } = makeSut();

    jest.spyOn(fakeUsersRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new UserNotFound());
  });

  it('should check if health professional exists', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest.spyOn(fakeHealthProfessionalsRepository, 'findByUser').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new HealthProfessionalNotFound());
  });

  it('should check if vaccination point exists', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest.spyOn(fakeVaccinationPointsRepository, 'findById').mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccinationPointNotFound());
  });

  it('should check if health professional is related to the vaccination point', async () => {
    const { sut, fakeVaccinationPointsRepository } = makeSut();

    jest.spyOn(fakeVaccinationPointsRepository, 'findById').mockImplementation(() => {
      const fixture = VaccinationPoint.create({
        id: new EntityID(`vaccination_point_id_${Date.now()}`),
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
      }).value as VaccinationPoint;

      return Promise.resolve(right(fixture));
    });

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new DoesNotBelongToTheVaccinationPoint());
  });

  it("should check if health professional is the vaccination point's responsible", async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new NotResponsible());
  });

  it("should check if vaccination point's availability by period already exists", async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest.spyOn(fakeHealthProfessionalsRepository, 'findByUser').mockImplementation(() => {
      const fixture = makeVaccinationPointResponsible();

      return Promise.resolve(right(fixture));
    });

    const testable = await sut.execute(makeFixture({}));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new AvailabilityByPeriodAlreadyExists());
  });

  describe('Infra error validation', () => {
    it("should validate usersRepository's findById", async () => {
      const { sut, fakeUsersRepository } = makeSut();

      jest
        .spyOn(fakeUsersRepository, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it("should validate healthProfessionalsRepository's findByUser", async () => {
      const { sut, fakeHealthProfessionalsRepository } = makeSut();

      jest
        .spyOn(fakeHealthProfessionalsRepository, 'findByUser')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it("should validate vaccinationPointsRepository's findById", async () => {
      const { sut, fakeVaccinationPointsRepository } = makeSut();

      jest
        .spyOn(fakeVaccinationPointsRepository, 'findById')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it("should validate availabilityByPeriodRepository's findById", async () => {
      const { sut, fakeHealthProfessionalsRepository, fakeAvailabilityByPeriodRepository } = makeSut();

      jest.spyOn(fakeHealthProfessionalsRepository, 'findByUser').mockImplementation(() => {
        const fixture = makeVaccinationPointResponsible();

        return Promise.resolve(right(fixture));
      });

      jest
        .spyOn(fakeAvailabilityByPeriodRepository, 'findByVaccinationPoint')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it("should validate availabilityByPeriodRepository's save", async () => {
      const { sut, fakeHealthProfessionalsRepository, fakeAvailabilityByPeriodRepository } = makeSut();

      jest.spyOn(fakeHealthProfessionalsRepository, 'findByUser').mockImplementation(() => {
        const fixture = makeVaccinationPointResponsible();

        return Promise.resolve(right(fixture));
      });

      jest
        .spyOn(fakeAvailabilityByPeriodRepository, 'findByVaccinationPoint')
        .mockImplementation(() => Promise.resolve(right(null)));

      jest
        .spyOn(fakeAvailabilityByPeriodRepository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture({}));

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
