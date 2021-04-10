import { Response } from 'express';

import { BaseController } from '@shared/infra/http/controllers/BaseController';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';

export class CreateUserController extends BaseController {
  private createUserUseCase: CreateUserUseCase;

  constructor(createUserUseCase: CreateUserUseCase) {
    super();

    this.createUserUseCase = createUserUseCase;
  }

  public async executeImpl(): Promise<Response> {
    const toCreateUser = this.request.body as ICreateUserDTO;

    try {
      const userCreated = await this.createUserUseCase.execute(toCreateUser);

      return this.ok(userCreated);
    } catch (err) {
      return this.internalServerError(err);
    }
  }
}
