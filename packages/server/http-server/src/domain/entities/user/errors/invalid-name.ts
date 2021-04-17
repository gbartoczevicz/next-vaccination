export class InvalidUserName extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
