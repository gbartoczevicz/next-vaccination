import { Encrypter } from '@entities/output-ports/encrypter';

export class FakeEncrypter implements Encrypter {
  async encrypt(toEncrypt: string): Promise<string> {
    return Promise.resolve(toEncrypt);
  }
}
