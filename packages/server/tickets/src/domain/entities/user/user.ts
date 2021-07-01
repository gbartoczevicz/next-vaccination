import { Either, EntityID, left, right } from '@server/shared';
import { InvalidUser } from '@entities/user/errors';

interface IUserProps {
  id: EntityID;
  name: string;
}

export class User {
  readonly id: EntityID;

  readonly name: string;

  constructor(id: EntityID, name: string) {
    this.id = id;
    this.name = name;
  }

  static create(props: IUserProps): Either<InvalidUser, User> {
    if (!props.id) {
      return left(new InvalidUser('ID is required'));
    }

    if (!props.name) {
      return left(new InvalidUser('Name is required'));
    }

    const user = new User(props.id, props.name);

    return right(user);
  }
}
