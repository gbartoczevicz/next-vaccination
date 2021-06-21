import { HttpResponse } from '@adapters/contracts';
import { ServerError } from '@adapters/errors';

export const badRequest = (error: Error): HttpResponse => ({
  status_code: 400,
  body: error
});

export const serverError = (): HttpResponse => ({
  status_code: 500,
  body: new ServerError()
});

export const ok = (data: any): HttpResponse => ({
  status_code: 200,
  body: data
});
