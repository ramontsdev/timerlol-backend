import { SubscriptionModal } from '../../models/subscription';
import { UserModel } from '../../models/user';

export type User = UserModel & {
  subscription: SubscriptionModal | null
}
export interface IFindUserById {
  findById(id: string): Promise<User | null>;
}
