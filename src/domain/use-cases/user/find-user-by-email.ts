import { User } from '../../models/user';

export interface IFindUserByEmail {
  findByEmail(email: string): Promise<User | null>;
}
