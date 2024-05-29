import { User } from '../../../../domain/models/user';
import { ICreateUser, UserDTO } from '../../../../domain/use-cases/user/create-user';
import { prismaClient } from '../../postgresDb';

export class DbCreateUser implements ICreateUser {
  async create(userDTO: UserDTO): Promise<User> {

    return prismaClient.user.create({
      data: {
        ...userDTO,
      },
    });
  }
}
