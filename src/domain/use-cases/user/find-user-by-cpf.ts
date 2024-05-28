import { User } from '../../models/user';

export interface IFindUserByCPF {
  findByCPF(cpf: string): Promise<User | null>;
}
