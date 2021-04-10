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

  protected ok<T>(dto?: T): Response {
    if (dto) {
      return this.response.status(200).json(dto);
    }

    return this.response.sendStatus(200);
  }

  protected internalServerError(error: Error | string): Response {
    console.error(error);

    return this.response.status(500).json({ message: error.toString() });
  }
}
