import { ICreateUserDTO } from '@modules/users/dtos';
import { User } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(data: ICreateUserDTO): Promise<User> {
    const doesUserAlreadyInUse = await this.usersRepository.findByEmail({ email: data.email });

    if (doesUserAlreadyInUse) {
      throw new Error(`E-mail ${data.email} already in use`);
    }

    const user = await this.usersRepository.create(data);

    return user;
  }
}
