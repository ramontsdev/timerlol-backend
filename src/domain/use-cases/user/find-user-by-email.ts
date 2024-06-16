import { UserModel } from '../../models/user';

export interface IFindUserByEmail {
  findByEmail(email: string): Promise<UserModel | null>;
}
