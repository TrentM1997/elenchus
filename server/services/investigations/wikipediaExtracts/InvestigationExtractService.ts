import { InvestigationSchemaType } from "@elenchus/contracts/schemas/investigations/InvestigationSchema";
import { IDbClient } from "../../../db/access/client/dbClient.ts";
import { IAuthorization } from "../../auth/authorization.ts";
import type {
  InvestigationExtractRow,
  SavedExtractSchemaType,
} from "@elenchus/contracts/schemas/integrations/InvestigationExtractRowSchema";
import { DbResult } from "../../../db/types/types.ts";
import { InvestigationExtractsToPersist } from "../types.ts";

export type SaveExtractsArgs = {
  user_id: string | undefined | null;
  investigation_id: InvestigationSchemaType["id"];
  extracts: InvestigationExtractsToPersist[];
};

export type FromInvestigationArgs = {
  user_id: string | undefined | null;
  investigation_id: InvestigationSchemaType["id"];
};

export interface IInvestigationExtractService {
  saveExtracts(
    params: SaveExtractsArgs,
  ): Promise<DbResult<InvestigationExtractRow[]>>;
  fromInvestigation(
    params: FromInvestigationArgs,
  ): Promise<DbResult<SavedExtractSchemaType[]>>;
}

export class InvestigationExtractService implements IInvestigationExtractService {
  constructor(
    private readonly db: Pick<IDbClient, "wikiExtracts">,
    private readonly policy: IAuthorization,
  ) {}

  public async saveExtracts(
    params: SaveExtractsArgs,
  ): Promise<DbResult<InvestigationExtractRow[]>> {
    return this.executeSaveExtracts(params);
  }

  public async fromInvestigation(
    params: FromInvestigationArgs,
  ): Promise<DbResult<SavedExtractSchemaType[]>> {
    return await this.executeFromInvestigation(params);
  }

  private async executeSaveExtracts(params: SaveExtractsArgs) {
    const userId = this.policy.requireAuthenticated(params.user_id);

    return await this.db.wikiExtracts.write.extracts({
      userId,
      extracts: params.extracts,
      investigation_id: params.investigation_id,
    });
  }

  private async executeFromInvestigation(
    params: FromInvestigationArgs,
  ): Promise<DbResult<SavedExtractSchemaType[]>> {
    const userId = this.policy.requireAuthenticated(params.user_id);

    return await this.db.wikiExtracts.select.extracts(
      userId,
      params.investigation_id,
    );
  }
}
