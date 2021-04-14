import { ICreateUserDTO } from '@usecases/create-user';
import { User } from '@entities/user';
import { UserEmail, UserPassword, UserPhone } from '@entities/user/values';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { AccountAlreadyExists, UserValidation } from '@usecases/create-user/errors';
import { Either, left, Result, right, UnexpectedError } from '@server/shared';

type Response = Either<AccountAlreadyExists | UnexpectedError | UserValidation, Result<void>>;

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async execute(request: ICreateUserDTO): Promise<Response> {
    const userEmailOrError = UserEmail.create(request.email);
    const userPhoneOrError = UserPhone.create(request.phone);
    const userPasswordOrError = UserPassword.create({ value: request.password });

    const result = Result.combine([userEmailOrError, userPhoneOrError, userPasswordOrError]);

    if (result.isFailure) {
      return left(new UserValidation(result.error));
    }

    const userEmail = userEmailOrError.getValue();

    const doesAccountAlreadyExists = await this.usersRepository.findByEmail(userEmail);

    if (doesAccountAlreadyExists) {
      return left(new AccountAlreadyExists(userEmail.value));
    }

    const userPassword = userPasswordOrError.getValue();

    const hashedPassword = await userPassword.getHashedValue();

    const hashedUserPassword = UserPassword.create({
      value: hashedPassword,
      hashed: true
    }).getValue();

    const userOrError = User.create({
      name: request.name,
      email: userEmail,
      password: hashedUserPassword,
      phone: userPhoneOrError.getValue()
    });

    if (userOrError.isFailure) {
      return left(new UserValidation(userOrError.error));
    }

    const user = userOrError.getValue();

    try {
      await this.usersRepository.create(user);
    } catch (err) {
      return left(new UnexpectedError(err));
    }

    return right(Result.ok());
  }
}
