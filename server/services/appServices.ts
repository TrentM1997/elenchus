import { IServicesAPI, ServicesAPI } from "./api/servicesApi";
import { Authorization, IAuthorization } from "./auth/authorization";

export interface IAppServices {
  readonly services: IServicesAPI;
}

export class AppServices {
  public readonly services: IServicesAPI;
  private readonly authorization: IAuthorization;
  constructor() {
    this.authorization = new Authorization();
    this.services = new ServicesAPI(this.authorization);
  }
}
