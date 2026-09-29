import { InvestigationAndSourcesResponseSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import { SaveInvestigationParams } from "../types.ts";

export interface IInvestigationServiceWriteHandler {
  investigation(
    params: SaveInvestigationParams,
  ): Promise<InvestigationAndSourcesResponseSchemaType>;
}

export class InvestigationServiceWriteHandler implements IInvestigationServiceWriteHandler {
  constructor(
    private readonly db: Pick<IDbClient, "investigations">,
    private readonly policy: IAuthorization,
  ) {}

  public async investigation(params: SaveInvestigationParams) {
    return await this.executeSave(params);
  }

  private async executeSave(
    params: SaveInvestigationParams,
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    const userId = this.policy.requireAuthenticated(params.user_id);
    return await this.db.investigations.write.investigation({
      articleIds: params.articleIds,
      investigation: params.investigation,
      userId: userId,
      extracts: params.extracts,
    });
  }
}
