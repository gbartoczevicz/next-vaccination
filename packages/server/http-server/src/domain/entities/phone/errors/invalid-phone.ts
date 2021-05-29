export class InvalidPhone extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
