/* eslint-disable max-len */
import { Either, left, right } from '@server/shared';
import { InvalidUserEmail } from '@entities/user/errors';

export class UserEmail {
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }

  private static isValid(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  static create(email: string): Either<InvalidUserEmail, UserEmail> {
    if (!email) {
      return left(new InvalidUserEmail(`E-mail is required`));
    }

    if (!this.isValid(email)) {
      return left(new InvalidUserEmail(`E-mail ${email} is invalid`));
    }

    const userEmail = new UserEmail(email);

    return right(userEmail);
  }
}
