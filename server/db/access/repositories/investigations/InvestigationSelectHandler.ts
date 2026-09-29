import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { IInvestigationsRepositoryParser } from "./InvestigationsRespositoryParser.ts";
import { IInvestigationSourcesRepository } from "../investigationSources/investigationSourcesRepository.js";
import { IWikipediaExtractsRepository } from "../wikipediaExtracts/wikipediaExtractsRepository.js";
import { AuthenticatedUserId } from "../../../../services/auth/authorization.ts";
import { SavedInvestigationsResult } from "./investigationsRepository.ts";
import {
  InvestigationAndSourcesResponseSchemaType,
  InvestigationSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { DbResult } from "../../../types/types.ts";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import { SavedExtractSchemaType } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import { IArticlesRepository } from "../articles/articlesRepository.ts";

export interface IInvestigationSelectHandler {
  all(user_id: AuthenticatedUserId): Promise<SavedInvestigationsResult>;
  bId(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationAndSourcesResponseSchemaType>;
}

export class InvestigationSelectHandler implements IInvestigationSelectHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IInvestigationsRepositoryParser,
    private readonly sources: IInvestigationSourcesRepository,
    private readonly extracts: IWikipediaExtractsRepository,
    private readonly articles: IArticlesRepository,
  ) {}

  public async all(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    return await this.executeGetSavedInvestigations(user_id);
  }

  public async bId(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    return await this.executeById(user_id, investigation_id);
  }

  private async executeById(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    const [investigation, sources, extracts] = await Promise.all([
      this.investigationById(user_id, investigation_id),
      this.sourcesOfInvestigation(user_id, investigation_id),
      this.extractsByInvestigationId(user_id, investigation_id),
    ]);

    if (investigation.ok === false) {
      return {
        ok: false,
        message: investigation.message,
        details: investigation.details,
      };
    }

    if (sources.ok === false) {
      return {
        ok: false,
        message: sources.message,
        details: sources.details,
      };
    }

    if (extracts.ok === false) {
      return {
        ok: false,
        message: extracts.message,
        details: extracts.details,
      };
    }

    return {
      ok: true,
      data: {
        investigation: investigation.data,
        extracts: extracts.data,
        sources: sources.data,
      },
    };
  }

  private async investigationById(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationSchemaType>> {
    const { data, error } = await this.db
      .from("investigations")
      .select()
      .eq("user_id", user_id)
      .eq("id", investigation_id)
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    if (data === null) {
      return {
        ok: false,
        message: "Investigation not found",
      };
    }

    return {
      ok: true,
      data: this.parser.validateInvestigation(data),
    };
  }

  private async sourcesOfInvestigation(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<ArticleSchemaType[]>> {
    const sources = await this.sources.select.byInvestigationId(
      user_id,
      investigation_id,
    );
    if (!sources.ok) {
      return {
        ok: false,
        message: sources.message,
        details: sources.details,
      };
    }

    const ids = sources.data.map((source) => source.article_id);

    return await this.articles.byIds(ids);
  }

  private async extractsByInvestigationId(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<SavedExtractSchemaType[]>> {
    return await this.extracts.select.extracts(user_id, investigation_id);
  }

  private async executeGetSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    const { data, error } = await this.db
      .from("investigations")
      .select()
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.parser.validateInvestigations(data),
    };
  }
}
