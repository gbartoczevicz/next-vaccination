export class InvalidPatient extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
