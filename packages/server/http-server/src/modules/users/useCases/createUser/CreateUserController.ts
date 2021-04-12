import { Response } from 'express';

import { BaseController } from '@shared/infra/http/controllers/BaseController';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { ICreateUserDTO } from '@modules/users/useCases/createUser/ICreateUserDTO';
import { AccountAlreadyExists, UserValidation } from '@modules/users/useCases/createUser/CreateUserErrors';
import { UnexpectedError } from '@server/shared';

export class CreateUserController extends BaseController {
  private createUserUseCase: CreateUserUseCase;

  constructor(createUserUseCase: CreateUserUseCase) {
    super();

    this.createUserUseCase = createUserUseCase;
  }

  public async executeImpl(): Promise<Response> {
    const dto = this.request.body as ICreateUserDTO;

    try {
      const result = await this.createUserUseCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        if (error instanceof AccountAlreadyExists) {
          return this.conflict(error.error);
        }

        if (error instanceof UserValidation) {
          return this.badRequest(error.error);
        }

        const { message }: UnexpectedError = error;

        return this.internalServerError(message);
      }
    } catch (err) {
      return this.internalServerError(err);
    }

    return this.ok();
  }
}
