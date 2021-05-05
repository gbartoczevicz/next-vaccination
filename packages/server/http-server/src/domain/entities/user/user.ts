import { Either, EntityID, left, right } from '@server/shared';
import { UserEmail, UserPhone, UserPassword, IUserPasswordProps } from '@entities/user/values';
import { makePassword } from '@entities/user/values/factories/make-password';
import { InvalidUserName, InvalidUserEmail, InvalidUserPassword, InvalidUserPhone } from '@entities/user/errors';

interface IUserProps {
  id?: EntityID;
  name: string;
  email: string;
  phone: string;
  password: IUserPasswordProps;
}

type CreateResponse = Either<InvalidUserName | InvalidUserEmail | InvalidUserPhone | InvalidUserPassword, User>;

export class User {
  readonly id: EntityID;

  readonly name: string;

  readonly email: UserEmail;

  readonly phone: UserPhone;

  readonly password: UserPassword;

  constructor(name: string, email: UserEmail, phone: UserPhone, password: UserPassword, id?: EntityID) {
    this.id = id || new EntityID();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
  }

  static create(props: IUserProps): CreateResponse {
    if (!props.name) {
      return left(new InvalidUserName('Name is required'));
    }

    const emailOrError = UserEmail.create(props.email);
    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const phoneOrError = UserPhone.create(props.phone);
    if (phoneOrError.isLeft()) {
      return left(phoneOrError.value);
    }

    const passwordOrError = makePassword(props.password);
    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const user = new User(props.name, emailOrError.value, phoneOrError.value, passwordOrError.value, props.id);

    return right(user);
  }
}
