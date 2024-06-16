import { UserModel } from '../../models/user';

export interface IFindUserByCPF {
  findByCPF(cpf: string): Promise<UserModel | null>;
}
