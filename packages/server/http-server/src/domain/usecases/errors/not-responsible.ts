export class NotResponsible extends Error {
  constructor() {
    super("Current user is not vaccination point's responsible");
  }
}
