import { User } from '@entities/user';
import { EntityID, right } from '@server/shared';
import { FindUnique, IUsersRepository } from './users';

export class FakeUsersRepository implements IUsersRepository {
  async findById(id: string): Promise<FindUnique> {
    const fixture = User.create({
      id: new EntityID(id),
      name: 'Any Name'
    }).value as User;

    return Promise.resolve(right(fixture));
  }
}
