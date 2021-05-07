import { IDateParser } from '@entities/output-ports/date-parser';
import { Either, left, right } from '@server/shared';
import { InvalidBirthday } from '../errors';

export class PatientBirthday {
  readonly date: Date;

  dateParser: IDateParser;

  constructor(date: Date) {
    this.date = date;
  }

  /**
   * TODO: format date to UTC 00:00 and remove time
   */
  private static format(dateToFormat: Date): Date {
    return dateToFormat;
  }

  intejctDependencies(dateParser: IDateParser): void {
    this.dateParser = dateParser;
  }

  static create(date: Date): Either<InvalidBirthday, PatientBirthday> {
    if (!(date instanceof Date)) {
      return left(new InvalidBirthday(`Value ${date} must be a Date object`));
    }

    if (!date) {
      return left(new InvalidBirthday('Birthday is required'));
    }

    if (date.getTimezoneOffset() !== 0) {
      return left(new InvalidBirthday('Birthday must have UTC 00:00 offset'));
    }

    const formattedDate = this.format(date);

    return right(new PatientBirthday(formattedDate));
  }
}
