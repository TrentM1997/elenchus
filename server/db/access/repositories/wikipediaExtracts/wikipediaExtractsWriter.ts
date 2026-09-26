import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { DbResult } from "../../../types/types.ts";
import {
  type WikiDisambigResponseSchemaType,
  ValidatedCandidateRow,
} from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import { IWikipediaExtractsParser } from "./wikipediaExtractsParser.ts";
import type { InsertableCandidate, SaveExtractParams, SaveExtractsParams } from "./types.js";
import { InvestigationExtractRow } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";

export interface IWikipediaExtractsWriter {
  extracts(
    params: SaveExtractsParams,
  ): Promise<DbResult<InvestigationExtractRow[]>>;
}

export class WikipediaExtractsWriter implements IWikipediaExtractsWriter {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IWikipediaExtractsParser,
  ) {}

  public async extracts(
    params: SaveExtractsParams,
  ): Promise<DbResult<InvestigationExtractRow[]>> {
    const rows: InvestigationExtractRow[] = [];
    for (const extract of params.extracts) {
      const result = await this.saveExtract({
        userId: params.userId,
        investigation_id: params.investigation_id,
        extract,
      });
      if (!result.ok) return result;
      rows.push(result.data);
    }
    return { ok: true, data: rows };
  }

  private async saveExtract(
    params: SaveExtractParams,
  ): Promise<DbResult<InvestigationExtractRow>> {
    const payload = this.parser.toInsertableExtract(params);

    const { data, error } = await this.db
      .from("investigation_extracts")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    const validated = this.parser.validateExtract(data);

    if (params.extract.kind === "disambiguation") {
      const candidatesResult = await this.saveCandidates(
        validated.id,
        params.extract.candidates,
      );

      if (candidatesResult.ok === false) {
        return candidatesResult;
      }
    }

    return { ok: true, data: validated };
  }

  private async saveCandidates(
    extractId: string,
    candidates: WikiDisambigResponseSchemaType["candidates"],
  ): Promise<DbResult<ValidatedCandidateRow>> {
    if (candidates.length === 0) {
      return { ok: true, data: [] };
    }

    const payload: InsertableCandidate[] = candidates.map(
      (candidate, position) => ({
        extract_id: extractId,
        page_id: candidate.pageid,
        title: candidate.title,
        extract: candidate.extract,
        url: candidate.url,
        thumbnail: candidate.thumbnail,
        last_updated: candidate.lastUpdated,
        position,
      }),
    );

    const { data, error } = await this.db
      .from("investigation_extract_candidates")
      .insert(payload)
      .select();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return { ok: true, data: this.parser.validateCandidateRows(data) };
  }
}
