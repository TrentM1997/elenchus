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

export interface IInvestigationService {
  save(
    user_id: string | undefined | null,
    investigation: PersistInvestigationInputSchemaType,
  ): Promise<InvestigationSaveResult>;
  getSavedResearch(
    user_id: string | undefined | null,
  ): Promise<SavedInvestigationsResult>;
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
