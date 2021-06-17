import { HealthProfessional } from '@entities/health-professional';
import { VaccineBatch } from '@entities/vaccination-point';
import { Either, EntityID, left, right } from '@server/shared';
import { Appointment } from './appointment';
import { InvalidConclusion } from './errors';

interface IConclusionProps {
  id?: EntityID;
  vaccinatedBy: HealthProfessional;
  vaccineBatch: VaccineBatch;
  vaccinatedAt: Date;
  appointment: Appointment;
}

export class Conclusion {
  readonly id: EntityID;

  readonly vaccinatedBy: HealthProfessional;

  readonly vaccineBatch: VaccineBatch;

  readonly vaccinatedAt: Date;

  readonly appointment: Appointment;

  constructor(
    vaccinatedAt: Date,
    vaccinatedBy: HealthProfessional,
    vaccineBatch: VaccineBatch,
    appointment: Appointment,
    id?: EntityID
  ) {
    this.id = id || new EntityID();
    this.vaccinatedAt = vaccinatedAt;
    this.vaccinatedBy = vaccinatedBy;
    this.vaccineBatch = vaccineBatch;
    this.appointment = appointment;
  }

  static create(props: IConclusionProps): Either<InvalidConclusion, Conclusion> {
    if (!props.vaccinatedAt) {
      return left(new InvalidConclusion('Vaccinated At is required'));
    }

    if (!props.vaccinatedBy) {
      return left(new InvalidConclusion('Vaccinated By is required'));
    }

    if (!props.vaccineBatch) {
      return left(new InvalidConclusion('Vaccine Batch is required'));
    }

    if (!props.appointment) {
      return left(new InvalidConclusion('Appointment is required'));
    }

    const { vaccinatedAt, vaccinatedBy, vaccineBatch, appointment, id } = props;

    const conclusion = new Conclusion(vaccinatedAt, vaccinatedBy, vaccineBatch, appointment, id);

    return right(conclusion);
  }
}
