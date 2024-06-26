import { SubscriptionModal } from '../../../../domain/models/subscription';
import { UserModel } from '../../../../domain/models/user';
import { IFindUserById } from '../../../../domain/use-cases/user/find-user-by-id';
import { prismaClient } from '../../postgresDb';

export type User = UserModel & {
  subscription: SubscriptionModal | null
};
export class DbFindUserById implements IFindUserById {
  findById(id: string): Promise<User | null> {
    return prismaClient.user.findUnique({
      where: { id },
      include: { subscription: true },
    });
  }
}
