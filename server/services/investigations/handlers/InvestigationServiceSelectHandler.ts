import {
  InvestigationSchemaType,
  SelectedInvestigationPayloadSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import { HydrateInvestigationParams } from "../types.ts";
import { SavedInvestigationsResult } from "../../../db/access/repositories/investigations/investigationsRepository.ts";
import { DbResult } from "../../../db/types/types.ts";

export interface IInvestigationServiceSelectHandler {
  all(user_id: string | undefined | null): Promise<SavedInvestigationsResult>;
  byId(
    params: HydrateInvestigationParams,
  ): Promise<DbResult<SelectedInvestigationPayloadSchemaType>>;
}

export class InvestigationServiceSelectHandler implements IInvestigationServiceSelectHandler {
  constructor(
    private readonly db: Pick<IDbClient, "investigations">,
    private readonly policy: IAuthorization,
  ) {}

  public async all(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult> {
    return await this.executeGetSavedResearch(user_id);
  }

  public async byId(params: HydrateInvestigationParams) {
    const { user_id, investigation_id } = params;
    return await this.executeGetInvestigation(user_id, investigation_id);
  }

  private async executeGetInvestigation(
    user_id: string | undefined | null,
    investigation_id: InvestigationSchemaType["id"],
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.select.bId(userId, investigation_id);
  }

  private async executeGetSavedResearch(user_id: string | undefined | null) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.select.all(userId);
  }
}
