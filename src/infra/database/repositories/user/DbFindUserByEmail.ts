import { UserModel } from '../../../../domain/models/user';
import { IFindUserByEmail } from '../../../../domain/use-cases/user/find-user-by-email';
import { prismaClient } from '../../postgresDb';

export class DbFindUserByEmail implements IFindUserByEmail {
  findByEmail(email: string): Promise<UserModel | null> {
    return prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }
}
