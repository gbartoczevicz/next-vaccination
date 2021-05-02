import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';

export interface IUsersRepository {
  save(user: User): Promise<User>;
  findByEmail(email: UserEmail): Promise<User | null>;
}
