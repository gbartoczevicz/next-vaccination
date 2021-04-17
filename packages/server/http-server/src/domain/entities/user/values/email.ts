import { Either, left, right, ValueObject } from '@server/shared';
import { InvalidUserEmail } from '@entities/user/errors';

interface IUserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<IUserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  constructor(props: IUserEmailProps) {
    super(props);
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

    const userEmail = new UserEmail({ value: email });

    return right(userEmail);
  }
}
