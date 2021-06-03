export class PatientDoesNotHaveTicket extends Error {
  constructor() {
    super('Patient does not have ticket');
  }
}
