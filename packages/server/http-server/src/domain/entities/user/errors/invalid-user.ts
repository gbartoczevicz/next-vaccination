export class InvalidUser extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
