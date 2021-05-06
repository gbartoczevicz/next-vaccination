export interface Encrypter {
  encrypt(toEncrypt: string): Promise<string>;

  compare(pass1: string, pass2: string): Promise<boolean>;
}
