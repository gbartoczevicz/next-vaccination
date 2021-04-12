export interface IPasswordService {
  encrypt(password: string): Promise<string>;
}
