import { InvalidBirthday } from '@entities/patient/errors';
import { FakeDateParser } from '@external/date-parser';
import { Either, left, right } from '@server/shared';
import { PatientBirthday } from '../patient-birthday';

export const makeBirthday = (date: Date): Either<InvalidBirthday, PatientBirthday> => {
  const patientBirthdayOrError = PatientBirthday.create(date);

  if (patientBirthdayOrError.isLeft()) {
    return left(patientBirthdayOrError.value);
  }

  patientBirthdayOrError.value.intejctDependencies(new FakeDateParser());

  return right(patientBirthdayOrError.value);
};
