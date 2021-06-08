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

  async execute(dto: IGetUserDTO): Promise<Response> {
    const userFoundOrError = await this.usersRepository.findById(dto.userId);

    if (userFoundOrError.isLeft()) {
      return left(userFoundOrError.value);
    }

    const userFound = userFoundOrError.value;

    if (!userFound) {
      return left(new UserNotFound());
    }

    return right(userFound);
  }
}
