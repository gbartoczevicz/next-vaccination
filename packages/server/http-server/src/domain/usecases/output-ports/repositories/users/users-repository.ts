import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';

export interface IUsersRepository {
  create(user: User): Promise<User>;
  findByEmail(email: UserEmail): Promise<User | null>;
}
