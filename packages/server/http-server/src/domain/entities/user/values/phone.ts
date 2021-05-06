import { Either, left, right } from '@server/shared';
import { InvalidUserPhone } from '@entities/user/errors';

export class UserPhone {
  readonly phone: string;

  constructor(phone: string) {
    this.phone = phone;
  }

  private static isValid(phone: string): boolean {
    const re = /^\d{8,12}$/;

    return re.test(phone);
  }

  private static format(phone: string): string {
    return phone.trim().replace(' ', '').replace('(', '').replace(')', '').replace('-', '');
  }

  static create(phone: string): Either<InvalidUserPhone, UserPhone> {
    if (!phone) {
      return left(new InvalidUserPhone('Phone number is required'));
    }

    const formattedPhone = this.format(phone);

    if (!this.isValid(formattedPhone)) {
      return left(new InvalidUserPhone(`Phone number ${phone} is invalid`));
    }

    const userPhone = new UserPhone(formattedPhone);

    return right(userPhone);
  }
}
