import { InvalidBirthday } from '@entities/patient/errors';
import { FakeDateUtils } from '@external/date-utils';
import { Either, left, right } from '@server/shared';
import { PatientBirthday } from '@entities/patient/values';

export const makeBirthday = (date: Date): Either<InvalidBirthday, PatientBirthday> => {
  const patientBirthdayOrError = PatientBirthday.create({
    date,
    dateUtils: new FakeDateUtils()
  });

  if (patientBirthdayOrError.isLeft()) {
    return left(patientBirthdayOrError.value);
  }

  return right(patientBirthdayOrError.value);
};
