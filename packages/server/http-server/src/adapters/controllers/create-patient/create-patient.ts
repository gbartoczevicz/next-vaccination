import { Controller, HttpRequest, HttpResponse } from '@adapters/contracts';
import { MissingParamError } from '@adapters/errors';
import { badRequest, created, serverError } from '@adapters/helpers/http-helper';
import { ValidatePayload } from '@adapters/helpers/validate-payload';
import { CreatePatientUseCase } from '@usecases/create-patient';
import { CreateUserUseCase } from '@usecases/create-user';

export class CreatePatientController implements Controller {
  private readonly validateHttpRequest: ValidatePayload;

  private readonly createUserUseCase: CreateUserUseCase;

  private readonly createPatientUseCase: CreatePatientUseCase;

  constructor(
    validateHttpRequest: ValidatePayload,
    createUserUseCase: CreateUserUseCase,
    createPatientUseCase: CreatePatientUseCase
  ) {
    this.validateHttpRequest = validateHttpRequest;
    this.createUserUseCase = createUserUseCase;
    this.createPatientUseCase = createPatientUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validateHttpRequest.setRequiredFields(['name', 'email', 'phone', 'password', 'birthday', 'document']);
    this.validateHttpRequest.setPayload(httpRequest.body);

    if (!this.validateHttpRequest.containsAllRequiredFields()) {
      const missingFields = this.validateHttpRequest.exibeMissingFields().join(' or ');
      return badRequest(new MissingParamError(missingFields));
    }

    const userOrError = await this.createUserUseCase.execute(httpRequest.body);

    if (userOrError.isLeft()) {
      return serverError();
    }

    const patientOrError = await this.createPatientUseCase.execute({
      user: userOrError.value,
      ...httpRequest.body
    });

    if (patientOrError.isLeft()) {
      return serverError();
    }

    return created();
  }
}
