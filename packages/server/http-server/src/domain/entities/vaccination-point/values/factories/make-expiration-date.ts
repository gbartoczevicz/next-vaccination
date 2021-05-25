import { Either, left, right } from '@server/shared';
import { InvalidExpirationDate } from '@entities/vaccination-point/errors';
import { FakeDateUtils } from '@external/date-utils';
import { ExpirationDate } from '../expiration-date';

export const makeExpirationDate = (value: Date): Either<InvalidExpirationDate, ExpirationDate> => {
  const expirationDateOrError = ExpirationDate.create({
    value,
    dateUtils: new FakeDateUtils()
  });

  if (expirationDateOrError.isLeft()) {
    return left(expirationDateOrError.value);
  }

  return right(expirationDateOrError.value);
};
