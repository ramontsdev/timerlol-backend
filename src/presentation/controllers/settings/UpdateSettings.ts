import { IUpdateSettings } from "../../../domain/use-cases/settings/UpdateSettings";
import { DbUpdateSettings } from "../../../infra/database/repositories/settings/DbUpdateSettings";
import { badRequest, ok, serverError } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class UpdateSettingsController implements IController {
  constructor(private readonly updateSettings: IUpdateSettings) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'enableDateHours',
        'enableSoundAlert',
        'enableVibration',
        'enablePreparationTime',
        'numberRounds',
        'restTime',
        'roundTime',
        'endRoundWarningTime',
        'language'
      ];
      for await (const field of requiredFields)
        if (!httpRequest.body[field]) return badRequest({ error: `${field} is required.` });

      const { settingsId } = httpRequest.params;
      const {
        enableDateHours,
        enableSoundAlert,
        enableVibration,
        enablePreparationTime,
        numberRounds,
        restTime,
        roundTime,
        endRoundWarningTime,
        language
      } = httpRequest.body

      await this.updateSettings.update(settingsId, {
        enableDateHours,
        enableSoundAlert,
        enableVibration,
        enablePreparationTime,
        numberRounds,
        restTime,
        roundTime,
        endRoundWarningTime,
        language
      })

      return ok();
    } catch (err) {
      const error = err as Error;
      console.log(error.message)

      return serverError();
    };
  }
}

export const dbUpdateSettings = new DbUpdateSettings();
export const updateSettingsController = new UpdateSettingsController(dbUpdateSettings);
