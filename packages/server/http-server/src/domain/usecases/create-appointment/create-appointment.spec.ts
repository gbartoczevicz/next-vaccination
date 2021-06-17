/* eslint-disable max-len */
import { Appointment } from '@entities/appointment';
import { InvalidAppointment } from '@entities/appointment/errors';
import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { EntityID, left, right } from '@server/shared';
import {
  HasNotAvailableVaccineBatches,
  PatientDoesNotHaveTicket,
  VaccinationPointWithoutAvailability,
  WithoutVaccineBatchesWithinExpirationDate
} from '@usecases/errors';
import {
  GetAppointmentsThatUseSameVaccineBatchesUseCase,
  IAppointmentsWithVaccineBatchDTO
} from '@usecases/get-appointments-that-use-same-vaccine-batches';
import { InfraError } from '@usecases/output-ports/errors';
import { FakeAppointmentsRepository } from '@usecases/output-ports/repositories/appointments';
import { FakeConclusionsRepository } from '@usecases/output-ports/repositories/conclusions';
import { FakeVaccineBatchesRepository } from '@usecases/output-ports/repositories/vaccine-batches';
import { CreateAppointmentUseCase } from './create-appointment';

const makeSut = () => {
  const fakeAppointmentsRespository = new FakeAppointmentsRepository();
  const fakeVaccineBatchesRepository = new FakeVaccineBatchesRepository();
  const getAppointmentsThatUseSameVaccineBatchesUseCase = new GetAppointmentsThatUseSameVaccineBatchesUseCase(
    new FakeConclusionsRepository()
  );

  return {
    sut: new CreateAppointmentUseCase(
      fakeAppointmentsRespository,
      fakeVaccineBatchesRepository,
      getAppointmentsThatUseSameVaccineBatchesUseCase
    ),
    fakeAppointmentsRespository,
    fakeVaccineBatchesRepository,
    getAppointmentsThatUseSameVaccineBatchesUseCase
  };
};

const makeFixture = (ticket = 'ticket_to_keep.pdf') => {
  const patient = Patient.create({
    id: new EntityID('patient_id'),
    user: { id: new EntityID('user_patient_id') } as User,
    document: 'old_document',
    birthday: new Date(),
    avatar: 'avatar_to_keep.png',
    ticket
  }).value as Patient;

  const vaccinationPoint = VaccinationPoint.create({
    id: new EntityID('vaccination_point_id'),
    document: 'document',
    name: 'vaccination point',
    phone: '0000-0000',
    availability: 10,
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

  it("should validate if vaccination point has more appointments in the day than it's availability", async () => {
    const { sut, fakeAppointmentsRespository } = makeSut();

    jest
      .spyOn(fakeAppointmentsRespository, 'findAllByVaccinationPointAndDate')
      .mockImplementation(() => Promise.resolve(right(new Array(11))));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new VaccinationPointWithoutAvailability());
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

  it("should validate if the appointment's patient have ticket", async () => {
    const { sut } = makeSut();

    const testable = await sut.execute(makeFixture(null));

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new PatientDoesNotHaveTicket());
  });

  it('should validate if vaccination point has batches that are at expiration date', async () => {
    const { sut, fakeVaccineBatchesRepository } = makeSut();

    jest
      .spyOn(fakeVaccineBatchesRepository, 'findAllByVaccinationPointAndExpirationDateAfterThan')
      .mockImplementation(() => Promise.resolve(right([])));

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new WithoutVaccineBatchesWithinExpirationDate());
  });

  it('should validate if vaccination point has available vaccine batches', async () => {
    const { sut, getAppointmentsThatUseSameVaccineBatchesUseCase } = makeSut();

    jest.spyOn(getAppointmentsThatUseSameVaccineBatchesUseCase, 'execute').mockImplementation(() => {
      const fixture: IAppointmentsWithVaccineBatchDTO = {
        appointments: new Array(10),
        vaccineBatch: { stock: 10 } as VaccineBatch
      };

      return Promise.resolve(right([fixture]));
    });

    const testable = await sut.execute(makeFixture());

    expect(testable.isLeft()).toBeTruthy();
    expect(testable.value).toEqual(new HasNotAvailableVaccineBatches());
  });

  describe('Infra Error validation', () => {
    it("should validate Appointments Repository's findAllByVaccinationPointAndDate", async () => {
      const { sut, fakeAppointmentsRespository } = makeSut();

      jest
        .spyOn(fakeAppointmentsRespository, 'findAllByVaccinationPointAndDate')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it("should validate Vaccine Batches Repository's findAllByVaccinationPointAndExpirationDateAfterThan", async () => {
      const { sut, fakeVaccineBatchesRepository } = makeSut();

      jest
        .spyOn(fakeVaccineBatchesRepository, 'findAllByVaccinationPointAndExpirationDateAfterThan')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

    it("should validate GetAppointmentsThatUseSameVaccineBatchesUseCase's execute", async () => {
      const { sut, getAppointmentsThatUseSameVaccineBatchesUseCase } = makeSut();

      jest
        .spyOn(getAppointmentsThatUseSameVaccineBatchesUseCase, 'execute')
        .mockImplementation(() => Promise.resolve(left(new InfraError('Unexpected Error'))));

      const testable = await sut.execute(makeFixture());

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InfraError('Unexpected Error'));
    });

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
