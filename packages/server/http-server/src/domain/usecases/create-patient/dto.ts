import { User } from '@entities/user';

export interface ICreatePatientDTO {
  birthday: Date;
  user: User;
  document: string;
  avatar: string;
}
