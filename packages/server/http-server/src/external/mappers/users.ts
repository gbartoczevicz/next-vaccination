import { User as Persistence } from '@prisma/client';
import { User } from '@entities/user';
import { EntityID, IMapper } from '@server/shared';

export type UserPersistence = Omit<Persistence, 'createdAt' | 'updatedAt'>;

export class UsersMapper implements IMapper<User, UserPersistence> {
  toDomain(persistence: UserPersistence): User {
    const { id, name, email, password, phone } = persistence;

    const toDomainUserOrError = User.create({
      id: new EntityID(id),
      name,
      email,
      password: { password, hashed: true },
      phone
    });

    return toDomainUserOrError.value as User;
  }

  async toPersistence(user: User): Promise<UserPersistence> {
    const { id, name, email, password, phone } = user;

    const encryptedPassword = await password.encrypt();

    const toPersistenceUser: UserPersistence = {
      id: id.value,
      name,
      email: email.email,
      password: encryptedPassword,
      phone: phone.value
    };

    return toPersistenceUser;
  }
}
