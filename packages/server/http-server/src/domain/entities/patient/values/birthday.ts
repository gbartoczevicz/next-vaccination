import { IDateParser } from '@entities/output-ports/date-parser';
import { Either, left, right } from '@server/shared';
import { InvalidBirthday } from '../errors';

export class PatientBirthday {
  private value: Date;

  dateParser: IDateParser;

  get date(): Date {
    return this.dateParser.parseToUTCZuluTime(this.value);
  }

  constructor(date: Date) {
    this.value = date;
  }

  intejctDependencies(dateParser: IDateParser): void {
    this.dateParser = dateParser;
  }

  static create(date: Date): Either<InvalidBirthday, PatientBirthday> {
    if (!date) {
      return left(new InvalidBirthday('Date is required'));
    }

    return right(new PatientBirthday(date));
  }
}
