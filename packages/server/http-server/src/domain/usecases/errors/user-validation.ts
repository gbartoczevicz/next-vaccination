import { Result, UseCaseError } from '@server/shared';

export class UserValidation extends Result<UseCaseError> {
  constructor(error: string) {
    super(false, `User validation failed: ${error}`);
  }
}
