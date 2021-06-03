import { CreateUserErrors, User } from '@entities/user';
import { Either, left, right } from '@server/shared';
import { EmailAlreadyInUse, PasswordDoesNotMatch, PhoneAlreadyInUse } from '@usecases/errors';
import { InfraError } from '@usecases/output-ports/errors';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { IUpdateUserDTO } from './dto';

type ResponseErrors = CreateUserErrors | InfraError | EmailAlreadyInUse | PhoneAlreadyInUse | PasswordDoesNotMatch;

type Response = Either<ResponseErrors, User>;

export class UpdateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: IUpdateUserDTO): Promise<Response> {
    const { user } = request;

    const userToUpdateOrError = User.create({
      ...request,
      id: user.id,
      password: { password: request.password }
    });

    if (userToUpdateOrError.isLeft()) {
      return left(userToUpdateOrError.value);
    }

    const userToUpdate = userToUpdateOrError.value;

    const userWithSameEmailOrError = await this.usersRepository.findByEmail(userToUpdate.email);

    if (userWithSameEmailOrError.isLeft()) {
      return left(userWithSameEmailOrError.value);
    }

    const userWithSameEmail = userWithSameEmailOrError.value;

    if (userWithSameEmail && !userWithSameEmail.id.equals(userToUpdate.id)) {
      return left(new EmailAlreadyInUse(userToUpdate.email.email));
    }

    const userWithSamePhoneOrError = await this.usersRepository.findByPhone(userToUpdate.phone);

    if (userWithSamePhoneOrError.isLeft()) {
      return left(userWithSamePhoneOrError.value);
    }

    const userWithSamePhone = userWithSamePhoneOrError.value;

    if (userWithSamePhone && !userWithSamePhone.id.equals(userToUpdate.id)) {
      return left(new PhoneAlreadyInUse());
    }

    const doesPasswordMatch = await user.password.compare(request.currentPassword);

    if (!doesPasswordMatch) {
      return left(new PasswordDoesNotMatch());
    }

    const updatedUserOrError = await this.usersRepository.save(userToUpdateOrError.value);

    if (updatedUserOrError.isLeft()) {
      return left(updatedUserOrError.value);
    }

    return right(updatedUserOrError.value);
  }
}
