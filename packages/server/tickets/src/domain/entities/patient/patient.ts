import { User } from '@entities/user';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidPatient } from './errors';

interface IPatientProps {
  id: EntityID;
  avatar: string;
  ticket?: string;
  user: User;
}

export class Patient {
  readonly id: EntityID;

  readonly avatar: string;

  readonly ticket?: string;

  readonly user: User;

  private constructor(id: EntityID, avatar: string, user: User, ticket?: string) {
    this.id = id;
    this.avatar = avatar;
    this.ticket = ticket;
    this.user = user;
  }

  static create(props: IPatientProps): Either<InvalidPatient, Patient> {
    if (!props.id) {
      return left(new InvalidPatient('ID is required'));
    }

    if (!props.avatar) {
      return left(new InvalidPatient('Avatar is required'));
    }

    if (!props.user) {
      return left(new InvalidPatient('User is required'));
    }

    const patient = new Patient(props.id, props.avatar, props.user, props.ticket);

    return right(patient);
  }
}
