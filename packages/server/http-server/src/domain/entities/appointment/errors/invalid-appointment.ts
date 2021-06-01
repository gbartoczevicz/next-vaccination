export class InvalidAppointment extends Error {
  constructor(reason: string) {
    super(reason);
  }
}
