export class InvalidVaccine extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
