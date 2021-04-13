import { User, UserEmail } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

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
