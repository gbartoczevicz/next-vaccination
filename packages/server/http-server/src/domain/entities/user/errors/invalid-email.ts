export class InvalidUserEmail extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
