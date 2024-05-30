import { IFindSettingsById, SettingsModel } from "../../../../domain/use-cases/settings/findSettingsById";
import { prismaClient } from "../../postgresDb";

export class DbFindSettingsById implements IFindSettingsById {
  async findById(id: string): Promise<SettingsModel | null> {
    return prismaClient.settings.findUnique({
      where: {
        id
      }
    })
  };
}
