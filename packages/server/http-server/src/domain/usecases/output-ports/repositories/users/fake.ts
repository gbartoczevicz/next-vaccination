import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  public async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  public async findByEmail(email: UserEmail): Promise<User | null> {
    return this.users.find((user) => user.email.value === email.value);
  }
}
