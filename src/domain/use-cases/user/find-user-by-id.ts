import { User } from '../../models/user';

export interface IFindUserById {
  findById(id: string): Promise<User | null>;
}
