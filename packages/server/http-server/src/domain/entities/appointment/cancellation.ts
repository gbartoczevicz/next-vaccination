import { Either, EntityID, left, right } from '@server/shared';
import { InvalidCancellation } from './errors';

interface ICancellationProps {
  id?: EntityID;
  reason: string;
  createdAt: Date;
}

export class Cancellation {
  readonly id?: EntityID;

  readonly reason: string;

  readonly createdAt: Date;

  constructor(reason: string, createdAt: Date, id?: EntityID) {
    this.id = id || new EntityID();
    this.reason = reason;
    this.createdAt = createdAt;
  }

  static create(props: ICancellationProps): Either<InvalidCancellation, Cancellation> {
    if (!props.reason) {
      return left(new InvalidCancellation('Reason is required'));
    }

    if (!props.createdAt) {
      return left(new InvalidCancellation('Created at is required'));
    }

    const { id, reason, createdAt } = props;

    const cancellation = new Cancellation(reason, createdAt, id);

    return right(cancellation);
  }
}
