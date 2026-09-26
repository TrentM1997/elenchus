import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import {
  ValidatedCandidateRow,
  WikiResponseSchemaType,
} from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import { AuthenticatedUserId } from "../../../../services/auth/authorization.ts";
import { Database } from "../../../../types/databaseInterfaces.ts";
import { InvestigationExtractRow } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import { DbResult } from "../../../types/types.ts";
import { InvestigationExtractsToPersist } from "../../../../services/investigations/types.ts";

export type InsertableExtracts =
  Database["public"]["Tables"]["investigation_extracts"]["Insert"];

export type InsertableCandidate =
  Database["public"]["Tables"]["investigation_extract_candidates"]["Insert"];

export type SaveExtractParams = {
  userId: AuthenticatedUserId;
  investigation_id: InvestigationSchemaType["id"];
  extract: InvestigationExtractsToPersist;
};

export type SaveExtractsParams = Omit<SaveExtractParams, "extract"> & {
  extracts: SaveExtractParams["extract"][];
};

export type SaveSummaryParams = {
  userId: AuthenticatedUserId;
  investigation_id: InvestigationSchemaType["id"];
  extract: Extract<WikiResponseSchemaType, { kind: "summary" }>;
};

export type CandidatesByExtract = Map<string, ValidatedCandidateRow>;
export type SelectExtractsResult = DbResult<InvestigationExtractRow[]>;
export type ExtractsSelected = Extract<SelectExtractsResult, { ok: true }>;
