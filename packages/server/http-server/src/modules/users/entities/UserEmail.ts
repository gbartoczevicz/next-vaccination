import { Result } from '@server/shared';

/* eslint-disable max-len */
interface IUserEmailProps {
  value: string;
}

export class UserEmail {
  private props: IUserEmailProps;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: IUserEmailProps) {
    this.props = props;
  }

  private static isValid(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  public static create(email: string): Result<UserEmail> {
    if (!email) {
      return Result.fail<UserEmail>('E-mail is required');
    }

    if (!this.isValid(email)) {
      return Result.fail<UserEmail>(`E-mail address ${email} is invalid`);
    }

    const userEmail = new UserEmail({ value: email });

    return Result.ok<UserEmail>(userEmail);
  }
}
