import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { EntityID, right } from '@server/shared';
import { Phone } from '@entities/phone';
import { FindUnique, Save } from './users';

export class FakeUsersRepository implements IUsersRepository {
  async save(user: User): Promise<Save> {
    return Promise.resolve(right(user));
  }

  async findById(id: string): Promise<FindUnique> {
    const fixture = User.create({
      id: new EntityID(id),
      name: 'Name',
      email: 'contact@email.com',
      password: { password: 'any_password' },
      phone: '0000-0000'
    }).value as User;

    return Promise.resolve(right(fixture));
  }

  async findByEmail(email: UserEmail): Promise<FindUnique> {
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

  async findByPhone(phone: Phone): Promise<FindUnique> {
    const fixture = User.create({
      name: 'any_name',
      email: 'valid_email@email.com',
      phone: phone.value,
      password: {
        password: 'any_password'
      }
    });
    return Promise.resolve(right(<User>fixture.value));
  }
}
