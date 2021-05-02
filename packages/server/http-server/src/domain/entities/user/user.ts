import { Either, EntityID, left, right } from '@server/shared';
import { UserEmail, UserPhone, UserPassword } from '@entities/user/values';
import { InvalidUserName, InvalidUserEmail, InvalidUserPassword, InvalidUserPhone } from '@entities/user/errors';

interface IUserProps {
  id: EntityID;
  name: string;
  email: UserEmail;
  phone: UserPhone;
  password: UserPassword;
}

type CreateResponse = Either<InvalidUserName | InvalidUserEmail | InvalidUserPhone | InvalidUserPassword, User>;

export class User {
  readonly id: EntityID;

  readonly name: string;

  readonly email: UserEmail;

  readonly phone: UserPhone;

  readonly password: UserPassword;

  constructor(props: IUserProps, id?: EntityID) {
    this.id = id || new EntityID();
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.password = props.password;
  }

  static create(props: IUserProps, id?: EntityID): CreateResponse {
    const { name } = props;

    if (!name) {
      return left(new InvalidUserName('Name is required'));
    }

    const emailOrError = UserEmail.create(props.email?.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const phoneOrError = UserPhone.create(props.phone?.phone);

    if (phoneOrError.isLeft()) {
      return left(phoneOrError.value);
    }

    const { password, hashed } = props.password;

    const passwordOrError = UserPassword.create({
      password,
      hashed
    });

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const user = new User({
      id,
      name,
      email: emailOrError.value,
      phone: phoneOrError.value,
      password: passwordOrError.value
    });

    return right(user);
  }
}
