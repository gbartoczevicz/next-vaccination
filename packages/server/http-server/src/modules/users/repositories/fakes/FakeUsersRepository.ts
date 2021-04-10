import { ICreateUserDTO, IFindUserByEmailDTO } from '@modules/users/dtos';
import { User } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User(data);

    this.users.push(user);

    return user;
  }

  public async findByEmail({ email }: IFindUserByEmailDTO): Promise<User | null> {
    const toFindUser = this.users.find((user) => user.email === email);

    return toFindUser;
  }
}
