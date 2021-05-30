import { Patient } from '@entities/patient';
import { User } from '@entities/user';
import { VaccinationPoint } from '@entities/vaccination-point';
import { EntityID } from '@server/shared';
import { Appointment } from './appointment';
import { InvalidAppointment } from './errors';

const makeSut = () => ({ sut: Appointment });

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

describe('Appointment Unitary Tests', () => {
  it('should create a valid appointment', () => {
    const { sut } = makeSut();

    const fixture = makeFixture();

    const testable = sut.create(fixture);

    expect(testable.isRight()).toBeTruthy();

    const appointment = testable.value as Appointment;

    expect(appointment.id).toBeDefined();
    expect(appointment.date).toEqual(fixture.date);
    expect(appointment.patient).toEqual(fixture.patient);
    expect(appointment.vaccinationPoint).toEqual(fixture.vaccinationPoint);
  });

  describe('Required params validation', () => {
    it('should validate date', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture(),
        date: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidAppointment('Date is required'));
    });

    it('should validate patient', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture(),
        patient: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidAppointment('Patient is required'));
    });

    it('should validate vaccination point', () => {
      const { sut } = makeSut();

      const testable = sut.create({
        ...makeFixture(),
        vaccinationPoint: null
      });

      expect(testable.isLeft()).toBeTruthy();
      expect(testable.value).toEqual(new InvalidAppointment('Vaccination Point is required'));
    });
  });
});
