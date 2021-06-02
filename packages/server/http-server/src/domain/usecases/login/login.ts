import { User } from '@entities/user';
import { Either } from '@server/shared';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { ILoginDTO } from './dto';

type Response = Either<InfraError, User>;

export class LoginUseCase {
  private readonly usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: ILoginDTO): Promise<Response> {
    const { user, password } = request;
    const requestedAccount = await this.usersRepository.findByEmailAndPassword(user, password);
  }
}
