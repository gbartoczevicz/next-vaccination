import { Patient } from '@entities/patient';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidAppointment } from './errors';

interface IAppointmentProps {
  id?: EntityID;
  patient: Patient;
  vaccinationPoint: VaccinationPoint;
  date: Date;
}

export class Appointment {
  readonly id: EntityID;

  readonly patient: Patient;

  readonly date: Date;

  readonly vaccinationPoint: VaccinationPoint;

  constructor(patient: Patient, vaccinationPoint: VaccinationPoint, date: Date, id?: EntityID) {
    this.id = id || new EntityID();
    this.patient = patient;
    this.vaccinationPoint = vaccinationPoint;
    this.date = date;
  }

  static create(props: IAppointmentProps): Either<InvalidAppointment, Appointment> {
    const { id, patient, vaccinationPoint, date } = props;

    if (!patient) {
      return left(new InvalidAppointment('Patient is required'));
    }

    if (!vaccinationPoint) {
      return left(new InvalidAppointment('Vaccination Point is required'));
    }

    if (!date) {
      return left(new InvalidAppointment('Date is required'));
    }

    const appointment = new Appointment(patient, vaccinationPoint, date, id);

    return right(appointment);
  }
}
