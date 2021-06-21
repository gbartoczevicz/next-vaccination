import { Controller, HttpRequest, HttpResponse } from '@adapters/contracts';
import { MissingParamError } from '@adapters/errors';
import { badRequest } from '@adapters/helpers/http-helper';
import { LoginUseCase } from '@usecases/login';

export class LoginController implements Controller {
  private readonly loginUseCase: LoginUseCase;

  constructor(loginUseCase: LoginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.user || !httpRequest.body?.password) {
      return badRequest(new MissingParamError('User or password'));
    }

    return {
      statusCode: 200,
      body: ''
    };
  }
}
