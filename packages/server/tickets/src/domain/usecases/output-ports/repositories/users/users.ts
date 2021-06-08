import { User } from '@entities/user';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';

export type FindUnique = Either<InfraError, User | null>;

export interface IUsersRepository {
  findById(id: string): Promise<FindUnique>;
}
