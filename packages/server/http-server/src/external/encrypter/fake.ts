/* eslint-disable @typescript-eslint/no-unused-vars */
import { Encrypter } from '@entities/output-ports/encrypter';

//
export class FakeEncrypter implements Encrypter {
  async encrypt(toEncrypt: string): Promise<string> {
    return Promise.resolve(toEncrypt);
  }

  async compare(pass1: string, pass2: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
