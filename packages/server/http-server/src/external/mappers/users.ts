import { User as Persistence } from '@prisma/client';
import { User } from '@entities/user';
import { EntityID, IMapper } from '@server/shared';

export type UsersPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'>;

export class UsersMapper implements IMapper<User, UsersPersistence> {
  get className(): string {
    return this.constructor.name;
  }

  toDomain(persistence: UsersPersistence): User {
    const { id, password, ...props } = persistence;

    const domainOrError = User.create({
      ...props,
      id: new EntityID(id),
      password: { password, hashed: true }
    });

    if (domainOrError.isLeft()) {
      console.error(`[${this.className}]`, domainOrError.value);
    }

    return domainOrError.value as User;
  }

  async toPersistence(domain: User): Promise<UsersPersistence> {
    const { id, name, email, password, phone } = domain;

    const encryptedPassword = await password.encrypt();

    const persistence: UsersPersistence = {
      id: id.value,
      name,
      email: email.email,
      password: encryptedPassword,
      phone: phone.value
    };

    return persistence;
  }
}
