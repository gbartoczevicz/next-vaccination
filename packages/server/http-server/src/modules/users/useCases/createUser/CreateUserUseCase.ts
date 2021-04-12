import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { User, UserEmail, UserPhone } from '@modules/users/entities';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AccountAlreadyExists, UserValidation } from '@modules/users/useCases/createUser/CreateUserErrors';
import { Either, left, Result, right, UnexpectedError } from '@server/shared';
import { IPasswordService } from '@modules/users/services/password/IPasswordService';

type Response = Either<AccountAlreadyExists | UnexpectedError | UserValidation, Result<void>>;

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  private passwordService: IPasswordService;

  constructor(usersRepository: IUsersRepository, passwordService: IPasswordService) {
    this.usersRepository = usersRepository;
    this.passwordService = passwordService;
  }

  public async execute(request: ICreateUserDTO): Promise<Response> {
    const userEmailOrError = UserEmail.create(request.email);
    const userPhoneOrError = UserPhone.create(request.phone);

    const result = Result.combine([userEmailOrError, userPhoneOrError]);

    if (result.isFailure) {
      return left(new UserValidation(result.error));
    }

    const userEmail = userEmailOrError.getValue();

    const doesAccountAlreadyExists = await this.usersRepository.findByEmail(userEmail);

    if (doesAccountAlreadyExists) {
      return left(new AccountAlreadyExists(userEmail.value));
    }

    const encryptedPassword = await this.passwordService.encrypt(request.password);

    const userOrError = User.create({
      name: request.name,
      email: userEmail,
      password: encryptedPassword,
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

    console.log(user);

    return right(Result.ok());
  }
}
