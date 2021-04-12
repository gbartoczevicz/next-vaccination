import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { PasswordService } from '@modules/users/services/password/implementations/PasswordService';
import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';

const usersRepository = new FakeUsersRepository();
const passwordService = new PasswordService();

const createUserUseCase = new CreateUserUseCase(usersRepository, passwordService);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
