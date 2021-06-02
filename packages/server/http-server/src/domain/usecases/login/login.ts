import { User } from '@entities/user';
import { Either, left, right } from '@server/shared';
import { AccountNotFinded } from '@usecases/errors/account-not-finded';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { ILoginDTO } from './dto';

type Response = Either<AccountNotFinded | InfraError, User>;

export class LoginUseCase {
  private readonly usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: ILoginDTO): Promise<Response> {
    const { user, password } = request;
    const requestedAccount = await this.usersRepository.findByEmailAndPassword(user, password);

    const accountNotFinded = !requestedAccount.value;
    if (requestedAccount.isLeft() || accountNotFinded) {
      const handledError = !requestedAccount.value ? new AccountNotFinded() : (requestedAccount.value as InfraError);
      return left(handledError);
    }

    return right(requestedAccount.value);
  }
}
