import bcrypt from 'bcrypt';

import { Result } from '@server/shared';

interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword {
  private props: IUserPasswordProps;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserPasswordProps) {
    this.props = props;
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  public async compare(password: string): Promise<boolean> {
    let hashed: string;

    if (this.isAlreadyHashed()) {
      hashed = this.props.value;

      return bcrypt.compare(password, hashed);
    }

    return this.props.value === password;
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.props.value;
    }

    return bcrypt.hash(this.props.value, 8);
  }

  public static create({ value, hashed }: IUserPasswordProps): Result<UserPassword> {
    if (!value) {
      return Result.fail<UserPassword>('Password must not be null or undefined');
    }

    if (!hashed && value.length < 8) {
      return Result.fail<UserPassword>('Password must have at least 8 characters');
    }

    const userPassword = new UserPassword({
      value,
      hashed
    });

    return Result.ok(userPassword);
  }
}
