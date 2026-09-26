import { InvestigationSourceSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSourceSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { DbResult } from "../../../db/types/types.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";

export interface IInvestigationSourceWriteHandler {
  saveSources(
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>>;
}

export class InvestigationSourceWriteHandler implements IInvestigationSourceWriteHandler {
  constructor(private readonly db: Pick<IDbClient, "investigationSources">) {}

  public async saveSources(
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    return await this.executeSaveSources(rawArticleIds, investigation_id);
  }

  private async executeSaveSources(
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSourceSchemaType[]>> {
    const sources = this.toInsertableSources(rawArticleIds, investigation_id);
    return await this.db.investigationSources.write.saveInvestigationSources(
      sources,
    );
  }

  private toInsertableSources(
    rawArticleIds: ArticleSchemaType["id"][],
    investigation_id: InvestigationSchemaType["id"],
  ): Pick<InvestigationSourceSchemaType, "article_id" | "investigation_id">[] {
    return rawArticleIds.map((articleId) => {
      return { article_id: articleId, investigation_id: investigation_id };
    });
  }
}
