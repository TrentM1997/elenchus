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

type InvestigationDbOperation<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; details: string };

export type InvestigationSaveResult =
  InvestigationDbOperation<InvestigationSchemaType>;

export type SavedInvestigationsResult = InvestigationDbOperation<
  InvestigationSchemaType[]
>;

export type InsertableInvestigation =
  Database["public"]["Tables"]["investigations"]["Insert"];

export interface IInvestigationsRepository {
  save(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSaveResult>;
  getSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult>;
}

export class InvestigationsRepository implements IInvestigationsRepository {
  constructor(private readonly db: SupabaseClient<Database>) {}

  public async getSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    return await this.executeGetSavedInvestigations(user_id);
  }

  public async save(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSaveResult> {
    return await this.executeSave(investigation, user_id);
  }

  private async executeGetSavedInvestigations(
    user_id: AuthenticatedUserId,
  ): Promise<SavedInvestigationsResult> {
    const { data, error } = await this.db
      .from("investigations")
      .select()
      .eq("user_id", user_id)
      .order("created_at");

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return {
      ok: true,
      data: this.validateInvestigations(data),
    };
  }

  private async executeSave(
    investigation: unknown,
    user_id: AuthenticatedUserId,
  ): Promise<InvestigationSaveResult> {
    const validatedInput = this.validateInvestigationInput(investigation);
    const insertable = this.toInsertableInvestigation(validatedInput, user_id);
    return this.insertInvestigation(insertable);
  }

  private async insertInvestigation(
    investigation: InsertableInvestigation,
  ): Promise<InvestigationSaveResult> {
    const { data, error } = await this.db
      .from("investigations")
      .upsert([investigation])
      .select()
      .single();

    if (error) {
      return {
        ok: false,
        message: error.message,
        details: error.details,
      };
    }

    return { ok: true, data: this.validateInvestigation(data) };
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

  private validateInvestigations(
    results: unknown[],
  ): InvestigationSchemaType[] {
    const investigations = [];

    for (const result of results) {
      const investigation = validateServerOrThrow(InvestigationSchema, result);
      investigations.push(investigation);
    }
    return investigations;
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
