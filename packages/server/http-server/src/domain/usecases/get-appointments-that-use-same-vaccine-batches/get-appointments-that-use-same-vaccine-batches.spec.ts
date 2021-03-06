import { VaccinationPoint, Vaccine, VaccineBatch } from '@entities/vaccination-point';
import { EntityID, left } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { IAppointmentsWithVaccineBatchDTO } from './dto';
import { GetAppointmentsThatUseSameVaccineBatchesUseCase } from './get-appointments-that-use-same-vaccine-batches';

const makeSut = () => {
  const fakeConclusionsRepository = new FakeConclusionsRepository();

  return {
    sut: new GetAppointmentsThatUseSameVaccineBatchesUseCase(fakeConclusionsRepository),
    fakeConclusionsRepository
  };
};

const makeFixture = () => {
  const fixture = VaccineBatch.create({
    id: new EntityID('vaccine_batch_id'),
    vaccinationPoint: { id: new EntityID('vaccination_point_id') } as VaccinationPoint,
    expirationDate: new Date(),
    stock: 10,
    vaccine: { id: new EntityID() } as Vaccine
  }).value as VaccineBatch;

  return fixture;
};

describe('Get Appointments That Use Same Vaccine Batches Unitary Tests', () => {
  it('should get valid appointments', async () => {
    const { sut } = makeSut();

    const fixture = makeFixture();

    const testable = await sut.execute({ vaccineBatches: [fixture] });

    expect(testable.isRight()).toBeTruthy();

    const appointmentsAndVaccineBatchCollection = testable.value as IAppointmentsWithVaccineBatchDTO[];

    const appointmentsAndVaccineBatch = appointmentsAndVaccineBatchCollection[0];

    expect(appointmentsAndVaccineBatch.vaccineBatch.id.value).toEqual(fixture.id.value);
    expect(appointmentsAndVaccineBatch.appointments.length).toEqual(1);
  });

  it('should validate infra error', async () => {
    const { sut, fakeConclusionsRepository } = makeSut();

    jest
      .spyOn(fakeConclusionsRepository, 'findAllByVaccineBatch')
      .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

    const testable = await sut.execute({ vaccineBatches: [makeFixture()] });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InfraError('Unexpected Error'));
  });
});
