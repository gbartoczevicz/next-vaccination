import { Appointment } from '@entities/appointment';
import { InvalidAppointment } from '@entities/appointment/errors';
import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { EntityID, left } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { CreateAppointmentUseCase } from './create-appointment';

const makeSut = () => {
  const fakeAppointmentsRespository = new FakeAppointmentsRepository();

  return {
    sut: new CreateAppointmentUseCase(fakeAppointmentsRespository),
    fakeAppointmentsRespository
  };
};

const makeFixture = () => {
  const patient = Patient.create({
    id: new EntityID('patient_id'),
    user: { id: new EntityID('user_patient_id') } as User,
    document: 'old_document',
    birthday: new Date(),
    avatar: 'avatar_to_keep.png',
    ticket: 'ticket_to_keep.pdf'
  }).value as Patient;

  const vaccinationPoint = VaccinationPoint.create({
    id: new EntityID('vaccination_point_id'),
    document: 'document',
    name: 'vaccination point',
    phone: '0000-0000',
    location: {
      address: 'address',
      addressNumber: 10,
      coordinate: {
        latitude: 10,
        longitude: 20
      }
    }
  }).value as VaccinationPoint;

  return {
    patient,
    vaccinationPoint,
    date: new Date()
  };
};

describe('Create Appointments UseCase Unitary Tests', () => {
  it('should create a valid appointment', async () => {
    const { sut } = makeSut();

    const fixture = makeFixture();

    const testable = await sut.execute(fixture);

    expect(testable.isRight()).toBeTruthy();

    const appointment = testable.value as Appointment;

    expect(appointment.id).toBeDefined();
    expect(appointment.date).toEqual(fixture.date);
    expect(appointment.patient).toEqual(fixture.patient);
    expect(appointment.vaccinationPoint).toEqual(fixture.vaccinationPoint);
  });

  it('should validate appointment object', async () => {
    const { sut } = makeSut();

    const testable = await sut.execute({
      ...makeFixture(),
      date: null
    });

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new InvalidAppointment('Date is required'));
  });

  describe('Infra Error validation', () => {
    it("should validate Appointments Repository's save", async () => {
      const { sut, fakeAppointmentsRespository } = makeSut();

      jest
        .spyOn(fakeAppointmentsRespository, 'save')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });
  });
});
