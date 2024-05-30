import { IUpdateSettings, UpdateSettingsDTO } from "../../../../domain/use-cases/settings/UpdateSettings";
import { prismaClient } from "../../postgresDb";

export class DbUpdateSettings implements IUpdateSettings {
  async update(id: string, settingsDTO: UpdateSettingsDTO): Promise<void> {
    await prismaClient.settings.update({
      where: { id },
      data: { ...settingsDTO }
    })
  }
}
