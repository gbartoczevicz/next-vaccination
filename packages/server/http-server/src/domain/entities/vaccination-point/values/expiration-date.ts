import { IDateUtils } from '@entities/output-ports/date-utils';
import { Either, left, right } from '@server/shared';
import { InvalidExpirationDate } from '../errors';

export interface IExpirationDateProps {
  value: Date;
  dateUtils: IDateUtils;
}

export class ExpirationDate {
  readonly value: Date;

  constructor(value: Date) {
    this.value = value;
  }

  static create(props: IExpirationDateProps): Either<InvalidExpirationDate, ExpirationDate> {
    if (!props.dateUtils) {
      return left(new InvalidExpirationDate('DateUtils dependency is required'));
    }

    if (!props.value) {
      return left(new InvalidExpirationDate('Value is required'));
    }

    if (props.dateUtils.isTodayOrBefore(props.value)) {
      return left(new InvalidExpirationDate('The date must be later than today'));
    }

    return right(new ExpirationDate(props.value));
  }
}
