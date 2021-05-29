import { User } from '@entities/user';
import { Either, left, right } from '@server/shared';
import { UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { IGetUserDTO } from './dto';

type Response = Either<InfraError | UserNotFound, User>;

export class GetUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: IGetUserDTO): Promise<Response> {
    const doesUserExistsOrError = await this.usersRepository.findById(request.userId);

    if (doesUserExistsOrError.isLeft()) {
      return left(doesUserExistsOrError.value);
    }

    if (!doesUserExistsOrError.value) {
      return left(new UserNotFound());
    }

    return right(doesUserExistsOrError.value);
  }
}
