import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { InfraError } from '@usecases/output-ports/errors';
import { Either } from '@server/shared';

export interface IUsersRepository {
  save(user: User): Promise<Either<InfraError, User>>;
  findByEmail(email: UserEmail): Promise<Either<InfraError, User | null>>;
}
