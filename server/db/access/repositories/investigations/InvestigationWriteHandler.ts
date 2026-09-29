import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { IInvestigationsRepositoryParser } from "./InvestigationsRespositoryParser.ts";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { DbResult } from "../../../types/types.ts";
import { InvestigationExtractsToPersist } from "../../../../services/investigations/types.ts";
import { SelectedInvestigationPayloadSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

type PersistInvestigationParams = {
  userId: AuthenticatedUserId;
  investigation: unknown;
  articleIds: ArticleSchemaType["id"][];
  extracts: InvestigationExtractsToPersist[];
};

export interface IInvestigationWriteHandler {
  investigation({
    articleIds,
    investigation,
    userId,
    extracts,
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
  }: PersistInvestigationParams): Promise<
    DbResult<SelectedInvestigationPayloadSchemaType>
  > {
    return await this.execute({ articleIds, investigation, userId, extracts });
  }

  private async execute({
    articleIds,
    investigation,
    userId,
    extracts,
  }: PersistInvestigationParams): Promise<
    DbResult<SelectedInvestigationPayloadSchemaType>
  > {
    const validatedInvestigation =
      this.parser.validateInvestigationInput(investigation);

    const { data, error } = await this.db.rpc("save_complete_investigation", {
      p_user_id: userId,
      p_investigation: validatedInvestigation,
      p_article_ids: articleIds,
      p_extracts: extracts ?? [],
    });

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
}
