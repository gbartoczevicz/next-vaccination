import { Response } from 'express';

import { BaseController } from '@shared/infra/http/controllers/BaseController';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { AppError } from '@server/shared';
import { AccountAlreadyExists } from '@modules/users/useCases/createUser/CreateUserErrors';

export class CreateUserController extends BaseController {
  private createUserUseCase: CreateUserUseCase;

  constructor(createUserUseCase: CreateUserUseCase) {
    super();

    this.createUserUseCase = createUserUseCase;
  }

  public async executeImpl(): Promise<Response> {
    const dto = this.request.body as ICreateUserDTO;

    try {
      await this.createUserUseCase.execute(dto);
    } catch (err) {
      if (err instanceof AccountAlreadyExists) {
        return this.conflict(err.message);
      }

      if (err instanceof AppError) {
        return this.badRequest(err.message);
      }

      return this.internalServerError(err);
    }

    return this.ok();
  }
}
