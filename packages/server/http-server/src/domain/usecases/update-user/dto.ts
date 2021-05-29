import { User } from '@entities/user';

export interface IUpdateUserDTO {
  user: User;
  name: string;
  email: string;
  phone: string;
  password: string;
  currentPassword: string;
}
