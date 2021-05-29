export class InvalidExpirationDate extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
