import { ICreateUserDTO } from '@usecases/create-user';
import { User } from '@entities/user';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { AccountAlreadyExists, UserValidation } from '@usecases/create-user/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { Either, left, right } from '@server/shared';

type Response = Either<AccountAlreadyExists | InfraError | UserValidation, User>;

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: ICreateUserDTO): Promise<Response> {
    const userOrError = User.create({
      ...request,
      password: {
        password: request.password
      }
    });
    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const doesAccountAlreadyExistsOrError = await this.usersRepository.findByEmail(user.email);
    if (doesAccountAlreadyExistsOrError.isLeft()) {
      return left(doesAccountAlreadyExistsOrError.value);
    }

    const doesAccountAlreadyExists = doesAccountAlreadyExistsOrError.value;
    if (doesAccountAlreadyExists) {
      return left(new AccountAlreadyExists(doesAccountAlreadyExists.email.email));
    }

    return right(user);
  }
}
