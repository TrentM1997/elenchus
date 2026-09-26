import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { DbResult } from "../../../../db/types/types.ts";
import { IDbClient } from "../../../../db/access/client/dbClient.ts";
import { AuthenticatedUserId } from "../../../auth/authorization.ts";

export interface IInvestigationSourceSelectHandler {
  byInvestigationId(
    userId: AuthenticatedUserId,
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>>;
}

export class InvestigationSourceSelectHandler implements IInvestigationSourceSelectHandler {
  constructor(
    private readonly db: Pick<IDbClient, "investigationSources" | "articles">,
  ) {}

  public async byInvestigationId(
    userId: AuthenticatedUserId,
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    return await this.executeGetSources(userId, id);
  }

  private async executeGetSources(
    userId: AuthenticatedUserId,
    id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    const sources = await this.db.investigationSources.select.byInvestigationId(
      userId,
      id,
    );
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
