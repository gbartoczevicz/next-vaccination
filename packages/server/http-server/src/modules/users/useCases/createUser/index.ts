import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { CreateUserController } from '@modules/users/useCases/createUser/CreateUserController';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';

const usersRepository = new FakeUsersRepository();
const createUserUseCase = new CreateUserUseCase(usersRepository);
const createUserController = new CreateUserController(createUserUseCase);

export { createUserController };
