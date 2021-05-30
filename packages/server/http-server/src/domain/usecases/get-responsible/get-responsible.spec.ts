import { HealthProfessional } from '@entities/health-professional';
import { User } from '@entities/user';
import { EntityID, left, right } from '@server/shared';
import { ResponsibleNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeHealthProfessionalsRepository } from '@usecases/output-ports/repositories/health-professionals';
import { GetResponsibleUseCase } from './get-responsible';

const makeSut = () => {
  const fakeHealthProfessionalsRepository = new FakeHealthProfessionalsRepository();

  return {
    sut: new GetResponsibleUseCase(fakeHealthProfessionalsRepository),
    fakeHealthProfessionalsRepository
  };
};

const makeFixture = () => {
  const fixture = User.create({
    id: new EntityID('unique_user_id'),
    name: 'any name',
    email: 'any_email@email.com',
    password: { password: 'any_password' },
    phone: '0000-0000'
  }).value as User;

  return {
    user: fixture
  };
};

describe('Get Health Professional UseCase Unitary Tests', () => {
  it('should get a valid health professional', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture());

    expect(testable.isRight()).toBeTruthy();

    const healthProfessional = testable.value as HealthProfessional;

    expect(healthProfessional.user.id.value).toEqual('unique_user_id');
    expect(healthProfessional.responsible).toEqual(true);
  });

  it('should validate if health professional exists', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest
      .spyOn(fakeHealthProfessionalsRepository, 'findByUserAndIsResponsible')
      .mockImplementation(() => Promise.resolve(right(null)));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new ResponsibleNotFound());
  });

  it('should validate repository infra error', async () => {
    const { sut, fakeHealthProfessionalsRepository } = makeSut();

    jest
      .spyOn(fakeHealthProfessionalsRepository, 'findByUserAndIsResponsible')
      .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('Unexpected Error'));
  });
});
