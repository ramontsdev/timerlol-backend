export type Language = 'ptBR' | 'en';

export type SettingsModel = {
  id: string;
  enableDateHours: boolean;
  enableSoundAlert: boolean;
  enableVibration: boolean;
  enablePreparationTime: boolean;
  numberRounds: number
  restTime: number;
  roundTime: number;
  endRoundWarningTime: number;
  language: Language;
}

export interface IFindSettingsById {
  findById(userId: string): Promise<SettingsModel | null>
}
