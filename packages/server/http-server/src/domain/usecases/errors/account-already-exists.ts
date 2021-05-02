export class AccountAlreadyExists extends Error {
  constructor(email: string) {
    super(`E-mail address ${email} is already in use`);
  }
}
