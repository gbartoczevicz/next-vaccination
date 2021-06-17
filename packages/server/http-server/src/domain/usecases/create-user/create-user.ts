import { ICreateUserDTO } from '@usecases/create-user';
import { CreateUserErrors, User } from '@entities/user';
import { IUsersRepository } from '@usecases/output-ports/repositories/users';
import { InfraError } from '@usecases/output-ports/errors';
import { Either, left, right } from '@server/shared';
import { EmailAlreadyInUse, PhoneAlreadyInUse } from '@usecases/errors';

type Response = Either<CreateUserErrors | EmailAlreadyInUse | PhoneAlreadyInUse | InfraError, User>;

export class CreateUserUseCase {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(request: ICreateUserDTO): Promise<Response> {
    const userOrError = User.create({
      ...request,
      password: {
        password: request.password
      }
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const doesEmailAlreadyInUseOrError = await this.usersRepository.findByEmail(user.email);

    if (doesEmailAlreadyInUseOrError.isLeft()) {
      return left(doesEmailAlreadyInUseOrError.value);
    }

    const doesEmailAlreadyInUse = doesEmailAlreadyInUseOrError.value;

    if (doesEmailAlreadyInUse) {
      return left(new EmailAlreadyInUse(doesEmailAlreadyInUse.email.email));
    }

    const doesPhoneAlreadyInUseOrError = await this.usersRepository.findByPhone(user.phone);

    if (doesPhoneAlreadyInUseOrError.isLeft()) {
      return left(doesPhoneAlreadyInUseOrError.value);
    }

    if (doesPhoneAlreadyInUseOrError.value) {
      return left(new PhoneAlreadyInUse());
    }

    const savedUserOrError = await this.usersRepository.save(user);

    if (savedUserOrError.isLeft()) {
      return left(savedUserOrError.value);
    }

    return right(user);
  }
}
