import { User } from '@modules/users/entities';

export interface IUsersRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
