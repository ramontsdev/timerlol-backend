import { User } from '../../models/user';

export type UserDTO = Omit<User, 'id'>;

export interface ICreateUser {
  create(createUserDTO: UserDTO): Promise<User>;
}
