export class InvalidBirthday extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
