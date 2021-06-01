import { HealthProfessional } from '@entities/health-professional';
import { Patient } from '@entities/patient';
import { VaccinationPoint, VaccineBatch } from '@entities/vaccination-point';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidAppointment } from './errors';

interface IAppointmentProps {
  id?: EntityID;
  patient: Patient;
  vaccinationPoint: VaccinationPoint;
  vaccinatedBy?: HealthProfessional;
  vaccineBatch?: VaccineBatch;
  date: Date;
  vaccinatedAt?: Date;
}

export class Appointment {
  readonly id?: EntityID;

  readonly patient: Patient;

  readonly vaccinationPoint: VaccinationPoint;

  readonly vaccinatedBy?: HealthProfessional;

  readonly vaccineBatch?: VaccineBatch;

  readonly date: Date;

  readonly vaccinatedAt?: Date;

  constructor(
    patient: Patient,
    vaccinationPoint: VaccinationPoint,
    date: Date,
    vaccinatedBy?: HealthProfessional,
    vaccineBatch?: VaccineBatch,
    vaccinatedAt?: Date,
    id?: EntityID
  ) {
    this.id = id || new EntityID();
    this.patient = patient;
    this.vaccinationPoint = vaccinationPoint;
    this.vaccinatedBy = vaccinatedBy;
    this.vaccineBatch = vaccineBatch;
    this.date = date;
    this.vaccinatedAt = vaccinatedAt;
  }

  static create(props: IAppointmentProps): Either<InvalidAppointment, Appointment> {
    const { id, patient, vaccinationPoint, vaccinatedBy, vaccineBatch, date, vaccinatedAt } = props;

    if (!patient) {
      return left(new InvalidAppointment('Patient is required'));
    }

    if (!vaccinationPoint) {
      return left(new InvalidAppointment('Vaccination Point is required'));
    }

    if (!date) {
      return left(new InvalidAppointment('Date is required'));
    }

    const appointment = new Appointment(patient, vaccinationPoint, date, vaccinatedBy, vaccineBatch, vaccinatedAt, id);

    return right(appointment);
  }
}
