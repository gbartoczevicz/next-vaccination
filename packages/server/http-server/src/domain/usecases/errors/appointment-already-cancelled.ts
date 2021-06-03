export class AppointmentIsAlreadyCancelled extends Error {
  constructor() {
    super('The Appointment is already cancelled');
  }
}
