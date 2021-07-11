import { Controller, HttpRequest, HttpResponse } from '@adapters/contracts';
import { MissingParamsError } from '@adapters/errors';
import { badRequest, created, serverError } from '@adapters/helpers/http-helper';
import { ValidatePayload } from '@adapters/helpers/validate-payload';
import { CreateVaccinationPointUseCase } from '@usecases/create-vaccination-point';

export class CreateVaccinationPointController implements Controller {
  private readonly validateHttpRequest: ValidatePayload;

  private readonly createVaccinationPointUseCase: CreateVaccinationPointUseCase;

  constructor(validateHttpRequest: ValidatePayload, createVaccinationPointUseCase: CreateVaccinationPointUseCase) {
    this.validateHttpRequest = validateHttpRequest;
    this.createVaccinationPointUseCase = createVaccinationPointUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validateHttpRequest.setRequiredFields(['name', 'phone', 'document', 'location', 'availability']);
    this.validateHttpRequest.setPayload(httpRequest.body);

    if (!this.validateHttpRequest.containsAllRequiredFields()) {
      return badRequest(MissingParamsError.create(this.validateHttpRequest.exibeMissingFields()));
    }

    const vaccinationPointCreatedOrError = await this.createVaccinationPointUseCase.execute(httpRequest.body);

    if (vaccinationPointCreatedOrError.isLeft()) {
      return serverError();
    }

    return created();
  }
}
