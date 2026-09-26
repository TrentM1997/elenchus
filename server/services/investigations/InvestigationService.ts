import { IDbClient } from "../../db/access/client/dbClient.js";
import { IAuthorization } from "../auth/authorization.js";
import {
  InvestigationAndSourcesResponseSchemaType,
  InvestigationSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
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
  SaveSourcesAndExtractsArgs,
  SaveSourcesParams,
} from "./types.ts";
import {
  IInvestigationSourceHandler,
  InvestigationSourceHandler,
} from "./sources/InvestigationSourceHandler.ts";
import {
  IInvestigationExtractService,
  InvestigationExtractService,
  SaveExtractsArgs,
} from "./wikipediaExtracts/InvestigationExtractService.ts";

export class InvestionService implements IInvestigationService {
  private readonly sources: IInvestigationSourceHandler;
  private readonly extracts: IInvestigationExtractService;
  constructor(
    private readonly db: Pick<
      IDbClient,
      "investigations" | "investigationSources" | "articles" | "wikiExtracts"
    >,
    private readonly policy: IAuthorization,
  ) {
    this.sources = new InvestigationSourceHandler(this.db);
    this.extracts = new InvestigationExtractService(this.db, this.policy);
  }

  public async save(
    params: SaveInvestigationParams,
  ): Promise<InvestigationSaveResult> {
    return await this.executeSaveInvestigationAndSources(params);
  }

  public async getSavedResearch(user_id: string | undefined | null) {
    return await this.executeGetSavedResearch(user_id);
  }

  public async hydrateInvestigation(
    params: HydrateInvestigationParams,
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    const { user_id, investigation_id } = params;
    return await this.executeGetInvestigation(user_id, investigation_id);
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
      await this.saveSourcesAndExtracts({
        userId,
        result: investigationResult.data,
        articleIds: params.articleIds,
        extracts: params.extracts,
        investigation_id: investigationResult.data.id,
      });
    }
    return investigationResult;
  }

  private async saveSourcesAndExtracts(params: SaveSourcesAndExtractsArgs) {
    const { userId, investigation_id, articleIds } = params;

    const [sources, extracts] = await Promise.all([
      this.saveSources({ userId, investigation_id, articleIds }),
      this.executeSaveExtracts({
        investigation_id,
        user_id: userId,
        extracts: params.extracts,
      }),
    ]);

    return {
      sources,
      extracts,
    };
  }

  private async executeSaveExtracts(params: SaveExtractsArgs) {
    const userId = this.policy.requireAuthenticated(params.user_id);
    return await this.extracts.saveExtracts({
      user_id: userId,
      investigation_id: params.investigation_id,
      extracts: params.extracts,
    });
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
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    const userId = this.policy.requireAuthenticated(user_id);
    const [investigation, sources, extracts] = await Promise.all([
      this.db.investigations.selectById(userId, investigation_id),
      this.sources.select.byInvestigationId(userId, investigation_id),
      this.extracts.fromInvestigation({ user_id: userId, investigation_id }),
    ]);

    return { investigation, sources, extracts };
  }

  private async executeGetSavedResearch(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.getSavedInvestigations(userId);
  }
}
