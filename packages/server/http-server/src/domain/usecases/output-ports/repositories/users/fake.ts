import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  async findByEmail(email: UserEmail): Promise<User | null> {
    return this.users.find((user) => user.email.email === email.email);
  }
}
