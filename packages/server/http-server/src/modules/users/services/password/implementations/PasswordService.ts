import { hash } from 'bcrypt';

import { IPasswordService } from '../IPasswordService';

export class PasswordService implements IPasswordService {
  public encrypt(password: string): Promise<string> {
    return hash(password, 8);
  }
}
