import { User } from '../../../../domain/models/user';
import { IFindUserByEmail } from '../../../../domain/use-cases/user/find-user-by-email';
import { prismaClient } from '../../postgres-db';

export class DbFindUserByEmail implements IFindUserByEmail {
  findByEmail(email: string): Promise<User | null> {
    return prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  }
}
