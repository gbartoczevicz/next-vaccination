import { User } from '@entities/user';
import { Either, EntityID, left, right } from '@server/shared';
import { InvalidCancellation } from './errors';

interface ICancellationProps {
  id?: EntityID;
  reason: string;
  createdAt: Date;
  cancelatedBy: User;
}

export class Cancellation {
  readonly id?: EntityID;

  readonly reason: string;

  readonly createdAt: Date;

  readonly cancelatedBy: User;

  constructor(reason: string, createdAt: Date, cancelatedBy: User, id?: EntityID) {
    this.id = id || new EntityID();
    this.reason = reason;
    this.createdAt = createdAt;
    this.cancelatedBy = cancelatedBy;
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

    const { id, reason, createdAt, cancelatedBy } = props;

    const cancellation = new Cancellation(reason, createdAt, cancelatedBy, id);

    return right(cancellation);
  }
}
