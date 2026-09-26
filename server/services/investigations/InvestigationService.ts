import { IDbClient } from "../../db/access/client/dbClient.js";
import { AuthenticatedUserId, IAuthorization } from "../auth/authorization.js";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import {
  InvestigationSaveResult,
  SavedInvestigationsResult,
} from "../../db/access/repositories/investigations/investigationsRepository.js";
import { DbResult } from "../../db/types/types.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  HydrateInvestigationParams,
  HydrateInvestigationResult,
  IInvestigationService,
  SaveInvestigationParams,
  SaveSourcesParams,
} from "./types.ts";
import {
  IInvestigationSourceHandler,
  InvestigationSourceHandler,
} from "./sources/InvestigationSourceHandler.ts";

export class InvestionService implements IInvestigationService {
  private readonly sources: IInvestigationSourceHandler;
  constructor(
    private readonly db: Pick<
      IDbClient,
      "investigations" | "investigationSources" | "articles"
    >,
    private readonly policy: IAuthorization,
  ) {
    this.sources = new InvestigationSourceHandler(this.db);
  }

  public async save(
    params: SaveInvestigationParams,
  ): Promise<InvestigationSaveResult> {
    return await this.executeSaveInvestigationAndSources(params);
  }

  private async executeSaveInvestigationAndSources(
    params: SaveInvestigationParams,
  ): Promise<InvestigationSaveResult> {
    const userId = this.policy.requireAuthenticated(params.user_id);
    const investigationResult = await this.db.investigations.save(
      params.investigation,
      userId,
    );
    if (investigationResult.ok) {
      const articleIds = params.articleIds;
      const investigation_id = investigationResult.data.id;
      await this.saveSources({ userId, investigation_id, articleIds });
    }
    return investigationResult;
  }

  public async getSavedResearch(user_id: string | undefined | null) {
    return await this.executeGetSavedResearch(user_id);
  }

  public async hydrateInvestigation(
    params: HydrateInvestigationParams,
  ): Promise<HydrateInvestigationResult> {
    const { user_id, investigation_id } = params;
    return await this.executeGetInvestigation(user_id, investigation_id);
  }

  private async saveSources(params: SaveSourcesParams) {
    const sourceResult = await this.sources.write.saveSources(
      params.userId,
      params.articleIds,
      params.investigation_id,
    );
    if (sourceResult.ok === false) {
      console.error(sourceResult.message);
    }
  }

  private async executeGetInvestigation(
    user_id: string | undefined | null,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<HydrateInvestigationResult> {
    const userId = this.policy.requireAuthenticated(user_id);
    const [investigation, sources] = await Promise.all([
      this.db.investigations.selectById(userId, investigation_id),
      this.sources.select.byInvestigationId(userId, investigation_id),
    ]);

    return { investigation, sources };
  }

  private async executeGetSavedResearch(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.getSavedInvestigations(userId);
  }
}
