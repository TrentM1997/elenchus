import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { IWikipediaExtractsParser } from "./wikipediaExtractsParser.js";
import { AuthenticatedUserId } from "../../../../services/auth/authorization.js";
import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { DbResult } from "../../../types/types.ts";
import {
  InvestigationExtractRow,
  SavedExtractSchemaType,
} from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import { ValidatedCandidateRow } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

export interface IWikipediaExtractsSelector {
  extracts(
    userId: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<SavedExtractSchemaType[]>>;
}

export class WikipediaExtractsSelector implements IWikipediaExtractsSelector {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IWikipediaExtractsParser,
  ) {}

  public async extracts(
    userId: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<SavedExtractSchemaType[]>> {
    return this.execute(userId, investigation_id);
  }

  public async execute(
    userId: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<SavedExtractSchemaType[]>> {
    const extractsResult = await this.getExtracts(userId, investigation_id);

    if (!extractsResult.ok) {
      return extractsResult;
    }

    const disambiguationIds = extractsResult.data
      .filter((extract) => extract.kind === "disambiguation")
      .map((extract) => extract.id);

    let candidates: ValidatedCandidateRow = [];

    if (disambiguationIds.length > 0) {
      const candidatesResult = await this.getCandidates(disambiguationIds);

      if (!candidatesResult.ok) {
        return candidatesResult;
      }

      candidates = candidatesResult.data;
    }

    const candidatesByExtract = this.mapCandidatesByExtract(candidates);

    const extracts = this.parser.mapExtractResults({
      extractsResult,
      candidatesByExtract,
    });

    return {
      ok: true,
      data: this.parser.validateSavedExtracts(extracts),
    };
  }

  private async getExtracts(
    userId: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<DbResult<InvestigationExtractRow[]>> {
    const { data, error } = await this.db
      .from("investigation_extracts")
      .select()
      .eq("user_id", userId)
      .eq("investigation_id", investigation_id);

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: data.map((row) => this.parser.validateExtract(row)),
    };
  }

  private async getCandidates(extractIds: string[]) {
    const { data, error } = await this.db
      .from("investigation_extract_candidates")
      .select()
      .in("extract_id", extractIds)
      .order("position", { ascending: true });

    if (error) {
      return {
        ok: false as const,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true as const,
      data: this.parser.validateCandidateRows(data),
    };
  }

  private mapCandidatesByExtract(candidates: ValidatedCandidateRow) {
    const candidatesByExtract = new Map<string, ValidatedCandidateRow>();

    for (const candidate of candidates) {
      const group = candidatesByExtract.get(candidate.extract_id);

      if (group) {
        group.push(candidate);
      } else {
        candidatesByExtract.set(candidate.extract_id, [candidate]);
      }
    }
    return candidatesByExtract;
  }
}
