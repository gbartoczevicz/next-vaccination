import { Entity, EntityID, Result } from '@server/shared';
import { UserEmail, UserPhone, UserPassword } from '@modules/users/entities';

interface IUserProps {
  name: string;
  email: UserEmail;
  phone: UserPhone;
  password: UserPassword;
}

export class User extends Entity<IUserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get phone(): UserPhone {
    return this.props.phone;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  private constructor(props: IUserProps, id?: EntityID) {
    super(props, id);
  }

  public static create(props: IUserProps, id?: EntityID): Result<User> {
    if (!props.name) {
      return Result.fail<User>('Name is required');
    }

    if (!props.email) {
      return Result.fail<User>('E-mail is required');
    }

    if (!props.phone) {
      return Result.fail<User>('Phone is required');
    }

    if (!props.password) {
      return Result.fail<User>('Password is required');
    }

    const user = new User(props, id);

    return Result.ok<User>(user);
  }
}
