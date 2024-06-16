import { UserModel } from '../../models/user';

export type UserDTO = {
  id?: string;
  name: string;
  email: string;
};

export interface ICreateUser {
  create(createUserDTO: UserDTO): Promise<UserModel>;
}
