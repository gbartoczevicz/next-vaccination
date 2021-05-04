import { Encrypter } from '@entities/output-ports/encrypter';

export class FakeEncrypter implements Encrypter {
  encrypt(toEncrypt: string): string {
    return toEncrypt;
  }
}
