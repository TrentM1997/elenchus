import { IDbClient } from "../../db/access/client/dbClient.js";
import { IAuthorization } from "../auth/authorization.js";
import {
  InvestigationSchemaType,
  InvestigationsSavedReponseSchemaType,
  PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import {
  InvestigationSaveResult,
  SavedInvestigationsResult,
} from "../../db/access/repositories/investigations/investigationsRepository.js";
import { DbResult } from "../../db/types/types.ts";
import {
  IInvestigationSourceHandler,
  InvestigationSourceHandler,
} from "./handlers/InvestigationSourceHandler.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export interface IInvestigationService {
  save(params: {
    user_id: string | undefined | null;
    investigation: PersistInvestigationInputSchemaType;
    articleIds: ArticleSchemaType["id"][];
  }): Promise<InvestigationSaveResult>;

  getSavedResearch(
    user_id: string | undefined | null,
  ): Promise<InvestigationsSavedReponseSchemaType>;
  hydrateInvestigation(params: {
    user_id: string | undefined | null;
    investigation_id: InvestigationSchemaType["id"];
  }): Promise<{
    investigation: DbResult<InvestigationSchemaType>;
    sources: DbResult<ArticleSchemaType[]>;
  }>;
}

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

  public async save(params: {
    user_id: string | undefined | null;
    investigation: PersistInvestigationInputSchemaType;
    articleIds: ArticleSchemaType["id"][];
  }): Promise<InvestigationSaveResult> {
    return await this.executeSaveInvestigationAndSources(params);
  }

  private async executeSaveInvestigationAndSources(params: {
    user_id: string | undefined | null;
    investigation: PersistInvestigationInputSchemaType;
    articleIds: ArticleSchemaType["id"][];
  }): Promise<InvestigationSaveResult> {
    const userId = this.policy.requireAuthenticated(params.user_id);

    const investigationResult = await this.db.investigations.save(
      params.investigation,
      userId,
    );
    if (investigationResult.ok) {
      await this.saveSources(investigationResult, params.articleIds);
    }
    return investigationResult;
  }

  public async getSavedResearch(user_id: string | undefined | null) {
    return await this.executeGetSavedResearch(user_id);
  }

  public async hydrateInvestigation(params: {
    user_id: string | undefined | null;
    investigation_id: InvestigationSchemaType["id"];
  }): Promise<{
    investigation: DbResult<InvestigationSchemaType>;
    sources: DbResult<ArticleSchemaType[]>;
  }> {
    const { user_id, investigation_id } = params;
    return await this.executeGetInvestigation(user_id, investigation_id);
  }

  private async saveSources(
    result: Extract<InvestigationSaveResult, { ok: true }>,
    articleIds: ArticleSchemaType["id"][],
  ) {
    const sourceResult = await this.sources.write.saveSources(
      articleIds,
      result.data.id,
    );
    if (sourceResult.ok === false) {
      console.error(sourceResult.message);
    }
  }

  private async executeGetInvestigation(
    user_id: string | undefined | null,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<{
    investigation: DbResult<InvestigationSchemaType>;
    sources: DbResult<ArticleSchemaType[]>;
  }> {
    const userId = this.policy.requireAuthenticated(user_id);
    const [investigation, sources] = await Promise.all([
      this.db.investigations.selectById(userId, investigation_id),
      this.sources.select.byInvestigationId(investigation_id),
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
