import { FailedParams } from './failed-params';

export class MissingParamsError extends FailedParams {
  private constructor(params: string[]) {
    super('The following params are required', params);
  }

  static create(fields: string[]): MissingParamsError {
    return new MissingParamsError(fields);
  }
}
