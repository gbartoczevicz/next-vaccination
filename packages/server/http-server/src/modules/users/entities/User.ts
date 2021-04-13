import { Entity, EntityID, Result } from '@server/shared';
import { UserEmail } from '@modules/users/entities';
import { UserPhone } from './UserPhone';

interface IUserProps {
  name: string;
  email: UserEmail;
  phone: UserPhone;
  password: string;
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

  get password(): string {
    return this.props.password;
  }

  private constructor(props: IUserProps, id?: EntityID) {
    super(props, id);
  }

  public static create(props: IUserProps, id?: EntityID): Result<User> {
    if (!props.name) {
      return Result.fail<User>('Name is required');
    }

    if (!props.password) {
      return Result.fail<User>('Password is required');
    }

    if (props.password.length < 8) {
      return Result.fail<User>('Password needs at least 8 characters');
    }

    const user = new User(props, id);

    return Result.ok<User>(user);
  }
}
