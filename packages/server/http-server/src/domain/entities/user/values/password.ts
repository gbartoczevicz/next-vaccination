import { Either, left, right, ValueObject } from '@server/shared';
import { InvalidUserPassword } from '../errors';

interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  get value(): string {
    return this.props.value;
  }

  constructor(props: IUserPasswordProps) {
    super(props);
  }

  isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  static create({ value, hashed }: IUserPasswordProps): Either<InvalidUserPassword, UserPassword> {
    if (!value) {
      return left(new InvalidUserPassword('Password must not be null or undefined'));
    }

    if (!hashed && value.length < 8) {
      return left(new InvalidUserPassword('Password must have at least 8 characters'));
    }

    const userPassword = new UserPassword({
      value,
      hashed
    });

    return right(userPassword);
  }
}
