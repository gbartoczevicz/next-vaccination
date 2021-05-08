import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { Either, EntityID, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export class FakeUsersRepository implements IUsersRepository {
  async save(user: User): Promise<Either<InfraError, User>> {
    return Promise.resolve(right(user));
  }

  async findById(id: string): Promise<Either<InfraError, User | null>> {
    const fixture = User.create({
      id: new EntityID(id),
      name: 'Name',
      email: 'contact@email.com',
      password: { password: 'secret' },
      phone: '0000-0000'
    }).value as User;

    return Promise.resolve(right(fixture));
  }

  async findByEmail(email: UserEmail): Promise<Either<InfraError, User | null>> {
    const fixture = User.create({
      name: 'any_name',
      email: email.email,
      phone: '(99) 99999-9999',
      password: {
        password: 'any_password'
      }
    });
    return Promise.resolve(right(<User>fixture.value));
  }
}
