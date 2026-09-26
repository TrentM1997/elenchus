import { IDbClient } from "../../../db/access/client/dbClient.ts";
import {
  IInvestigationSourceSelectHandler,
  InvestigationSourceSelectHandler,
} from "./InvestigateSourceSelectHandler.ts";
import {
  IInvestigationSourceWriteHandler,
  InvestigationSourceWriteHandler,
} from "./InvestigationSourceWriteHandler.ts";

export interface IInvestigationSourceHandler {
  readonly select: IInvestigationSourceSelectHandler;
  readonly write: IInvestigationSourceWriteHandler;
}

export class InvestigationSourceHandler implements IInvestigationSourceHandler {
  public readonly select: IInvestigationSourceSelectHandler;
  public readonly write: IInvestigationSourceWriteHandler;
  constructor(
    private readonly db: Pick<IDbClient, "investigationSources" | "articles">,
  ) {
    this.select = new InvestigationSourceSelectHandler(this.db);
    this.write = new InvestigationSourceWriteHandler(this.db);
  }
}
