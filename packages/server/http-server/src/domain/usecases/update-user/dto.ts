export interface IUpdateUserDTO {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  currentPassword: string;
}
