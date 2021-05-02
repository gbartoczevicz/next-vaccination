import { ICreateUserDTO } from '@usecases/create-user';
import { User } from '@entities/user';
import { UserEmail, UserPassword, UserPhone } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { AccountAlreadyExists, UserValidation } from '@usecases/create-user/errors';
import { Either, left, right, UnexpectedError } from '@server/shared';

type Response = Either<AccountAlreadyExists | UnexpectedError | UserValidation, User>;

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: ICreateUserDTO): Promise<Response> {
    const userEmailOrError = UserEmail.create(request.email);
    const userPhoneOrError = UserPhone.create(request.phone);
    const userPasswordOrError = UserPassword.create({
      password: request.password
    });

    if (userEmailOrError.isLeft()) {
      return left(userEmailOrError.value);
    }

    if (userPhoneOrError.isLeft()) {
      return left(userPhoneOrError.value);
    }

    if (userPasswordOrError.isLeft()) {
      return left(userPasswordOrError.value);
    }

    const userEmail = userEmailOrError.value;

    const doesAccountAlreadyExists = await this.usersRepository.findByEmail(userEmail);

    if (doesAccountAlreadyExists) {
      return left(new AccountAlreadyExists(userEmail.email));
    }

    const userOrError = User.create({
      name: request.name,
      email: userEmail,
      phone: userPhoneOrError.value,
      password: userPasswordOrError.value
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    try {
      await this.usersRepository.save(user);
    } catch (err) {
      return left(new UnexpectedError(err));
    }

    return right(user);
  }
}
