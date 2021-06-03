import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { InfraError } from '@usecases/output-ports/errors';
import { Either } from '@server/shared';
import { Phone } from '@entities/phone';

export type Save = Either<InfraError, User>;
export type FindUnique = Either<InfraError, User | null>;
export interface IUsersRepository {
  save(user: User): Promise<Save>;
  findById(id: string): Promise<FindUnique>;
  findByEmail(email: UserEmail): Promise<FindUnique>;
  findByPhone(phone: Phone): Promise<FindUnique>;
}
