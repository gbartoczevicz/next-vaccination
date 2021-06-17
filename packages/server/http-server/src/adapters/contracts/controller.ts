import { HttpRequest, HttpResponse } from '@adapters/contracts/http';

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
