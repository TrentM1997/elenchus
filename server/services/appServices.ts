import { IIntegrations, Integrations } from "../integrations/integrations";
import { IServicesAPI, ServicesAPI } from "./api/servicesApi";
import { Authorization, IAuthorization } from "./auth/authorization";

export interface IAppServices {
  readonly services: IServicesAPI;
  readonly integrations: IIntegrations;
}

export class AppServices implements IAppServices {
  public readonly services: IServicesAPI;
  public readonly integrations: IIntegrations;
  private readonly authorization: IAuthorization;
  constructor() {
    this.authorization = new Authorization();
    this.integrations = new Integrations();
    this.services = new ServicesAPI(this.authorization);
  }
}
