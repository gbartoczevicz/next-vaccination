export abstract class FailedParams extends Error {
  readonly fields: string[];

  protected constructor(reason: string, fields: string[]) {
    super(reason);

    this.fields = fields;
  }
}
