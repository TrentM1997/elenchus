import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces.js";
import { IInvestigationsRepositoryParser } from "./InvestigationsRespositoryParser.ts";
import { AuthenticatedUserId } from "../../../../services/auth/authorization.ts";
import { SavedInvestigationsResult } from "./investigationsRepository.ts";
import {
  InvestigationAndSourcesResponseSchemaType,
  InvestigationSchemaType,
} from "@elenchus/contracts/schemas/investigations/InvestigationSchema";

export interface IInvestigationSelectHandler {
  all(user_id: AuthenticatedUserId): Promise<SavedInvestigationsResult>;
  bId(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationAndSourcesResponseSchemaType>;
}

export class InvestigationSelectHandler implements IInvestigationSelectHandler {
  constructor(
    private readonly db: SupabaseClient<Database>,
    private readonly parser: IInvestigationsRepositoryParser,
  ) {}

  public async all(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    return await this.executeGetSavedInvestigations(user_id);
  }

  public async bId(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    return await this.selectById(user_id, investigation_id);
  }

  private async selectById(
    user_id: AuthenticatedUserId,
    investigation_id: InvestigationSchemaType["id"],
  ): Promise<InvestigationAndSourcesResponseSchemaType> {
    const { data, error } = await this.db.rpc("hydrate_investigation", {
      p_investigation_id: investigation_id,
      p_user_id: user_id,
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }
    return {
      ok: true,
      data: this.parser.validateSelectedInvestigation(data),
    };
  }

  private async executeGetSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    const { data, error } = await this.db
      .from("investigations")
      .select()
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.parser.validateInvestigations(data),
    };
  }
}
