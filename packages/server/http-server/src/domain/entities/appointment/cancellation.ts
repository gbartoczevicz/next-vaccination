import { User } from '@entities/user';
import { Either, EntityID, left, right } from '@server/shared';
import { Appointment } from './appointment';
import { InvalidCancellation } from './errors';

interface ICancellationProps {
  id?: EntityID;
  reason: string;
  createdAt: Date;
  cancelatedBy: User;
  appointment: Appointment;
}

export class Cancellation {
  readonly id?: EntityID;

  readonly reason: string;

  readonly createdAt: Date;

  readonly cancelatedBy: User;

  readonly appointment: Appointment;

  constructor(reason: string, createdAt: Date, cancelatedBy: User, appointment: Appointment, id?: EntityID) {
    this.id = id || new EntityID();
    this.reason = reason;
    this.createdAt = createdAt;
    this.cancelatedBy = cancelatedBy;
    this.appointment = appointment;
  }

  static create(props: ICancellationProps): Either<InvalidCancellation, Cancellation> {
    if (!props.reason) {
      return left(new InvalidCancellation('Reason is required'));
    }

    if (!props.createdAt) {
      return left(new InvalidCancellation('Created at is required'));
    }

    if (!props.cancelatedBy) {
      return left(new InvalidCancellation('Cancelated By is required'));
    }

    if (!props.appointment) {
      return left(new InvalidCancellation('Appointment is required'));
    }

    const { id, reason, createdAt, cancelatedBy, appointment } = props;

    const cancellation = new Cancellation(reason, createdAt, cancelatedBy, appointment, id);

    return right(cancellation);
  }
}
