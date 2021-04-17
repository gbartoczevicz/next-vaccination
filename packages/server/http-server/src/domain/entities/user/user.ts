import { Either, Entity, EntityID, Result, left, right } from '@server/shared';
import { UserEmail, UserPhone, UserPassword } from '@entities/user/values';
import { InvalidUserName, InvalidUserEmail, InvalidUserPassword, InvalidUserPhone } from '@entities/user/errors';
interface IUserProps {
  name: string;
  email: UserEmail;
  phone: UserPhone;
  password: UserPassword;
}

type CreateReturnType = Either<
  InvalidUserName | InvalidUserEmail | InvalidUserPhone | InvalidUserPassword, 
  User
>

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

  constructor(props: IUserProps, id?: EntityID) {
    super(props, id);
  }

  static create(props: IUserProps, id?: EntityID): CreateReturnType {
    const { name } = props;

    if (!name) {
      return left(new InvalidUserName('Name is required'));
    }

    const userEmailOrError = UserEmail.create(props.email.value);

    if (userEmailOrError.isLeft()) {
      return left(userEmailOrError.value);
    }

    const userPhoneOrError = UserPhone.create(props.phone.value);

    if (userPhoneOrError.isLeft()) {
      return left(userPhoneOrError.value);
    }

    const userPasswordOrError = UserPassword.create({
      value: props.password.value,
      hashed: props.password.isAlreadyHashed()
    });

    if (userPasswordOrError.isLeft()) {
      return left(userPasswordOrError.value);
    }

    const user = new User({
      name,
      email: userEmailOrError.value,
      password: userPasswordOrError.value,
      phone: userPhoneOrError.value
    }, id);

    return right(user);
  }
}
