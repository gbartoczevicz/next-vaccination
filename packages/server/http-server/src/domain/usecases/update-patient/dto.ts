import { User } from '@entities/user';

export interface IUpdatePatientDTO {
  id: string;
  user: User;
  birthday: Date;
  document: string;
}
