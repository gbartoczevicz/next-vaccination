export class InvalidCancellation extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
