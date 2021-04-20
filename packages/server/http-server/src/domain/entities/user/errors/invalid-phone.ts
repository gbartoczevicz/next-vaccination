export class InvalidUserPhone extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
