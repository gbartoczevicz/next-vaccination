import { ICreateUserDTO, IFindUserByEmailDTO } from '@modules/users/dtos';
import { User } from '@modules/users/entities';

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(data: IFindUserByEmailDTO): Promise<User | null>;
}
