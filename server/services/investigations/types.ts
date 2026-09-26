import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import {
  InvestigationSchemaType,
  InvestigationsSavedReponseSchemaType,
  PersistInvestigationInputSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { DbResult } from "../../db/types/types.ts";
import { InvestigationSaveResult } from "../../db/access/repositories/investigations/investigationsRepository.ts";
import { AuthenticatedUserId } from "../auth/authorization.ts";

export type SaveInvestigationParams = {
  user_id: string | undefined | null;
  investigation: PersistInvestigationInputSchemaType;
  articleIds: ArticleSchemaType["id"][];
};

export type HydrateInvestigationParams = {
  user_id: string | undefined | null;
  investigation_id: InvestigationSchemaType["id"];
};

export type HydrateInvestigationResult = {
  investigation: DbResult<InvestigationSchemaType>;
  sources: DbResult<ArticleSchemaType[]>;
};

export type SaveSourcesParams = {
  userId: AuthenticatedUserId;
  investigation_id: InvestigationSchemaType["id"];
  articleIds: ArticleSchemaType["id"][];
};

export interface IInvestigationService {
  save(params: SaveInvestigationParams): Promise<InvestigationSaveResult>;

  getSavedResearch(
    user_id: string | undefined | null,
  ): Promise<InvestigationsSavedReponseSchemaType>;
  hydrateInvestigation(
    params: HydrateInvestigationParams,
  ): Promise<HydrateInvestigationResult>;
}
