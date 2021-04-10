import { Entity, EntityID } from '@server/shared';
import { UserEmail } from '@modules/users/entities';

interface IUserProps {
  name: string;
  email: UserEmail;
  phone: string;
  password: string;
}

export class User extends Entity<IUserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get password(): string {
    return this.props.password;
  }

  private constructor(props: IUserProps, id?: EntityID) {
    super(props, id);
  }

  public static create(props: IUserProps, id?: EntityID): User {
    const user = new User(props, id);

    return user;
  }
}
