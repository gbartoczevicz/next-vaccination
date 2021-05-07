import { User } from '@entities/user';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidBirthday, InvalidPatient } from './errors';
import { PatientBirthday } from './values';
import { makeBirthday } from './values/factories/make-birthday';

interface IPatientProps {
  id?: EntityID;
  birthday: Date;
  user: User;
  document: string;
  avatar?: string;
  ticket?: string;
}

type CreatePatientErrors = InvalidPatient | InvalidBirthday;

type CreatePatient = Either<CreatePatientErrors, Patient>;

export class Patient {
  readonly id: EntityID;

  readonly birthday: PatientBirthday;

  readonly user: User;

  readonly document: string;

  readonly avatar?: string;

  readonly ticket?: string;

  constructor(
    birthday: PatientBirthday,
    user: User,
    document: string,
    avatar?: string,
    ticket?: string,
    id?: EntityID
  ) {
    this.id = id || new EntityID();
    this.birthday = birthday;
    this.user = user;
    this.document = document;
    this.avatar = avatar;
    this.ticket = ticket;
  }

  static create(props: IPatientProps): CreatePatient {
    const birthdayOrError = makeBirthday(props.birthday);

    if (birthdayOrError.isLeft()) {
      return left(birthdayOrError.value);
    }

    if (!props.document) {
      return left(new InvalidPatient('Document is required'));
    }

    if (!props.user) {
      return left(new InvalidPatient('User is required'));
    }

    const { document, user, avatar, ticket, id } = props;

    return right(new Patient(birthdayOrError.value, user, document, avatar, ticket, id));
  }
}
