import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { IInvestigationsRepositoryParser } from "./InvestigationsRespositoryParser.ts";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { DbResult } from "../../../types/types.ts";
import { InvestigationExtractsToPersist } from "../../../../services/investigations/types.ts";
import { SelectedInvestigationPayloadSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { NotesInputSchemaType } from "@elenchus/contracts/schemas/investigations/NoteSchema";

type PersistInvestigationParams = {
  userId: AuthenticatedUserId;
  investigation: unknown;
  articleIds: ArticleSchemaType["id"][];
  extracts: InvestigationExtractsToPersist[];
  notes?: NotesInputSchemaType;
};

export interface IInvestigationWriteHandler {
  investigation({
    articleIds,
    investigation,
    userId,
    extracts,
    notes,
  }: PersistInvestigationParams): Promise<
    DbResult<SelectedInvestigationPayloadSchemaType>
  >;
}

export class InvestigationWriteHandler implements IInvestigationWriteHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IInvestigationsRepositoryParser,
  ) {}

  public async investigation({
    articleIds,
    investigation,
    userId,
    extracts,
    notes,
  }: PersistInvestigationParams): Promise<
    DbResult<SelectedInvestigationPayloadSchemaType>
  > {
    return await this.execute({
      articleIds,
      investigation,
      userId,
      extracts,
      notes,
    });
  }

  private async execute(
    params: PersistInvestigationParams,
  ): Promise<DbResult<SelectedInvestigationPayloadSchemaType>> {
    const { data, error } = await this.db.rpc(
      "save_complete_investigation",
      this.getInsertPayload(params),
    );

    if (error) {
      console.error(error.message, error.details, error.cause);
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    if (data === null) {
      return {
        ok: false,
        message: "Investigation was not selected",
        details:
          "This investigation is either missing or owned by another user",
      };
    }

    return {
      ok: true,
      data: this.parser.validateSelectedInvestigation(data),
    };
  }

  private getInsertPayload({
    articleIds,
    investigation,
    userId,
    extracts,
    notes,
  }: PersistInvestigationParams) {
    const validInvestigation =
      this.parser.validateInvestigationInput(investigation);

    if (notes) {
      return {
        p_user_id: userId,
        p_investigation: validInvestigation,
        p_article_ids: articleIds,
        p_extracts: extracts ?? [],
        p_notes: this.parser.validateNotesInput(notes),
      };
    } else {
      return {
        p_user_id: userId,
        p_investigation: validInvestigation,
        p_article_ids: articleIds,
        p_extracts: extracts ?? [],
        p_notes: [],
      };
    }
  }
}
