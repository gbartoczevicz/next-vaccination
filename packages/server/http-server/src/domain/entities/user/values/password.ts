import { Either, left, right } from '@server/shared';
import { InvalidUserPassword } from '@entities/user/errors';

export interface IUserPasswordProps {
  password: string;
  hashed?: boolean;
}

export class UserPassword {
  readonly password: string;

  readonly hashed: boolean;

  constructor(props: IUserPasswordProps) {
    this.password = props.password;
    this.hashed = props.hashed;
  }

  static create(props: IUserPasswordProps): Either<InvalidUserPassword, UserPassword> {
    const { password, hashed } = props;

    if (!password) {
      return left(new InvalidUserPassword('Password must not be null or undefined'));
    }

    if (!hashed) {
      if (password.length < 8) {
        return left(new InvalidUserPassword('Password must have at least 8 characters'));
      }

      if (password.includes(' ')) {
        return left(new InvalidUserPassword('Password must not contain white spaces'));
      }
    }

    const userPassword = new UserPassword({
      password,
      hashed
    });

    return right(userPassword);
  }
}
