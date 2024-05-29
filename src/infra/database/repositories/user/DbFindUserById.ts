import { User } from '../../../../domain/models/user';
import { IFindUserById } from '../../../../domain/use-cases/user/find-user-by-id';
import { prismaClient } from '../../postgresDb';

export class DbFindUserById implements IFindUserById {
  findById(id: string): Promise<User | null> {
    return prismaClient.user.findUnique({
      where: { id },
    });
  }
}
