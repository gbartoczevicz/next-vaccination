import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { User, UserEmail } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(request: ICreateUserDTO): Promise<User> {
    const doesUserAlreadyInUse = await this.usersRepository.findByEmail(request.email);

    if (doesUserAlreadyInUse) {
      throw new Error(`E-mail ${request.email} already in use`);
    }

    const userEmail = UserEmail.create(request.email);

    const user = User.create({
      name: request.name,
      email: userEmail,
      password: request.password,
      phone: request.phone
    });

    await this.usersRepository.create(user);

    return user;
  }
}
