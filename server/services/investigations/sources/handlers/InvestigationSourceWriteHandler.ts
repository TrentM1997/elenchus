import { InvestigationSourceSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSourceSchema";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { Database } from "../../../../types/databaseInterfaces.ts";
import { AuthenticatedUserId } from "../../../auth/authorization.ts";
import { DbResult } from "../../../../db/types/types.ts";
import { IDbClient } from "../../../../db/access/client/dbClient.ts";
import { InsertableInvestigationSources } from "../../../../db/access/repositories/investigationSources/investigationSourcesRepository.ts";

export interface IInvestigationSourceWriteHandler {
  saveSources(
    userId: AuthenticatedUserId,
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>>;
}

export class InvestigationSourceWriteHandler implements IInvestigationSourceWriteHandler {
  constructor(private readonly db: Pick<IDbClient, "investigationSources">) {}

  public async saveSources(
    userId: AuthenticatedUserId,
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    return await this.executeSaveSources(
      userId,
      rawArticleIds,
      investigation_id,
    );
  }

  private async executeSaveSources(
    userId: AuthenticatedUserId,
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    const sources = this.toInsertableSources(
      userId,
      rawArticleIds,
      investigation_id,
    );
    return await this.db.investigationSources.write.saveInvestigationSources(
      sources,
    );
  }

  private toInsertableSources(
    userId: AuthenticatedUserId,
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): InsertableInvestigationSources {
    return rawArticleIds.map((articleId) => {
      return {
        article_id: articleId,
        investigation_id: investigation_id,
        user_id: userId,
      };
    });
  }
}
