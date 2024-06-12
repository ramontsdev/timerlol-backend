import { UserModel } from '../../../../domain/models/user';
import { ICreateUser, UserDTO } from '../../../../domain/use-cases/user/create-user';
import { prismaClient } from '../../postgresDb';

export class DbCreateUser implements ICreateUser {
  async create(userDTO: UserDTO): Promise<UserModel> {

    return prismaClient.user.create({
      data: {
        ...userDTO,
        settings: {
          create: {
            enableDateHours: true,
            enablePreparationTime: false,
            enableSoundAlert: true,
            enableVibration: true,
            language: 'en',
          }
        }
      },
    });
  }
}
