export class PasswordDoesNotMatch extends Error {
  constructor() {
    super('Password provided does not match');
  }
}
