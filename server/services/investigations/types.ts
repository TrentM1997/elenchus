import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  InvestigationSchemaType,
  PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { DbResult } from "../../db/types/types.ts";
import { InvestigationSaveResult } from "../../db/access/repositories/investigations/investigationsRepository.ts";
import { AuthenticatedUserId } from "../auth/authorization.ts";
import { SavedExtractSchemaType } from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import { WikiResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import { IInvestigationServiceWriteHandler } from "./handlers/InvestigationServiceWriteHandler.ts";
import { IInvestigationServiceSelectHandler } from "./handlers/InvestigationServiceSelectHandler.ts";
import { NotesInputSchemaType } from "@elenchus/contracts/schemas/investigations/NoteSchema";

export type SaveSourcesAndExtractsArgs = {
  userId: AuthenticatedUserId;
  extracts: SaveInvestigationParams["extracts"];
  investigation_id: InvestigationSchemaType["id"];
  articleIds: ArticleSchemaType["id"][];
  result: Extract<InvestigationSaveResult, { ok: true }>["data"];
};

export type InvestigationExtractsToPersist =
  | Extract<WikiResponseSchemaType, { kind: "summary" }>
  | Extract<WikiResponseSchemaType, { kind: "disambiguation" }>;

export type SaveInvestigationParams = {
  user_id: string | undefined | null;
  investigation: PersistInvestigationInputSchemaType;
  articleIds: ArticleSchemaType["id"][];
  extracts: InvestigationExtractsToPersist[];
  notes?: NotesInputSchemaType;
};

export type HydrateInvestigationParams = {
  user_id: string | undefined | null;
  investigation_id: InvestigationSchemaType["id"];
};

export type HydrateInvestigationResult = {
  investigation: DbResult<InvestigationSchemaType>;
  sources: DbResult<ArticleSchemaType[]>;
  extracts: DbResult<SavedExtractSchemaType[]>;
};

export type SaveSourcesParams = {
  userId: AuthenticatedUserId;
  investigation_id: InvestigationSchemaType["id"];
  articleIds: ArticleSchemaType["id"][];
};

export interface IInvestigationService {
  readonly write: IInvestigationServiceWriteHandler;
  readonly select: IInvestigationServiceSelectHandler;
}
