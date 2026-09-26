import {
  CandidateRowsSchema,
  ValidatedCandidateRow,
} from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import type {
  InvestigationExtractRow,
  SavedExtractArraySchemaType,
  SavedExtractSchemaType,
} from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import {
  InvestigationExtractRowSchema,
  SavedExtractArraySchema,
} from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import {
  CandidatesByExtract,
  ExtractsSelected,
  InsertableExtracts,
  SaveExtractParams,
} from "./types.js";
import { validateServerOrThrow } from "../../../../core/validation/validateOrThrow.ts";

export interface IWikipediaExtractsParser {
  toInsertableExtract(params: SaveExtractParams): InsertableExtracts;
  validateExtract(result: unknown): InvestigationExtractRow;
  validateCandidateRows(result: unknown): ValidatedCandidateRow;
  validateSavedExtracts(result: unknown): SavedExtractArraySchemaType;
  mapExtractResults(params: {
    extractsResult: ExtractsSelected;
    candidatesByExtract: CandidatesByExtract;
  }): SavedExtractSchemaType[];
}

export class WikipediaExtractsParser implements IWikipediaExtractsParser {
  public toInsertableExtract(params: SaveExtractParams): InsertableExtracts {
    const { userId, investigation_id, extract } = params;

    return {
      investigation_id,
      user_id: userId,
      kind: extract.kind,
      title: extract.title,
      page_url: extract.pageUrl,
      last_updated: extract.lastUpdated,

      extract: extract.kind === "summary" ? extract.extract : null,
      description: extract.kind === "summary" ? extract.description : null,
      thumbnail: extract.kind === "summary" ? extract.thumbnail : null,
    };
  }

  public validateExtract(result: unknown): InvestigationExtractRow {
    return validateServerOrThrow(InvestigationExtractRowSchema, result);
  }

  public validateCandidateRows(result: unknown): ValidatedCandidateRow {
    return validateServerOrThrow(CandidateRowsSchema, result);
  }

  public validateSavedExtracts(result: unknown): SavedExtractArraySchemaType {
    return validateServerOrThrow(SavedExtractArraySchema, result);
  }

  public mapExtractResults(params: {
    extractsResult: ExtractsSelected;
    candidatesByExtract: CandidatesByExtract;
  }): SavedExtractSchemaType[] {
    const { extractsResult, candidatesByExtract } = params;

    const extracts = extractsResult.data.map((row): SavedExtractSchemaType => {
      const common = {
        id: row.id,
        user_id: row.user_id,
        investigation_id: row.investigation_id,
        title: row.title,
        pageUrl: row.page_url,
        lastUpdated: row.last_updated,
      };

      if (row.kind === "summary") {
        return {
          ...common,
          kind: "summary",
          extract: row.extract,
          description: row.description,
          thumbnail: row.thumbnail,
        };
      }

      return {
        ...common,
        kind: "disambiguation",
        candidates: (candidatesByExtract.get(row.id) ?? []).map(
          (candidate) => ({
            title: candidate.title,
            extract: candidate.extract,
            thumbnail: candidate.thumbnail,
            pageid: candidate.page_id,
            url: candidate.url,
            lastUpdated: candidate.last_updated,
          }),
        ),
      };
    });

    return extracts;
  }
}
