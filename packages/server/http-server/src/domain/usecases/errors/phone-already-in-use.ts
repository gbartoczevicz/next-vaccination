export class PhoneAlreadyInUse extends Error {
  constructor() {
    super(`Phone is already in use`);
  }
}
