import { Result } from '@server/shared';

interface IUserPhoneProps {
  value: string;
}

export class UserPhone {
  private props: IUserPhoneProps;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserPhoneProps) {
    this.props = props;
  }

  private static isValid(phone: string): boolean {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;

    return re.test(phone);
  }

  public static create(phone: string) {
    if (!phone) {
      return Result.fail<UserPhone>('Phone number is required');
    }

    if (!this.isValid(phone)) {
      return Result.fail<UserPhone>(`Phone number ${phone} is invalid`);
    }

    const userPhone = new UserPhone({ value: phone });

    return Result.ok<UserPhone>(userPhone);
  }
}
