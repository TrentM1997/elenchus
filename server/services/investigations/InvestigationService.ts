import { IDbClient } from "../../db/access/client/dbClient.js";
import { IAuthorization } from "../auth/authorization.js";
import {
  InvestigationSchemaType,
  PersistInvestigationInputSchemaType,
} from "../../schemas/InvestigationSchema.js";
import {
  InvestigationSaveResult,
  SavedInvestigationsResult,
} from "../../db/access/repositories/investigations/investigationsRepository.js";
import { DbResult } from "../../db/types/types.ts";

export interface IInvestigationService {
  save(
    user_id: string | undefined | null,
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResult>;
  getSavedResearch(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult>;
  getInvestigation(params: {
    user_id: string | undefined | null;
    investigation_id: InvestigationSchemaType["id"];
  }): Promise<DbResult<InvestigationSchemaType>>;
}

export class InvestionService implements IInvestigationService {
  constructor(
    private readonly db: Pick<IDbClient, "investigations">,
    private readonly policy: IAuthorization,
  ) {}

  public async save(
    user_id: string | undefined | null,
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResult> {
    return await this.executeSave(user_id, investigation);
  }

  public async getSavedResearch(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult> {
    return await this.executeGetSavedResearch(user_id);
  }

  public async getInvestigation(params: {
    user_id: string | undefined | null;
    investigation_id: InvestigationSchemaType["id"];
  }): Promise<DbResult<InvestigationSchemaType>> {
    const { user_id, investigation_id } = params;
    return await this.executeGetInvestigation(user_id, investigation_id);
  }

  private async executeGetInvestigation(
    user_id: string | undefined | null,
    investigation_id: InvestigationSchemaType["id"],
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.selectById(userId, investigation_id);
  }

  private async executeGetSavedResearch(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult> {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.getSavedInvestigations(userId);
  }

  private async executeSave(
    user_id: string | undefined | null,
    investigation: PersistInvestigationInputSchemaType,
  ) {
    const userId = this.policy.requireAuthenticated(user_id);
    return await this.db.investigations.save(investigation, userId);
  }
}
