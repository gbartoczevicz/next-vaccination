import { Encrypter } from '@entities/output-ports/encrypter';
import { User } from '@entities/user';
import { UserEmail } from '@entities/user/values';
import { Either, left, right } from '@server/shared';
import { PasswordDoesNotMatch, UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { ILoginDTO } from './dto';

type Response = Either<InfraError | UserNotFound | PasswordDoesNotMatch, User>;

export class LoginUseCase {
  private readonly usersRepository: IUsersRepository;

  private readonly encrypter: Encrypter;

  constructor(usersRepository: IUsersRepository, encrypter: Encrypter) {
    this.usersRepository = usersRepository;
    this.encrypter = encrypter;
  }

  async execute(request: ILoginDTO): Promise<Response> {
    const { user, password: receivedPassword } = request;

    const mailOrError = UserEmail.create(user);
    if (mailOrError.isLeft()) {
      return left(mailOrError.value);
    }

    const requestedAccount = await this.usersRepository.findByEmail(mailOrError.value);
    const accountNotFinded = !requestedAccount.value;
    if (accountNotFinded || requestedAccount.isLeft()) {
      const handledError = !requestedAccount.value ? new UserNotFound() : (requestedAccount.value as InfraError);
      return left(handledError);
    }

    const comparedPassword = await this.encrypter.compare(receivedPassword, requestedAccount.value.password.password);
    if (!comparedPassword) {
      return left(new PasswordDoesNotMatch());
    }

    return right(requestedAccount.value);
  }
}
