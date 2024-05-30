import { IFindSettingsById } from "../../../domain/use-cases/settings/findSettingsById";
import { DbFindSettingsById } from "../../../infra/database/repositories/settings/DbFindSettingsById";
import { ok, serverError } from "../../helpers/httpHelpers";
import { IController } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

class GetSettingsController implements IController {
  constructor(private readonly findSettingsByUserId: IFindSettingsById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {

    try {
      const settings = await this.findSettingsByUserId.findById(httpRequest.params.settingsId)

      return ok(settings);
    } catch (error) {
      const err = error as Error;
      console.log(err.message)
      return serverError();
    }
  }
}

export const findSettingsById = new DbFindSettingsById()
export const getSettingsController = new GetSettingsController(findSettingsById);
