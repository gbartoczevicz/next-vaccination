import { Either, EntityID, left, right } from '@server/shared';
import { UserEmail, UserPassword, IUserPasswordProps } from '@entities/user/values';
import { Phone } from '@entities/phone';
import { makePassword } from '@entities/user/values/factories/make-password';
import { InvalidUser, InvalidUserEmail, InvalidUserPassword } from '@entities/user/errors';
import { InvalidPhone } from '@entities/phone/errors';

interface IUserProps {
  id?: EntityID;
  name: string;
  email: string;
  phone: string;
  password: IUserPasswordProps;
}

export type CreateUserErrors = InvalidUser | InvalidUserEmail | InvalidPhone | InvalidUserPassword;

type CreateResponse = Either<CreateUserErrors, User>;

export class User {
  readonly id: EntityID;

  readonly name: string;

  readonly email: UserEmail;

  readonly phone: Phone;

  readonly password: UserPassword;

  constructor(name: string, email: UserEmail, phone: Phone, password: UserPassword, id?: EntityID) {
    this.id = id || new EntityID();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.password = password;
  }

  static create(props: IUserProps): CreateResponse {
    if (!props.name) {
      return left(new InvalidUser('Name is required'));
    }

    const emailOrError = UserEmail.create(props.email);
    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const phoneOrError = Phone.create(props.phone);
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
