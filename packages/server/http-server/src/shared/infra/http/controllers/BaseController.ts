import { Request, Response } from 'express';

export abstract class BaseController {
  protected request: Request;

  protected response: Response;

  protected abstract executeImpl(): Promise<void | unknown>;

  public execute(request: Request, response: Response): void {
    this.request = request;
    this.response = response;

    this.executeImpl();
  }

  private sendResponse(response: Response, code: number, message: string): Response {
    return response.status(code).json({ message });
  }

  protected ok<T>(dto?: T): Response {
    if (dto) {
      return this.response.status(200).json(dto);
    }

    return this.response.sendStatus(200);
  }

  public badRequest(message?: string): Response {
    return this.sendResponse(this.response, 400, message || 'Bad Request');
  }

  protected conflict(message?: string): Response {
    return this.sendResponse(this.response, 409, message || 'Conflict');
  }

  protected internalServerError(error: Error | string): Response {
    console.error(error);

    return this.response.status(500).json({ message: error.toString() });
  }
}
