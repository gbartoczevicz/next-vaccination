export class TicketIsRequired extends Error {
  constructor() {
    super('Ticket is required');
  }
}
