import { Controller, HttpRequest, HttpResponse } from '@adapters/contracts';
import { MissingParamError } from '@adapters/errors';
import { badRequest, ok, serverError } from '@adapters/helpers/http-helper';
import { ValidatePayload } from '@adapters/helpers/validate-payload';
import { LoginUseCase } from '@usecases/login';

export class LoginController implements Controller {
  private readonly validateHttpRequest: ValidatePayload;

  private readonly loginUseCase: LoginUseCase;

  constructor(loginUseCase: LoginUseCase, validateHttpRequest: ValidatePayload) {
    this.loginUseCase = loginUseCase;
    this.validateHttpRequest = validateHttpRequest;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validateHttpRequest.setRequiredFields(['user', 'password']);
    this.validateHttpRequest.setPayload(httpRequest.body);

    if (!this.validateHttpRequest.containsAllRequiredFields()) {
      const missingFields = this.validateHttpRequest.exibeMissingFields().join(' or ');
      return badRequest(new MissingParamError(missingFields));
    }

    const loginOrError = await this.loginUseCase.execute(httpRequest.body);
    if (loginOrError.isLeft()) {
      return serverError();
    }

    return ok(loginOrError.value);
  }
}
