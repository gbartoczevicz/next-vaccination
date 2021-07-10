import { Controller, HttpRequest, HttpResponse } from '@adapters/contracts';
import { MissingParamsError } from '@adapters/errors';
import { badRequest, created, serverError } from '@adapters/helpers/http-helper';
import { ValidatePayload } from '@adapters/helpers/validate-payload';
import { CreateHealthProfessionalUseCase } from '@usecases/create-health-professional';
import { GetUserUseCase } from '@usecases/get-user';
import { GetVaccinationPointUseCase } from '@usecases/get-vaccination-point';

export class CreateResponsibleController implements Controller {
  private readonly validateHttpRequest: ValidatePayload;

  private readonly getUserUseCase: GetUserUseCase;

  private readonly getVaccinationPoint: GetVaccinationPointUseCase;

  private readonly createResponsibleUseCase: CreateHealthProfessionalUseCase;

  constructor(
    validateHttpRequest: ValidatePayload,
    getUserUseCase: GetUserUseCase,
    getVaccinationPoint: GetVaccinationPointUseCase,
    createResponsibleUseCase: CreateHealthProfessionalUseCase
  ) {
    this.validateHttpRequest = validateHttpRequest;
    this.getUserUseCase = getUserUseCase;
    this.getVaccinationPoint = getVaccinationPoint;
    this.createResponsibleUseCase = createResponsibleUseCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.validateHttpRequest.setRequiredFields(['user_id', 'vaccination_point_id', 'document']);
    this.validateHttpRequest.setPayload(httpRequest.body);

    if (!this.validateHttpRequest.containsAllRequiredFields()) {
      return badRequest(MissingParamsError.create(this.validateHttpRequest.exibeMissingFields()));
    }

    const userOrError = await this.getUserUseCase.execute(httpRequest.body);

    if (userOrError.isLeft()) {
      return serverError();
    }

    const vaccinationPointOrError = await this.getVaccinationPoint.execute(httpRequest.body);

    if (vaccinationPointOrError.isLeft()) {
      return serverError();
    }

    const responsibleOrError = await this.createResponsibleUseCase.execute({
      user: userOrError.value,
      vaccinationPoint: vaccinationPointOrError.value,
      responsible: true,
      document: httpRequest.body.document
    });

    if (responsibleOrError.isLeft()) {
      return serverError();
    }

    return created();
  }
}
