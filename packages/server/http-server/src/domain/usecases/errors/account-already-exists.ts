import { Result, UseCaseError } from '@server/shared';

export class AccountAlreadyExists extends Result<UseCaseError> {
  constructor(email: string) {
    super(false, `E-mail address ${email} is already in use`);
  }
}
