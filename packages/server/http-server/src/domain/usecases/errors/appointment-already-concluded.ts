export class AppointmentIsAlreadyConcluded extends Error {
  constructor() {
    super('The Appointment is already concluded');
  }
}
