import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../../../types/databaseInterfaces";
import {
  validateOrThrow,
  validateServerOrThrow,
} from "../../../../core/validation/validateOrThrow";
import {
  InvestigationSchemaType,
  InvestigationSchema,
} from "../../../../schemas/InvestigationSchema";
import type { AuthenticatedUserId } from "../../../../services/auth/authorization";
import { ServerError } from "../../../../core/errors/ServerError";

export type InsertableInvestigation =
  Database["public"]["Tables"]["investigations"]["Insert"];

export interface IInvestigationsRepository {
  save(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSchemaType>;
}

export class InvestigationsRepository implements IInvestigationsRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async save(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSchemaType> {
    return await this.executeSave(investigation, user_id);
  }

  private async executeSave(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSchemaType> {
    const validatedInput = this.validateInvestigationInput(investigation);
    const insertable = this.toInsertableInvestigation(validatedInput, user_id);
    return this.insertInvestigation(insertable);
  }

  private async insertInvestigation(
    investigation: unknown,
  ): Promise<InvestigationSchemaType> {
    const { data, error } = await this.db
      .from("investigations")
      .upsert([investigation])
      .select()
      .single();

    if (error) {
      throw new ServerError("Failed to save investigation", 500, error.details);
    }

    return this.validateInvestigation(data);
  }

  private toInsertableInvestigation(
    investigation: InvestigationSchemaType,
    id: AuthenticatedUserId,
  ): InsertableInvestigation {
    const {
      idea,
      initial_perspective,
      premises,
      ending_perspective,
      changed_opinion,
      new_concepts,
      takeaway,
      had_merit,
      sources,
      wikipedia_extracts,
      biases,
    } = investigation;

    return {
      idea: idea,
      biases: biases,
      initial_perspective: initial_perspective,
      premises: premises,
      ending_perspective: ending_perspective,
      changed_opinion: changed_opinion,
      new_concepts: new_concepts,
      takeaway: takeaway,
      had_merit: had_merit,
      user_id: id,
      sources: sources,
      wikipedia_extracts: wikipedia_extracts,
    };
  }

  private validateInvestigation(raw: unknown): InvestigationSchemaType {
    return validateServerOrThrow(InvestigationSchema, raw);
  }

  private validateInvestigationInput(
    investigation: unknown,
  ): InvestigationSchemaType {
    return validateOrThrow(InvestigationSchema, investigation);
  }
}
