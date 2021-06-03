import { Patient } from '@entities/patient';
import { VaccinationPoint } from '@entities/vaccination-point';
import { Either, EntityID, left, right } from '@server/shared';
import { Cancellation } from './cancellation';
import { Conclusion } from './conclusion';
import { InvalidAppointment } from './errors';

interface IAppointmentProps {
  id?: EntityID;
  patient: Patient;
  vaccinationPoint: VaccinationPoint;
  date: Date;
  conclusion?: Conclusion;
  cancellation?: Cancellation;
}

export class Appointment {
  readonly id: EntityID;

  readonly patient: Patient;

  readonly date: Date;

  readonly vaccinationPoint: VaccinationPoint;

  readonly conclusion?: Conclusion;

  readonly cancellation?: Cancellation;

  constructor(
    patient: Patient,
    vaccinationPoint: VaccinationPoint,
    date: Date,
    conclusion?: Conclusion,
    cancellation?: Cancellation,
    id?: EntityID
  ) {
    this.id = id || new EntityID();
    this.patient = patient;
    this.vaccinationPoint = vaccinationPoint;
    this.date = date;
    this.conclusion = conclusion;
    this.cancellation = cancellation;
  }

  static create(props: IAppointmentProps): Either<InvalidAppointment, Appointment> {
    const { id, patient, vaccinationPoint, date, cancellation, conclusion } = props;

    if (!patient) {
      return left(new InvalidAppointment('Patient is required'));
    }

    if (!vaccinationPoint) {
      return left(new InvalidAppointment('Vaccination Point is required'));
    }

    if (!date) {
      return left(new InvalidAppointment('Date is required'));
    }

    const appointment = new Appointment(patient, vaccinationPoint, date, conclusion, cancellation, id);

    return right(appointment);
  }
}
