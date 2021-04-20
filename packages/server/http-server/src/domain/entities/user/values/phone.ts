import { Either, left, right } from '@server/shared';
import { InvalidUserPhone } from '@entities/user/errors';

export class UserPhone {
  private readonly phone: string;

  get value(): string {
    return this.phone;
  }

  constructor(value: string) {
    this.phone = value;
  }

  private static isValid(phone: string): boolean {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;

    return re.test(phone);
  }

  static create(phone: string): Either<InvalidUserPhone, UserPhone> {
    if (!phone) {
      return left(new InvalidUserPhone('Phone number is required'));
    }

    if (!this.isValid(phone)) {
      return left(new InvalidUserPhone(`Phone number ${phone} is invalid`));
    }

    const userPhone = new UserPhone(phone);

    return right(userPhone);
  }
}
