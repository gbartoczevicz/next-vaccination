import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { Either, right } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export class FakeUsersRepository implements IUsersRepository {
  async save(user: User): Promise<Either<InfraError, User>> {
    return Promise.resolve(right(user));
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
