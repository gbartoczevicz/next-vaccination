import { AppError } from '@server/shared';

export class AccountAlreadyExists extends AppError {
  constructor(email: string) {
    super(`Account with e-mail ${email} already exists`);
  }
}
