import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { User, UserEmail } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AccountAlreadyExists } from '@modules/users/useCases/createUser/CreateUserErrors';
import { AppError } from '@server/shared';

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(request: ICreateUserDTO): Promise<User> {
    const userEmailOrError = UserEmail.create(request.email);

    if (userEmailOrError.isFailure) {
      throw new AppError(userEmailOrError.error);
    }

    const userEmail = userEmailOrError.getValue();

    const doesAccountAlreadyExists = await this.usersRepository.findByEmail(userEmail);

    if (doesAccountAlreadyExists) {
      throw new AccountAlreadyExists(doesAccountAlreadyExists.email.value);
    }

    const userOrError = User.create({
      name: request.name,
      email: userEmail,
      password: request.password,
      phone: request.phone
    });

    if (userOrError.isFailure) {
      throw new AppError(userOrError.error);
    }

    const user = userOrError.getValue();

    await this.usersRepository.create(user);

    return user;
  }
}
