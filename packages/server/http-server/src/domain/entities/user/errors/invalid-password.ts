export class InvalidUserPassword extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
