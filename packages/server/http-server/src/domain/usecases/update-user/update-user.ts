import { CreateUserErrors, User } from '@entities/user';
import { Either, EntityID, left, right } from '@server/shared';
import { AccountAlreadyExists, PasswordDoesNotMatch, UserNotFound } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { IUpdateUserDTO } from './dto';

type Response = Either<
  CreateUserErrors | InfraError | UserNotFound | AccountAlreadyExists | PasswordDoesNotMatch,
  User
>;

export class UpdateUserUseCase {
  private usersRepository: IUsersRepository;

  async execute(request: IUpdateUserDTO): Promise<Response> {
    const { id, email, name, password, phone, currentPassword } = request;

    const userToUpdateOrError = User.create({
      id: new EntityID(id),
      email,
      name,
      password: { password },
      phone
    });

    if (userToUpdateOrError.isLeft()) {
      return left(userToUpdateOrError.value);
    }

    const userToUpdate = userToUpdateOrError.value;

    const persistedUserOrError = await this.usersRepository.findById(userToUpdate.id.value);

    if (persistedUserOrError.isLeft()) {
      return left(persistedUserOrError.value);
    }

    if (!persistedUserOrError.value) {
      return left(new UserNotFound());
    }

    const persistedUser = persistedUserOrError.value;

    const userWithSameEmailOrError = await this.usersRepository.findByEmail(userToUpdate.email);

    if (userWithSameEmailOrError.isLeft()) {
      return left(userWithSameEmailOrError.value);
    }

    const userWithSameEmail = userWithSameEmailOrError.value;

    if (!userWithSameEmail?.id.equals(userToUpdate.id)) {
      return left(new AccountAlreadyExists(email));
    }

    const doesPasswordMatch = await persistedUser.password.compare(currentPassword);

    if (!doesPasswordMatch) {
      return left(new PasswordDoesNotMatch());
    }

    const userUpdatedOrError = await this.usersRepository.save(userToUpdate);

    if (userUpdatedOrError.isLeft()) {
      return left(userUpdatedOrError.value);
    }

    return right(userUpdatedOrError.value);
  }
}
