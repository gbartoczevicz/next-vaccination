export class PatientNotFound extends Error {
  constructor() {
    super('Patient not found');
  }
}
