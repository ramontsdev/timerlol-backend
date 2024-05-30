import { SettingsModel } from "./findSettingsById";

export type UpdateSettingsDTO = Omit<SettingsModel, 'id'>;

export interface IUpdateSettings {
  update(id: string, settingsDTO: UpdateSettingsDTO): Promise<void>;
}
