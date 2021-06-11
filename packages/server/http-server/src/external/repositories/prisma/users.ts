import { UserEmail } from '@entities/user/values';
import { IMapper, left, right } from '@server/shared';
import { client } from '@shared/infra/database/prisma';
import { InfraError } from '@usecases/output-ports/errors';
import { FindUnique, IUsersRepository, Save } from '@usecases/output-ports/repositories/users';
import { User } from '@entities/user';
import { Phone } from '@entities/phone';
import { UserPersistence } from '@external/mappers/users';

export class PrismaUserRepo implements IUsersRepository {
  private mapper: IMapper<User, UserPersistence>;

  constructor(mapper: IMapper<User, UserPersistence>) {
    this.mapper = mapper;
  }

  async findByEmail(email: UserEmail): Promise<FindUnique> {
    try {
      const rawUser = await client.user.findUnique({
        where: {
          email: email.email
        }
      });

      if (!rawUser) {
        return right(null);
      }

      const user = <User>this.mapper.toDomain(rawUser);

      return right(user);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findByPhone(phone: Phone): Promise<FindUnique> {
    try {
      const rawUser = await client.user.findUnique({
        where: {
          phone: phone.value
        }
      });

      if (!rawUser) {
        return right(null);
      }

      const user = <User>this.mapper.toDomain(rawUser);

      return right(user);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async findById(id: string): Promise<FindUnique> {
    try {
      const rawUser = await client.user.findUnique({
        where: {
          id
        }
      });

      if (!rawUser) {
        return right(null);
      }

      const user = <User>this.mapper.toDomain(rawUser);

      return right(user);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }

  async save(user: User): Promise<Save> {
    const toSaveRawUser = <UserPersistence>this.mapper.toPersistence(user);

    try {
      const rawUser = await client.user.upsert({
        where: {
          id: toSaveRawUser.id
        },
        create: toSaveRawUser,
        update: toSaveRawUser
      });

      const domain = <User>this.mapper.toDomain(rawUser);

      return right(domain);
    } catch (err) {
      return left(new InfraError(err.message));
    }
  }
}
