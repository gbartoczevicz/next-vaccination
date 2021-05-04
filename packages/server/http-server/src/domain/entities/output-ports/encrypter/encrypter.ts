export interface Encrypter {
  encrypt(toEncrypt: string): Promise<string>;
}
