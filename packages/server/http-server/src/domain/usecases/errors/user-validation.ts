export class UserValidation extends Error {
  constructor(error: string) {
    super(`User validation failed: ${error}`);
  }
}
