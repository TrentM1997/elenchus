import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { DbResult } from "../../../db/types/types.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export interface IInvestigationSourceSelectHandler {
  byInvestigationId(
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>>;
}

export class InvestigationSourceSelectHandler implements IInvestigationSourceSelectHandler {
  constructor(
    private readonly db: Pick<IDbClient, "investigationSources" | "articles">,
  ) {}

  public async byInvestigationId(
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.executeGetSources(id);
  }

  private async executeGetSources(
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    const sources =
      await this.db.investigationSources.select.byInvestigationId(id);
    if (!sources.ok) {
      throw new Error("Failed to fetch sources by investigation id");
    }
    const ids = sources.data.map((source) => source.article_id);
    return await this.hydrateSourcesById(ids);
  }

  private async hydrateSourcesById(
    ids: ArticleSchemaType["id"][],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.db.articles.byIds(ids);
  }
}
