import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { User, UserEmail } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AccountAlreadyExists } from '@modules/users/useCases/createUser/CreateUserErrors';

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(request: ICreateUserDTO): Promise<User> {
    const userEmail = UserEmail.create(request.email);

    const doesAccountAlreadyExists = await this.usersRepository.findByEmail(userEmail);

    if (doesAccountAlreadyExists) {
      throw new AccountAlreadyExists(doesAccountAlreadyExists.email.value);
    }

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
