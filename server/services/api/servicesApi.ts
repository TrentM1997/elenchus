import { db } from "../../db/db";
import { Domains, IDomains } from "./domains";
import { DbClient, IDbClient } from "../../db/access/client/dbClient";
import { IAuthorization } from "../auth/authorization";

export interface IServicesAPI {
  readonly api: IDomains;
}

export class ServicesAPI implements IServicesAPI {
  public readonly api: IDomains;
  private readonly db: IDbClient;
  constructor(private readonly authorization: IAuthorization) {
    this.db = new DbClient(db);
    this.api = new Domains(this.db, this.authorization);
  }
}
