import { Either, EntityID, left, right } from '@server/shared';
import { InvalidPatient } from './errors';

interface IPatientProps {
  id: EntityID;
  avatar: string;
  ticket?: string;
}

export class Patient {
  readonly id: EntityID;

  readonly avatar: string;

  readonly ticket?: string;

  private constructor(id: EntityID, avatar: string, ticket?: string) {
    this.id = id;
    this.avatar = avatar;
    this.ticket = ticket;
  }

  static create(props: IPatientProps): Either<InvalidPatient, Patient> {
    if (!props.id) {
      return left(new InvalidPatient('ID is required'));
    }

    if (!props.avatar) {
      return left(new InvalidPatient('Avatar is required'));
    }

    const patient = new Patient(props.id, props.avatar, props.ticket);

    return right(patient);
  }
}
