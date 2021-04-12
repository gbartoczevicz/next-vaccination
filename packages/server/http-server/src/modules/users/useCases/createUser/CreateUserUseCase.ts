import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { User, UserEmail } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AccountAlreadyExists, UserValidationError } from '@modules/users/useCases/createUser/CreateUserErrors';
import { Result } from '@server/shared';
import { UserPhone } from '@modules/users/entities/UserPhone';

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(request: ICreateUserDTO): Promise<User> {
    const userEmailOrError = UserEmail.create(request.email);
    const userPhoneOrError = UserPhone.create(request.phone);

    const result = Result.combine([userEmailOrError, userPhoneOrError]);

    if (result.isFailure) {
      throw new UserValidationError(result.error);
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
      phone: userPhoneOrError.getValue()
    });

    if (userOrError.isFailure) {
      throw new UserValidationError(userOrError.error);
    }

    const user = userOrError.getValue();

    await this.usersRepository.create(user);

    return user;
  }
}
