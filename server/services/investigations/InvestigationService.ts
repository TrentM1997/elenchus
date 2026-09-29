import { IDbClient } from "../../db/access/client/dbClient.js";
import { IAuthorization } from "../auth/authorization.js";

import { IInvestigationService } from "./types.ts";
import {
  IInvestigationServiceSelectHandler,
  InvestigationServiceSelectHandler,
} from "./handlers/InvestigationServiceSelectHandler.ts";
import {
  IInvestigationServiceWriteHandler,
  InvestigationServiceWriteHandler,
} from "./handlers/InvestigationServiceWriteHandler.ts";

export class InvestionService implements IInvestigationService {
  public readonly select: IInvestigationServiceSelectHandler;
  public readonly write: IInvestigationServiceWriteHandler;
  constructor(
    private readonly db: Pick<IDbClient, "investigations">,
    private readonly policy: IAuthorization,
  ) {
    this.write = new InvestigationServiceWriteHandler(this.db, this.policy);
    this.select = new InvestigationServiceSelectHandler(this.db, this.policy);
  }
}
