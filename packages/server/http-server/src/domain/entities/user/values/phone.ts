import { Either, left, right, ValueObject } from '@server/shared';
import { InvalidUserPhone } from '@entities/user/errors';

interface IUserPhoneProps {
  value: string;
}

export class UserPhone extends ValueObject<IUserPhoneProps> {
  get value(): string {
    return this.props.value;
  }

  constructor(props: IUserPhoneProps) {
    super(props);
  }

  private static isValid(phone: string): boolean {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;

    return re.test(phone);
  }

  static create(phone: string): Either<InvalidUserPhone, UserPhone> {
    if (!phone) {
      return left(new InvalidUserPhone('Phone number is required'))
    }

    if (!this.isValid(phone)) {
      return left(new InvalidUserPhone(`Phone number ${phone} is invalid`))
    }

    const userPhone = new UserPhone({ value: phone });

    return right(userPhone);
  }
}
