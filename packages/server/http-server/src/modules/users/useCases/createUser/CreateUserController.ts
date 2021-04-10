import { Request, Response } from 'express';

import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';

export class CreateUserController {
  private createUserUseCase: CreateUserUseCase;

  constructor(createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  public async execute(request: Request, response: Response): Promise<Response> {
    const toCreateUser = request.body as ICreateUserDTO;

    try {
      const userCreated = await this.createUserUseCase.execute(toCreateUser);

      return response.json({
        name: userCreated.name,
        email: userCreated.email.value,
        password: userCreated.password
      });
    } catch (err) {
      return response.status(500).json({ message: err.message });
    }
  }
}
