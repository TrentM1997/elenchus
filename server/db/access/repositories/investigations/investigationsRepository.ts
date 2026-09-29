import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import {
  IInvestigationsRepositoryParser,
  InvestigationsRepositoryParser,
} from "./InvestigationsRespositoryParser.ts";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { DbResult } from "../../../types/types.ts";

import {
  IInvestigationWriteHandler,
  InvestigationWriteHandler,
} from "./InvestigationWriteHandler.ts";
import {
  IInvestigationSelectHandler,
  InvestigationSelectHandler,
} from "./InvestigationSelectHandler.ts";

export type InvestigationSaveResult = DbResult<InvestigationSchemaType>;

export type SavedInvestigationsResult = DbResult<InvestigationSchemaType[]>;

export type InsertableInvestigation =
  Database["public"]["Tables"]["investigations"]["Insert"];

export interface IInvestigationsRepository {
  readonly write: IInvestigationWriteHandler;
  readonly select: IInvestigationSelectHandler;
}

export class InvestigationsRepository implements IInvestigationsRepository {
  public readonly write: IInvestigationWriteHandler;
  private readonly parser: IInvestigationsRepositoryParser;
  public select: IInvestigationSelectHandler;
  constructor(private readonly db: SupabaseClient<Database>) {
    this.parser = new InvestigationsRepositoryParser();
    this.write = new InvestigationWriteHandler(this.db, this.parser);
    this.select = new InvestigationSelectHandler(this.db, this.parser);
  }
}
