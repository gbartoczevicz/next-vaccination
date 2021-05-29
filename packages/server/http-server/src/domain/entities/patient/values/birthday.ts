import { Either, left, right } from '@server/shared';
import { IDateUtils } from '@entities/output-ports/date-utils';
import { InvalidBirthday } from '../errors';

interface IPatientBirthdayProps {
  date: Date;
  dateUtils: IDateUtils;
}

export class PatientBirthday {
  readonly value: Date;

  constructor(date: Date) {
    this.value = date;
  }

  static create(props: IPatientBirthdayProps): Either<InvalidBirthday, PatientBirthday> {
    const { date, dateUtils } = props;

    if (!date) {
      return left(new InvalidBirthday('Date is required'));
    }

    const dateAtStartOfDay = dateUtils.toStartOfDay(date);

    const patientBirthday = new PatientBirthday(dateAtStartOfDay);

    return right(patientBirthday);
  }
}
