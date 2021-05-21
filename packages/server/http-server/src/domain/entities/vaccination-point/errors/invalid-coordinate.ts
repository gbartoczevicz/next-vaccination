export class InvalidCoordinate extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
