import { Either, left, right } from '@server/shared';
import { InvalidPhone } from '@entities/phone/errors';

export class Phone {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  private static isValid(value: string): boolean {
    const re = /^\d{8,12}$/;

    return re.test(value);
  }

  private static format(value: string): string {
    return value.trim().replace(' ', '').replace('(', '').replace(')', '').replace('-', '');
  }

  static create(value: string): Either<InvalidPhone, Phone> {
    if (!value) {
      return left(new InvalidPhone('Phone number is required'));
    }

    const formattedPhone = this.format(value);

    if (!this.isValid(formattedPhone)) {
      return left(new InvalidPhone(`Phone number ${value} is invalid`));
    }

    const userPhone = new Phone(formattedPhone);

    return right(userPhone);
  }
}
